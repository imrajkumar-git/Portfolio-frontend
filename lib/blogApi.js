import { createClient } from "./httpClient";

const BLOG_API_URL =
  process.env.NEXT_PUBLIC_BLOG_API_URL || "http://192.168.0.120:8000/api/blog";

const blogApi = createClient(BLOG_API_URL);

export default blogApi;
