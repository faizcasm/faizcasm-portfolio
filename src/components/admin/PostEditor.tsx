"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import MarkdownContent from "@/components/MarkdownContent";
import { savePostAction, type ActionState } from "@/app/admin/actions";
import type { PostInput } from "@/lib/posts";

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400";
const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

interface PostEditorProps {
  /** "" when creating a new post. */
  originalId: string;
  /** Initial values; tags may be the raw string[] from the database. */
  initial?: Partial<Omit<PostInput, "tags">> & { tags?: string[] | string };
}

export default function PostEditor({ originalId, initial }: PostEditorProps) {
  const router = useRouter();
  const isNew = originalId === "";

  const [content, setContent] = useState(initial?.content ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [slug, setSlug] = useState(initial?.id ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  // On small screens the editor switches between write / preview panes.
  const [showPreview, setShowPreview] = useState(false);

  const [state, formAction] = useFormState<ActionState, FormData>(
    savePostAction.bind(null, originalId),
    {}
  );

  // Auto-suggest the slug from the title until the editor edits it by hand.
  useEffect(() => {
    if (isNew && !slugTouched) {
      setSlug(
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 96)
      );
    }
  }, [title, isNew, slugTouched]);

  // A rejected action (expired session) returns an error — send to login.
  useEffect(() => {
    if (state.error && /session|log ?in|not configured/i.test(state.error)) {
      router.push("/admin/login");
    }
  }, [state.error, router]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isNew ? "New post" : `Edit: ${originalId}`}
        </h1>
        <SubmitButton label={isNew ? "Create post" : "Save changes"} />
      </div>

      {state.error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}

      {/* ------------------------- metadata ------------------------- */}
      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              maxLength={200}
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Building Better Developer Tools"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="id">
              Slug{" "}
              <span className="font-normal text-gray-400">
                (URL: /blog/{slug || "…"})
              </span>
            </label>
            <input
              id="id"
              name="id"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              title="Lowercase letters, numbers and hyphens only"
              className={`${inputClass} font-mono`}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="date">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className={inputClass}
                defaultValue={initial?.date ?? today}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="category">
                Category
              </label>
              <input
                id="category"
                name="category"
                maxLength={60}
                className={inputClass}
                defaultValue={initial?.category ?? ""}
                placeholder="Web Development"
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="tags">
              Tags{" "}
              <span className="font-normal text-gray-400">
                (comma-separated)
              </span>
            </label>
            <input
              id="tags"
              name="tags"
              className={inputClass}
              defaultValue={
                Array.isArray(initial?.tags)
                  ? initial.tags.join(", ")
                  : (initial?.tags ?? "")
              }
              placeholder="Next.js, React, TypeScript"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="author">
              Author
            </label>
            <input
              id="author"
              name="author"
              maxLength={80}
              className={inputClass}
              defaultValue={initial?.author ?? "Faizan Hameed"}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="description">
              Description{" "}
              <span className="font-normal text-gray-400">
                (shown in listings &amp; link previews)
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              maxLength={500}
              className={inputClass}
              defaultValue={initial?.description ?? ""}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="cover">
              Cover image{" "}
              <span className="font-normal text-gray-400">
                (/images/… or https://)
              </span>
            </label>
            <input
              id="cover"
              name="cover"
              className={inputClass}
              defaultValue={initial?.cover ?? ""}
              placeholder={`/images/${slug || "my-post"}.jpg`}
            />
          </div>

          <label className="flex items-end gap-2 pb-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="published"
              defaultChecked={initial?.published ?? true}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Published (visible to visitors)
          </label>
        </div>
      </div>

      {/* ------------------- write / preview ------------------- */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {content.length.toLocaleString()} chars
            </span>
            <div className="flex overflow-hidden rounded-md border border-gray-300 text-xs dark:border-gray-600 lg:hidden">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`px-3 py-1 ${
                  !showPreview
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`px-3 py-1 ${
                  showPreview
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2">
          <textarea
            id="content"
            name="content"
            required
            rows={28}
            className={`block w-full resize-y bg-white px-4 py-3 font-mono text-xs leading-relaxed text-gray-900 outline-none dark:bg-gray-900 dark:text-gray-100 lg:border-r lg:border-gray-200 dark:lg:border-gray-700 ${
              showPreview ? "hidden lg:block" : "block"
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"## Heading\n\nWrite your post in markdown…"}
          />
          <div
            className={`min-h-[24rem] bg-gray-50 px-4 py-3 dark:bg-gray-900 ${
              showPreview ? "block" : "hidden lg:block"
            }`}
          >
            {content.trim() ? (
              <MarkdownContent content={content} />
            ) : (
              <p className="text-sm text-gray-400">Nothing to preview yet.</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
