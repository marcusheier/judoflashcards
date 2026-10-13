'use strict';

(() => {
  const productionHosts = new Set([
    'judoflashcards.com',
    'www.judoflashcards.com'
  ]);

  // Keep local previews and copied files out of the production analytics data.
  if (!productionHosts.has(window.location.hostname)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Privacy-restricted Consent Mode: Google Analytics can receive cookieless
  // measurements, but analytics and advertising storage remain disabled.
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  window.gtag('set', 'ads_data_redaction', true);
  window.gtag('js', new Date());
  window.gtag('config', 'G-65TKK711NK', {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const analyticsScript = document.createElement('script');
  analyticsScript.async = true;
  analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-65TKK711NK';
  document.head.append(analyticsScript);
})();
