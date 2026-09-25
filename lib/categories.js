/**
 * Shared blog category list.
 *
 * Used by: signup (pick topics you want to write about), the blog listing
 * filter pills, and the new/edit post forms (assign a post's category).
 *
 * NOTE for backend: for filtering and saving to actually persist, the Django
 * Post model / serializer needs a `category` field (a CharField with these
 * `id`s as choices works well), and the register/profile serializers need a
 * `preferred_categories` field (JSONField or M2M) to store what a new user
 * picks on signup. Until then these are sent along with each request but may
 * be silently ignored by DRF.
 */
export const BLOG_CATEGORIES = [
  { id: "technology", label: "Technology", icon: "💻" },
  { id: "career", label: "Career & Growth", icon: "🚀" },
  { id: "design", label: "Design & Creativity", icon: "🎨" },
  { id: "lifestyle", label: "Lifestyle", icon: "🌿" },
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "health", label: "Health & Wellness", icon: "💪" },
  { id: "business", label: "Business & Finance", icon: "📈" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "food", label: "Food & Cooking", icon: "🍳" },
  { id: "personal", label: "Personal Stories", icon: "✨" },
];

export function categoryLabel(id) {
  return BLOG_CATEGORIES.find((c) => c.id === id)?.label || id;
}

export function categoryIcon(id) {
  return BLOG_CATEGORIES.find((c) => c.id === id)?.icon || "📝";
}

export default BLOG_CATEGORIES;
