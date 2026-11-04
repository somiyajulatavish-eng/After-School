import Image, { type ImageProps } from 'next/image';

/**
 * Catalogue artwork is vector SVG, so it is served as-is (no raster optimisation needed)
 * while still getting next/image's lazy loading and layout-shift protection.
 */
export function Img({ alt, ...props }: ImageProps) {
  return <Image alt={alt} unoptimized {...props} />;
}
