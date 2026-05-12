(function (window, document) {
  "use strict";

  function domReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function syncIcon() {
    try {
      if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();
      }
    } catch (e) {}
  }

  domReady(function () {
    document.querySelectorAll(".toggle-pass").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sel = btn.getAttribute("data-target");
        var inp = sel ? document.querySelector(sel) : null;
        if (!inp) return;
        var t = inp.getAttribute("type") === "password" ? "text" : "password";
        inp.setAttribute("type", t);
        var name = t === "password" ? "eye" : "eye-off";
        btn.innerHTML = '<i data-lucide="' + name + '"></i>';
        syncIcon();
      });
    });

    document.querySelectorAll("#loginForm, #registerForm").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
      });
    });

    syncIcon();
  });
})(window, document);
