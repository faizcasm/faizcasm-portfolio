import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { getAdminPost } from "@/lib/posts";

export const metadata = {
  title: "Edit post",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getAdminPost(params.id);
  if (!post) notFound();

  return (
    <PostEditor
      originalId={post.id}
      initial={{
        id: post.id,
        title: post.title,
        date: post.date,
        author: post.author,
        category: post.category,
        description: post.description,
        tags: post.tags,
        cover: post.cover ?? "",
        content: post.content,
        published: post.published,
      }}
    />
  );
}
