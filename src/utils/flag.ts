/**
 * Returns the URL to a flag SVG image for a given ISO 3166-1 alpha-2 country code.
 *
 * Uses flagcdn.com (free CDN). Windows does not render Unicode flag emojis,
 * so we use actual images instead.
 */
export function countryFlagUrl(countryCode: string): string {
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
}
