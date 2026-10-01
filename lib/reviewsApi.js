import { createClient } from "./httpClient";

const REVIEWS_API_URL =
  process.env.NEXT_PUBLIC_REVIEWS_API_URL || "https://backend-blogs-sspm.onrender.com/api/reviews";

const reviewsApi = createClient(REVIEWS_API_URL);

export default reviewsApi;
