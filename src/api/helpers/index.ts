export function concatenateUrlParts(options: { baseUrl: string; path: string }): string {
  const { baseUrl, path } = options;

  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

  return normalizedBaseUrl + normalizedPath;
}
