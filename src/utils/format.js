export const formatCategory = (category, fallback = "NEWS") => {
  if (!category) return fallback;
  if (Array.isArray(category)) {
    return category.length > 0 && category[0] ? String(category[0]).toUpperCase() : fallback;
  }
  if (typeof category === "string") {
    return category.toUpperCase();
  }
  return fallback;
};

export const formatSource = (source, fallback = "News Wire") => {
  if (!source) return fallback;
  if (Array.isArray(source)) {
    return source.length > 0 && source[0] ? String(source[0]) : fallback;
  }
  return String(source);
};
