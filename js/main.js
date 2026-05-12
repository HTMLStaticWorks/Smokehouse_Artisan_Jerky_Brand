(function (window, document) {
  "use strict";

  var prefersCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  var isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || prefersCoarsePointer;
  var loaderDismissed = false;

  function domReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function dismissLoader() {
    if (loaderDismissed) return;
    loaderDismissed = true;
    var el = document.getElementById("page-loader");
    if (el) el.classList.add("is-done");
  }

  function initTheme() {
    var saved = localStorage.getItem("eo-theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
      document.body.setAttribute("data-bs-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.body.setAttribute("data-bs-theme", "dark");
    }
    updateThemeIcon();
  }

  function updateThemeIcon() {
    var icon = document.getElementById("themeIcon");
    if (!icon) return;
    var isLight = document.documentElement.classList.contains("light");
    icon.setAttribute("data-lucide", isLight ? "moon" : "sun");
    try {
      if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();
      }
    } catch (e) {}
  }

  function toggleTheme() {
    document.documentElement.classList.toggle("light");
    var light = document.documentElement.classList.contains("light");
    localStorage.setItem("eo-theme", light ? "light" : "dark");
    document.body.setAttribute("data-bs-theme", light ? "light" : "dark");
    updateThemeIcon();
  }

  function initRtl() {
    var rtl = localStorage.getItem("eo-rtl") === "1";
    document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
  }

  function toggleRtl() {
    var cur = document.documentElement.getAttribute("dir") === "rtl";
    document.documentElement.setAttribute("dir", cur ? "ltr" : "rtl");
    localStorage.setItem("eo-rtl", cur ? "0" : "1");
  }

  function setActiveNav() {
    var key = document.body.getAttribute("data-nav");
    if (!key) return;
    document.querySelectorAll('.nav-link[data-nav="' + key + '"]').forEach(function (a) {
      a.classList.add("active");
    });
  }

  function initLoader() {
    var el = document.getElementById("page-loader");
    if (!el) return;
    setTimeout(dismissLoader, 500);
    window.addEventListener("load", function () {
      setTimeout(dismissLoader, 200);
    });
    setTimeout(dismissLoader, 2400);
  }

  function initNavbarScroll() {
    var nav = document.querySelector(".site-navbar");
    if (!nav) return;
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY || 0;
        nav.classList.toggle("navbar-scrolled", y > 24);
      },
      { passive: true }
    );
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  function initParallax() {
    var nodes = document.querySelectorAll("[data-parallax]");
    if (!nodes.length) return;
    var ticking = false;
    function update() {
      var y = window.scrollY || 0;
      nodes.forEach(function (n) {
        var speed = parseFloat(n.getAttribute("data-parallax") || "0.2");
        n.style.transform = "translate3d(0," + Math.round(y * speed * -1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  function initCounters() {
    document.querySelectorAll(".stat-value[data-count]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      if (isNaN(target)) return;
      var done = false;
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting || done) return;
            done = true;
            var start = 0;
            var dur = 1400;
            var t0 = null;
            function step(ts) {
              if (!t0) t0 = ts;
              var p = Math.min((ts - t0) / dur, 1);
              var eased = 1 - Math.pow(1 - p, 3);
              var val = Math.round(start + (target - start) * eased);
              el.textContent = String(val);
              if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            io.disconnect();
          });
        },
        { threshold: 0.35 }
      );
      io.observe(el);
    });
  }

  function initHeatMeters() {
    var meters = document.querySelectorAll(".heat-meter-fill");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-animated");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    meters.forEach(function (m) {
      io.observe(m);
    });
  }

  function initTilt() {
    if (isTouch) return;
    document.querySelectorAll(".tilt-3d").forEach(function (node) {
      node.addEventListener("mousemove", function (e) {
        var rect = node.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rx = (y / rect.height - 0.5) * -8;
        var ry = (x / rect.width - 0.5) * 10;
        node.style.setProperty("--rx", rx + "deg");
        node.style.setProperty("--ry", ry + "deg");
      });
      node.addEventListener("mouseleave", function () {
        node.style.setProperty("--rx", "0deg");
        node.style.setProperty("--ry", "0deg");
      });
    });
  }

  function initMagnetic() {
    if (isTouch) return;
    document.querySelectorAll(".magnetic-target").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate3d(" + dx * 0.12 + "px," + dy * 0.12 + "px,0)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate3d(0,0,0)";
      });
    });
  }


  function initHeroSpotlight() {
    var hero = document.querySelector(".hero-with-spotlight");
    if (!hero) return;
    hero.addEventListener(
      "mousemove",
      function (e) {
        var r = hero.getBoundingClientRect();
        var mx = ((e.clientX - r.left) / r.width) * 100;
        var my = ((e.clientY - r.top) / r.height) * 100;
        hero.style.setProperty("--mx", mx + "%");
        hero.style.setProperty("--my", my + "%");
      },
      { passive: true }
    );
  }

  function initParticles() {
    var c = document.getElementById("particle-canvas");
    if (!c || isTouch) return;
    var ctx = c.getContext("2d");
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var parts = [];
    var n = 48;
    function resize() {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn() {
      parts = [];
      for (var i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 2.2 + 0.3,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * 0.45 + 0.08,
        });
      }
    }
    resize();
    spawn();
    window.addEventListener("resize", function () {
      resize();
      spawn();
    });
    function tick() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      var isLight = document.documentElement.classList.contains("light");
      ctx.fillStyle = isLight ? "rgba(61,47,38,0.12)" : "rgba(232,220,200,0.14)";
      parts.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initLazyImages() {
    var imgs = document.querySelectorAll("img.lazy");
    if (!imgs.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var img = e.target;
          var src = img.getAttribute("data-src");
          if (src) {
            img.src = src;
            img.onload = function () {
              img.classList.add("loaded");
            };
          }
          io.unobserve(img);
        });
      },
      { rootMargin: "120px" }
    );
    imgs.forEach(function (img) {
      io.observe(img);
    });
  }

  function initTapFloatCards() {
    if (!isTouch) return;
    document.querySelectorAll(".float-card").forEach(function (card) {
      card.addEventListener("touchstart", function () {
        card.classList.add("is-tapped");
      });
      card.addEventListener("touchend", function () {
        setTimeout(function () {
          card.classList.remove("is-tapped");
        }, 180);
      });
      card.addEventListener("touchcancel", function () {
        card.classList.remove("is-tapped");
      });
    });
  }

  function bindGlobals() {
    document.body.addEventListener("click", function (e) {
      if (e.target.closest("#themeToggle")) {
        e.preventDefault();
        toggleTheme();
      }
      if (e.target.closest("#rtlToggle")) {
        e.preventDefault();
        toggleRtl();
      }
    });
    document.body.addEventListener("submit", function (e) {
      var form = e.target;
      if (!form || form.id !== "footerNewsletter") return;
      e.preventDefault();
      var done = function () {
        window.alert("Thank you — your smokehouse letter is on the way.");
      };
      if (window.jQuery && window.jQuery.ajax) {
        window.jQuery.ajax({ url: "data/products.json", method: "GET", dataType: "json" }).always(done);
      } else {
        fetch("data/products.json")
          .catch(function () {})
          .finally(done);
      }
    });
  }

  function applyImgDataUrls() {
    document.querySelectorAll("[data-img]").forEach(function (el) {
      var idx = parseInt(el.getAttribute("data-img"), 10);
      if (!window.JerkyImages || isNaN(idx)) return;
      var u = JerkyImages.url(idx);
      if (el.tagName === "IMG") {
        if (el.classList.contains("lazy")) {
          el.setAttribute("data-src", u);
        } else {
          el.setAttribute("src", u);
        }
      } else {
        el.style.backgroundImage = "url('" + u + "')";
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
      }
    });
  }

  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY || 0;
        if (y > 400) {
          btn.classList.add("is-visible");
        } else {
          btn.classList.remove("is-visible");
        }
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function boot() {
    document.body.classList.toggle("touch-device", isTouch);
    initTheme();
    initRtl();
    applyImgDataUrls();
    setActiveNav();
    initLoader();
    initNavbarScroll();
    initReveal();
    initParallax();
    initCounters();
    initHeatMeters();
    initTilt();
    initMagnetic();

    initHeroSpotlight();
    initParticles();
    initLazyImages();
    initTapFloatCards();
    initBackToTop();
    bindGlobals();
    try {
      if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();
      }
    } catch (err) {}
  }

  domReady(boot);
})(window, document);
