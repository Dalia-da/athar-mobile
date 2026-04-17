(function () {
  const isNative = !!window.Capacitor;
  window.__ATHAR_NATIVE__ = isNative;

  const addMeta = (name, content, attr = 'name') => {
    let el = document.head.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  addMeta('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover');

  document.addEventListener('DOMContentLoaded', function () {
    if (!isNative) return;

    document.documentElement.classList.add('native-app');
    document.body.classList.add('native-app');

    const style = document.createElement('style');
    style.textContent = `
      body.native-app { overscroll-behavior-y: contain; }
      .native-safe-top { padding-top: env(safe-area-inset-top, 0px); }
      .native-safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
    `;
    document.head.appendChild(style);

    const pwaBanner = document.getElementById('pwa-banner');
    if (pwaBanner) pwaBanner.style.display = 'none';

    if (typeof window.installPWA === 'function') {
      window.installPWA = function () {
        if (typeof window.showNotif === 'function') {
          window.showNotif('أنتِ تستخدمين النسخة المثبتة على الجوال بالفعل 📱');
        }
      };
    }

    const openLinksExternally = (event) => {
      const link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (/^https?:\/\//i.test(href) && window.Capacitor?.Plugins?.Browser?.open) {
        event.preventDefault();
        window.Capacitor.Plugins.Browser.open({ url: href });
      }
    };
    document.addEventListener('click', openLinksExternally, true);
  });
})();
