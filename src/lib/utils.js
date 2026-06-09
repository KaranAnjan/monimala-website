export const toSlug = (str) => str?.toLowerCase().replace(/\s+/g, '-') || ''

export const formatName = (str) =>
  str?.replace(/\b\w/g, (c) => c.toUpperCase()) || ''
