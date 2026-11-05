import { getSeoForPage } from "@/lib/seoManager";
import { blogArticles } from "@/lib/blogData";
import BlogView from "@/components/BlogView";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return await getSeoForPage("blog");
}

export default function Blog() {
  return <BlogView articles={blogArticles} />;
}
