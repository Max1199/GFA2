const GA_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;
const FB_ID = process.env.REACT_APP_FB_PIXEL_ID;

export function initTracking() {
  if (GA_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }
  if (FB_ID) {
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq("init", FB_ID);
    window.fbq("track", "PageView");
  }
}

export function track(event, params = {}) {
  if (window.gtag) window.gtag("event", event, params);
  if (window.fbq) window.fbq("trackCustom", event, params);
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, params);
}

export const trackCta = (channel, location) => track("cta_click", { channel, location });
