export const getImgUrl = (path) => {
  if (!path) return `${import.meta.env.BASE_URL}food_hero_1.png`
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path
  }
  const cleanPath = path.replace(/^(\.\/|\/)/, "")
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : import.meta.env.BASE_URL + "/"
  return `${base}${cleanPath}`
}
