import { createClient } from "./httpClient";

const REVIEWS_API_URL =
  process.env.NEXT_PUBLIC_REVIEWS_API_URL || "http://192.168.0.120:8000/api/reviews";

const reviewsApi = createClient(REVIEWS_API_URL);

export default reviewsApi;
