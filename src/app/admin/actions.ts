"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminConfigured,
  clearFailedLogins,
  createSession,
  destroySession,
  isAuthenticated,
  isLoginRateLimited,
  registerFailedLogin,
  verifyCredentials,
} from "@/lib/auth";
import {
  createPost,
  deletePost,
  togglePublished,
  updatePost,
  ValidationError,
  type PostInput,
} from "@/lib/posts";

export interface ActionState {
  error?: string;
  success?: string;
}

function revalidateBlog(postId?: string) {
  // Public blog, homepage (latest posts) and the layout command palette all
  // read posts — refresh everything affected.
  revalidatePath("/");
  revalidatePath("/blog");
  if (postId) revalidatePath(`/blog/${postId}`);
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!adminConfigured()) {
    return {
      error:
        "Admin login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in the environment.",
    };
  }
  if (isLoginRateLimited(username)) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }
  if (!username || !password) {
    return { error: "Enter both username and password." };
  }

  if (!verifyCredentials(username, password)) {
    registerFailedLogin(username);
    return { error: "Invalid username or password." };
  }

  try {
    await createSession();
  } catch (error) {
    return { error: (error as Error).message };
  }
  clearFailedLogins(username);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/**
 * Server actions are endpoints: they must authenticate themselves rather
 * than relying on the admin layout's redirect.
 */
async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function savePostAction(
  originalId: string, // "" when creating
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const input: PostInput = {
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    date: String(formData.get("date") ?? ""),
    author: String(formData.get("author") ?? ""),
    category: String(formData.get("category") ?? ""),
    description: String(formData.get("description") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    cover: String(formData.get("cover") ?? ""),
    content: String(formData.get("content") ?? ""),
    published: formData.get("published") === "on",
  };

  try {
    const post = originalId
      ? await updatePost(originalId, input)
      : await createPost(input);
    revalidateBlog(post.id);
    redirect("/admin");
  } catch (error) {
    if (error instanceof ValidationError) {
      return { error: error.message };
    }
    // redirect() throws internally — let it propagate.
    throw error;
  }
}

export async function deletePostAction(id: string): Promise<ActionState> {
  await requireAdmin();
  try {
    await deletePost(id);
    revalidateBlog(id);
    return { success: `Deleted "${id}".` };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function togglePublishedAction(id: string): Promise<ActionState> {
  await requireAdmin();
  try {
    const published = await togglePublished(id);
    revalidateBlog(id);
    return { success: published ? `Published "${id}".` : `Unpublished "${id}".` };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
