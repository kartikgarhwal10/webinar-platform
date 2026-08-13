declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Log page views
 */
export const pageView = (url: string) => {
  if (typeof window === "undefined") return;
  
  if (GA_TRACKING_ID && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
  
  if (FB_PIXEL_ID && window.fbq) {
    window.fbq("track", "PageView");
  }
};

/**
 * Log specific actions (clicks, form completions, etc.)
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window === "undefined") return;

  // Google Analytics 4 mapping
  if (GA_TRACKING_ID && window.gtag) {
    window.gtag("event", eventName, params);
  }

  // Meta Pixel mapping
  if (FB_PIXEL_ID && window.fbq) {
    switch (eventName) {
      case "registration_success":
        window.fbq("track", "CompleteRegistration", {
          content_name: params?.webinar_title || "Webinar",
          status: "Complete",
          value: 0.00,
          currency: "USD",
          ...params
        });
        break;
      case "form_start":
        window.fbq("track", "Lead", {
          content_category: "Webinar",
          content_name: params?.webinar_title || "Form Start",
          ...params
        });
        break;
      case "page_view":
        window.fbq("track", "PageView");
        break;
      case "hero_cta_click":
      case "cta_click":
        window.fbq("track", "ViewContent", {
          content_name: "CTA Click",
          ...params
        });
        break;
      default:
        window.fbq("trackCustom", eventName, params);
        break;
    }
  }

  // Local logging in non-production environments
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Analytics Event] "${eventName}":`, params);
  }
};
