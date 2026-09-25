/**
 * Turns an axios error from the Django API into one readable sentence.
 *
 * DRF returns field errors as `{ field: ["message", ...] }`, which is useful
 * to show verbatim — an upload that's too large or the wrong type comes back
 * this way and the author needs to know which it was.
 */
export function errorMessage(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data;
  if (!data) return fallback;

  if (typeof data === "string") return data;
  if (data.detail) return String(data.detail);

  const parts = Object.entries(data).flatMap(([field, value]) => {
    const messages = Array.isArray(value) ? value : [value];
    const label = field === "non_field_errors" ? "" : `${field.replace(/_/g, " ")}: `;
    return messages.map((m) => `${label}${m}`);
  });

  return parts.length ? parts.join(" ") : fallback;
}

export default errorMessage;
