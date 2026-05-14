(function (window, document) {
  "use strict";

  var products = [];

  function domReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function cardHtml(p) {
    var img = window.JerkyImages ? JerkyImages.url(p.img) : "";
    var name = esc(p.name);
    var desc = esc(p.desc.substring(0, 90));
    return (
      '<div class="col-sm-6 col-xl-4">' +
      '  <article class="product-card float-card h-100 tilt-3d tilt-3d-inner" data-id="' +
      esc(p.id) +
      '">' +
      '    <div class="img-ratio">' +
      '      <img src="' +
      img +
      '" alt="' +
      name +
      '" loading="lazy" class="img-cover" />' +
      "    </div>" +
      '    <div class="p-4 text-center text-lg-start">' +
      '      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-center align-items-lg-start gap-2 mb-2">' +
      '        <h3 class="h5 mb-0">' +
      name +
      "</h3>" +
      '        <span class="small text-muted">' +
      esc(String(p.rating)) +
      " ★</span>" +
      "      </div>" +
      '      <p class="small text-muted mb-3">' +
      desc +
      "…</p>" +
      '      <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-secondary border-opacity-10">' +
      '        <span class="h5 mb-0 fw-bold" style="line-height: 1">$' +
      p.price.toFixed(2) +
      "</span>" +
      '        <button type="button" class="btn btn-sm btn-brand-secondary quick-view magnetic-target px-3 py-2" style="line-height: 1" data-id="' +
      esc(p.id) +
      '">Quick view</button>' +
      "      </div>" +
      "    </div>" +
      "  </article>" +
      "</div>"
    );
  }

  function render(list) {
    var grid = document.getElementById("productGrid");
    if (!grid) return;
    var rowClass = "row g-4 justify-content-center " + (list.length % 3 === 1 ? "row-odd-center" : "");
    grid.className = rowClass;
    grid.innerHTML = list.map(cardHtml).join("");
    try {
      if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();
      }
    } catch (e) { }
  }

  function filter(cat) {
    if (!cat || cat === "all") return products.slice();
    return products.filter(function (p) {
      return p.cat === cat;
    });
  }

  function openQuickView(id) {
    var p = products.find(function (x) {
      return x.id === id;
    });
    var bodyEl = document.getElementById("quickViewBody");
    if (!bodyEl) return;
    bodyEl.innerHTML = '<div class="text-center py-5 text-muted">Loading…</div>';
    var modalEl = document.getElementById("quickViewModal");
    if (modalEl && window.bootstrap && bootstrap.Modal) {
      var modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
    fetch("data/products.json")
      .then(function (r) {
        if (!r.ok) throw new Error("fail");
        return r.json();
      })
      .then(function (data) {
        var item = data.find(function (x) {
          return x.id === id;
        });
        if (!item) item = p;
        if (!item) {
          bodyEl.innerHTML = '<p class="text-danger mb-0">Product unavailable.</p>';
          return;
        }
        var img = window.JerkyImages ? JerkyImages.url(item.img) : "";
        var woodType = "Mixed Hardwood";
        if (item.name.includes("Oak")) woodType = "White Oak";
        else if (item.name.includes("Hickory")) woodType = "Shagbark Hickory";
        else if (item.name.includes("Mesquite")) woodType = "Honey Mesquite";
        else if (item.name.includes("Apple")) woodType = "Orchard Apple";
        else if (item.name.includes("Pecan")) woodType = "Native Pecan";
        else if (item.name.includes("Maple")) woodType = "Sugar Maple";

        bodyEl.innerHTML =
          '<div class="row g-4 align-items-center">' +
          '<div class="col-md-6"><div class="img-ratio"><img src="' +
          img +
          '" class="img-cover" alt=""/></div></div>' +
          '<div class="col-md-6 center-sm text-lg-start">' +
          '<h3 class="h4">' +
          esc(item.name) +
          "</h3>" +
          '<p class="text-muted">' +
          esc(item.desc) +
          "</p>" +
          '<div class="d-flex flex-wrap gap-2 mb-3 justify-content-center justify-content-lg-start">' +
          '<span class="badge rounded-pill bg-brand-secondary text-white small px-3 py-2">Wood: ' + esc(woodType) + '</span>' +
          '<span class="badge rounded-pill border border-secondary text-secondary small px-3 py-2">Batch: Reserve</span>' +
          "</div>" +
          '<div class="d-flex flex-wrap gap-3 align-items-center justify-content-center justify-content-lg-start mb-3">' +
          '<span class="h5 mb-0">$' +
          item.price.toFixed(2) +
          "</span>" +
          '<span class="badge rounded-pill border border-secondary text-secondary">' +
          esc(item.cat) +
          "</span>" +
          "</div>" +
          '<div class="mb-4">' +
          '<label class="small text-muted d-block mb-1">Heat index ' + item.heat + '/100</label>' +
          '<div class="heat-meter mb-2 mx-auto mx-lg-0" style="max-width:260px"><div class="heat-meter-fill is-animated" style="--heat:' +
          item.heat +
          '%;"></div></div>' +
          "</div>" +
          '<div class="mb-4">' +
          '<label class="small text-muted d-block mb-1">Smoke intensity ' + (Math.floor(item.heat * 0.8) + 10) + '/100</label>' +
          '<div class="heat-meter mb-2 mx-auto mx-lg-0" style="max-width:260px"><div class="heat-meter-fill is-animated" style="--heat:' +
          (Math.floor(item.heat * 0.8) + 10) +
          '%; background: var(--burnt-deep)"></div></div>' +
          "</div>" +
          '<div class="d-grid d-lg-block">' +
          '<button type="button" class="btn btn-brand-primary magnetic-target btn-lg px-5">Add to smokehouse order</button>' +
          "</div>" +
          "</div></div>";
        try {
          if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
          }
        } catch (e2) { }
      })
      .catch(function () {
        // Fallback for Quick View if fetch fails (file:// protocol)
        var item = products.find(function (x) { return x.id === id; });
        if (!item) {
          bodyEl.innerHTML = '<p class="text-danger">Could not load product details.</p>';
          return;
        }
        var img = window.JerkyImages ? JerkyImages.url(item.img) : "";
        var woodType = "Mixed Hardwood";
        if (item.name.includes("Oak")) woodType = "White Oak";
        else if (item.name.includes("Hickory")) woodType = "Shagbark Hickory";
        else if (item.name.includes("Mesquite")) woodType = "Honey Mesquite";
        else if (item.name.includes("Apple")) woodType = "Orchard Apple";
        else if (item.name.includes("Pecan")) woodType = "Native Pecan";
        else if (item.name.includes("Maple")) woodType = "Sugar Maple";

        bodyEl.innerHTML =
          '<div class="row g-4 align-items-center">' +
          '<div class="col-md-6"><div class="img-ratio"><img src="' +
          img +
          '" class="img-cover" alt=""/></div></div>' +
          '<div class="col-md-6 center-sm text-lg-start">' +
          '<h3 class="h4">' +
          esc(item.name) +
          "</h3>" +
          '<p class="text-muted">' +
          esc(item.desc) +
          "</p>" +
          '<div class="d-flex flex-wrap gap-2 mb-3 justify-content-center justify-content-lg-start">' +
          '<span class="badge rounded-pill bg-brand-secondary text-white small px-3 py-2">Wood: ' + esc(woodType) + '</span>' +
          '<span class="badge rounded-pill border border-secondary text-secondary small px-3 py-2">Batch: Reserve</span>' +
          "</div>" +
          '<div class="d-flex flex-wrap gap-3 align-items-center justify-content-center justify-content-lg-start mb-3">' +
          '<span class="h5 mb-0">$' +
          item.price.toFixed(2) +
          "</span>" +
          '<span class="badge rounded-pill border border-secondary text-secondary">' +
          esc(item.cat) +
          "</span>" +
          "</div>" +
          '<div class="mb-4">' +
          '<label class="small text-muted d-block mb-1">Heat index ' + item.heat + '/100</label>' +
          '<div class="heat-meter mb-2 mx-auto mx-lg-0" style="max-width:260px"><div class="heat-meter-fill is-animated" style="--heat:' +
          item.heat +
          '%;"></div></div>' +
          "</div>" +
          '<div class="mb-4">' +
          '<label class="small text-muted d-block mb-1">Smoke intensity ' + (Math.floor(item.heat * 0.8) + 10) + '/100</label>' +
          '<div class="heat-meter mb-2 mx-auto mx-lg-0" style="max-width:260px"><div class="heat-meter-fill is-animated" style="--heat:' +
          (Math.floor(item.heat * 0.8) + 10) +
          '%; background: var(--burnt-deep)"></div></div>' +
          "</div>" +
          '<div class="d-grid d-lg-block">' +
          '<button type="button" class="btn btn-brand-primary magnetic-target btn-lg px-5">Add to smokehouse order</button>' +
          "</div>" +
          "</div></div>";
        try {
          if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
          }
        } catch (e2) { }
      });
  }

  domReady(function () {
    var grid = document.getElementById("productGrid");
    if (!grid) return;

    var fallbackProducts = [
      { "id": "p1", "name": "Oak Smoked Original", "price": 14.99, "rating": 4.9, "heat": 25, "img": 0, "cat": "classic", "desc": "Hand-cut strips, slow oak smoke, balanced salt and cracked ." },
      { "id": "p2", "name": "Black Pepper Reserve", "price": 15.49, "rating": 4.8, "heat": 30, "img": 1, "cat": "classic", "desc": "Coarse tellicherry pepper crust with a velvet smoke ring." },
      { "id": "p3", "name": "Hickory Sweet Heat", "price": 15.99, "rating": 4.7, "heat": 55, "img": 2, "cat": "sweet", "desc": "Hickory chambers, touch of molasses, warm chili backnote." },
      { "id": "p4", "name": "Mesquite BBQ Brisket", "price": 16.49, "rating": 4.9, "heat": 40, "img": 3, "cat": "bbq", "desc": "Brisket-cut chew, mesquite forward, caramelized bark notes." },
      { "id": "p5", "name": "Garlic Ember Crisp", "price": 14.49, "rating": 4.6, "heat": 35, "img": 4, "cat": "classic", "desc": "Roasted garlic layers over applewood sweetness." },
      { "id": "p6", "name": "Chili Lime Trail", "price": 15.29, "rating": 4.8, "heat": 60, "img": 5, "cat": "spicy", "desc": "Bright citrus lift with slow-building chili warmth." },
      { "id": "p7", "name": "Coffee Rub Porter", "price": 16.99, "rating": 4.85, "heat": 20, "img": 6, "cat": "premium", "desc": "Cold-brew coffee rub, porter glaze, velvet texture." },
      { "id": "p8", "name": "Smoked Maple Chipotle", "price": 15.79, "rating": 4.75, "heat": 65, "img": 7, "cat": "sweet", "desc": "Grade-A maple, chipotle ember, glossy lacquer." },
      { "id": "p9", "name": "Habanero Forge", "price": 16.29, "rating": 4.7, "heat": 90, "img": 8, "cat": "spicy", "desc": "Small-batch forge heat — for seasoned spice hunters." },
      { "id": "p10", "name": "Teriyaki Umami Cut", "price": 15.59, "rating": 4.65, "heat": 28, "img": 9, "cat": "sweet", "desc": "Soy-caramel glaze, ginger spark, clean slice." },
      { "id": "p11", "name": "Peppered Venison Style", "price": 17.49, "rating": 4.9, "heat": 32, "img": 10, "cat": "premium", "desc": "Lean profile, juniper kiss, alpine smoke profile." },
      { "id": "p12", "name": "Carolina Mustard Smoke", "price": 15.89, "rating": 4.72, "heat": 38, "img": 11, "cat": "bbq", "desc": "Golden mustard tang, pecan wood balance." }
    ];

    fetch("data/products.json")
      .then(function (r) {
        if (!r.ok) throw new Error("fail");
        return r.json();
      })
      .then(function (data) {
        products = data;
        render(products);
      })
      .catch(function () {
        console.warn("Using fallback product data due to fetch error (likely file:// protocol).");
        products = fallbackProducts;
        render(products);
      });

    document.body.addEventListener("click", function (e) {
      var filterBtn = e.target.closest("[data-filter]");
      if (filterBtn) {
        document.querySelectorAll("[data-filter]").forEach(function (b) {
          b.classList.remove("active", "btn-brand-primary");
          b.classList.add("btn-brand-secondary");
        });
        filterBtn.classList.remove("btn-brand-secondary");
        filterBtn.classList.add("btn-brand-primary", "active");
        render(filter(filterBtn.getAttribute("data-filter")));
        return;
      }
      var qv = e.target.closest(".quick-view");
      if (qv) {
        var qid = qv.getAttribute("data-id");
        if (qid) openQuickView(qid);
        return;
      }
      var add = e.target.closest(".add-cart");
      if (add) {
        var card = add.closest("[data-id]");
        var pid = card ? card.getAttribute("data-id") : null;
        if (window.console && pid) console.log("add to cart", pid);
      }
    });
  });
})(window, document);
