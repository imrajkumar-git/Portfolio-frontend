import { createClient } from "./httpClient";

const BLOG_API_URL =
  process.env.NEXT_PUBLIC_BLOG_API_URL || "https://backend-blogs-sspm.onrender.com/api/blog";

const blogApi = createClient(BLOG_API_URL);

export default blogApi;
