/* Local compatibility for the captured application. No remote services required. */
(() => {
  'use strict';
  const originalHosts = new Set(['ricardochance.com', 'www.ricardochance.com']);
  function route(value) {
    const url = new URL(typeof value === 'string' ? value : value.pathname, location.href);
    if (url.origin !== location.origin && !originalHosts.has(url.hostname)) return url.href;
    let path = url.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/index\.html$/, '/');
    path = path.replace(/\/{2,}/g, '/');
    if (!path) path = '/';
    if (['/about', '/work'].includes(path)) path += '/';
    return path + url.search + url.hash;
  }
  function asset(value) {
    const raw = value instanceof Request ? value.url : String(value);
    const url = new URL(raw, location.href);
    if (originalHosts.has(url.hostname)) {
      url.protocol = location.protocol;
      url.host = location.host;
    }
    if (url.origin === location.origin && url.pathname === '/_next/image') {
      const source = url.searchParams.get('url');
      if (source && source.startsWith('/') && !source.startsWith('//')) return source;
    }
    if (url.origin !== location.origin && !['data:', 'blob:'].includes(url.protocol)) {
      throw new TypeError('This copy only loads bundled local resources.');
    }
    return url.href;
  }
  const nativeFetch = window.fetch.bind(window);
  window.fetch = function(input, options) {
    try {
      const mapped = asset(input);
      return nativeFetch(input instanceof Request ? new Request(mapped, input) : mapped, options);
    } catch (error) { return Promise.reject(error); }
  };
  const nativeOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    return nativeOpen.call(this, method, asset(url), ...args);
  };
  window.localSite = Object.freeze({
    route,
    prepareContact: async function(data) {
      if (!data.name?.trim() || !data.message?.trim() || !data.email?.trim()) return {success:false,error:'missing_fields'};
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return {success:false,error:'invalid_email'};
      const subject = 'Project enquiry from ' + data.name.trim();
      const body = ['Name: ' + data.name, 'Email: ' + data.email, 'Company: ' + data.company,
        'Services: ' + data.services, 'Budget: ' + data.budget, '', data.message].join('\n');
      const link = document.createElement('a');
      link.href = 'mailto:hello@ricardochance.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      document.body.appendChild(link); link.click(); link.remove();
      return {success:true};
    }
  });
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    const path = url.pathname.replace(/\/$/, '') || '/';
    if (url.origin === location.origin && ['/', '/en', '/about', '/work', '/en/about', '/en/work'].includes(path)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.assign(route(url.href));
    }
  }, true);
})();