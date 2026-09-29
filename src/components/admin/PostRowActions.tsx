"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  deletePostAction,
  togglePublishedAction,
  type ActionState,
} from "@/app/admin/actions";
import type { AdminPost } from "@/lib/posts";

export default function PostRowActions({ post }: { post: AdminPost }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<ActionState>) {
    setError(null);
    startTransition(async () => {
      const state = await action();
      if (state.error) setError(state.error);
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {error && (
        <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
      )}
      <button
        type="button"
        disabled={isPending}
        onClick={() => run(() => togglePublishedAction(post.id))}
        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {post.published ? "Unpublish" : "Publish"}
      </button>
      <Link
        href={`/admin/posts/${post.id}/edit`}
        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Pencil size={12} />
        Edit
      </Link>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (
            window.confirm(
              `Delete "${post.title}"? This cannot be undone.`
            )
          ) {
            run(() => deletePostAction(post.id));
          }
        }}
        className="rounded-md border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
      >
        Delete
      </button>
    </div>
  );
}
