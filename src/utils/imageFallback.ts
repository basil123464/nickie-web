import React from 'react';

// Universal image fallback utility for Nickie Store
// Prevents any broken images or blank boxes when deployed on Vercel or live CDNs

export const DEFAULT_PRODUCT_FALLBACK = "/images/chelsea.jpeg";

export const CATEGORY_FALLBACKS: Record<string, string> = {
  season_26_27: "/images/chelsea.jpeg",
  retro_90s: "/images/brazil_ronaldo9_retro.jpg",
  custom_print: "/images/messi_custom_print_1787335485509.jpg",
  sublimation: "/images/sublimation_mug.jpg",
  stickers_banners: "/images/stickers_banners.jpg",
  hoodie: "/images/streetwear_hoodie.jpg",
  tshirt: "/images/streetwear_tee.jpg",
  accessories: "/images/snapback_cap.jpg",
  outerwear: "/images/windbreaker_jacket.jpg",
  bottoms: "/images/cargo_pants.jpg",
  jersey: "/images/arsenal.png",
};

/**
 * Handle image error and replace with a clean category fallback or SVG data-URI
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  category?: string,
  customFallback?: string
) {
  const target = e.currentTarget;
  // Prevent infinite error loop if fallback also errors
  if (target.dataset.triedFallback === 'true') {
    // Generate an inline SVG data URI as absolute last resort
    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23121212'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23f59e0b' font-family='sans-serif' font-weight='bold' font-size='18'%3ENICKIE STORE%3C/text%3E%3Ctext x='50%25' y='56%25' dominant-baseline='middle' text-anchor='middle' fill='%23888888' font-family='sans-serif' font-size='12'%3EAvailable upon Enquiry%3C/text%3E%3C/svg%3E";
    return;
  }

  target.dataset.triedFallback = 'true';
  const fallbackUrl = customFallback || (category && CATEGORY_FALLBACKS[category]) || DEFAULT_PRODUCT_FALLBACK;
  target.src = fallbackUrl;
}
