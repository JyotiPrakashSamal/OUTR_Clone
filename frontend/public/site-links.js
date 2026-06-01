/**
 * Shared link helpers for static OUTR pages (loaded before navbar-footer-loader on sub-pages if needed).
 */
(function (global) {
  function comingSoon(title) {
    return '/coming-soon.html?title=' + encodeURIComponent(title || 'This section');
  }

  global.OUTR_SITE_LINKS = {
    home: '/home.html',
    portal: '/portal',
    portalRole: function (role) {
      return '/portal?role=' + encodeURIComponent(role);
    },
    comingSoon: comingSoon,
    academicCouncil: '/academic-council',
    reactView: function (view) {
      return '/?view=' + encodeURIComponent(view);
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
