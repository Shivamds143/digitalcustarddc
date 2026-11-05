import { blogArticles } from "@/lib/blogData";
import BlogView from "@/components/BlogView";

export const metadata = {
  title: "Blog & Insights | Digital Custard",
  description: "Stay informed with the latest trends, strategies, and insights in digital marketing and technology.",
};

export default function Blog() {
  return <BlogView articles={blogArticles} />;
}
