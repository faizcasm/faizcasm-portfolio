import PostEditor from "@/components/admin/PostEditor";

export const metadata = {
  title: "New post",
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return <PostEditor originalId="" />;
}
