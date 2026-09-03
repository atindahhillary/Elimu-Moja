/* ============================================================
   ELIMU MOJA / prototype workbench, shared runtime
   No framework, no build step. Loaded by every prototype page.
   Exposes one global: EM
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------- theme, shared with the main site ---------- */
  var root = document.documentElement;
  try {
    var stored = localStorage.getItem("em-theme");
    if (stored === "dark" || stored === "light") root.setAttribute("data-theme", stored);
  } catch (e) {}

  function wireTheme() {
    var btn = document.getElementById("themeBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var cur = root.getAttribute("data-theme");
      if (!cur) cur = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      var next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("em-theme", next); } catch (e) {}
      document.dispatchEvent(new CustomEvent("em:theme", { detail: next }));
    });
  }

  /* ---------- DOM ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "text") n.textContent = v;
      else if (k === "style" && typeof v === "object") {
        /* custom properties need setProperty; Object.assign drops them silently */
        Object.keys(v).forEach(function (p) {
          if (p.slice(0, 2) === "--") n.style.setProperty(p, v[p]);
          else n.style[p] = v[p];
        });
      }
      else if (k.slice(0, 2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
      else if (k === "dataset") Object.keys(v).forEach(function (d) { n.dataset[d] = v[d]; });
      else n.setAttribute(k, v === true ? "" : v);
    });
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return n;
  }

  var SVGNS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs, kids) {
    var n = document.createElementNS(SVGNS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      n.setAttribute(k, v);
    });
    (kids || []).forEach(function (c) {
      n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return n;
  }

  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); return node; }

  /* ---------- numbers and text ---------- */
  function fmt(n, dp) {
    if (n === null || n === undefined || isNaN(n)) return "–";
    var d = dp === undefined ? (Math.abs(n) >= 100 ? 0 : 1) : dp;
    return Number(n).toLocaleString("en", { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function pct(n, dp) { return fmt(n, dp === undefined ? 0 : dp) + "%"; }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* deterministic pseudo-random, so synthetic figures are stable across reloads */
  function rng(seed) {
    var s = 0;
    String(seed).split("").forEach(function (c) { s = (s * 31 + c.charCodeAt(0)) >>> 0; });
    return function () {
      s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  /* ---------- storage ---------- */
  function store(ns) {
    var key = "em-proto-" + ns;
    return {
      get: function (fallback) {
        try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
        catch (e) { return fallback; }
      },
      set: function (val) {
        try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
      },
      clear: function () { try { localStorage.removeItem(key); } catch (e) {} }
    };
  }

  /* ---------- announcements ---------- */
  var liveEl = null, liveT = 0;
  function say(msg) {
    if (!liveEl) {
      liveEl = el("p", { class: "vh", role: "status", "aria-live": "polite" });
      document.body.appendChild(liveEl);
    }
    clearTimeout(liveT);
    liveT = setTimeout(function () { liveEl.textContent = msg; }, 140);
  }

  /* ---------- CSV ---------- */
  function toCSV(rows) {
    return rows.map(function (r) {
      return r.map(function (c) {
        var s = c === null || c === undefined ? "" : String(c);
        return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(",");
    }).join("\r\n");
  }
  /* Downloads are blocked in some embedded viewers, so also offer the text. */
  function download(name, text, mime) {
    try {
      var blob = new Blob([text], { type: (mime || "text/csv") + ";charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = el("a", { href: url, download: name });
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 400);
      say("Downloaded " + name);
      return true;
    } catch (e) { return false; }
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { say("Copied to clipboard"); return true; },
        function () { return false; });
    }
    return Promise.resolve(false);
  }

  /* ---------- the eight partner states ---------- */
  var COUNTRIES = [
    { c: "ke", name: "Kenya",        joined: 2000, pop: 55.1 },
    { c: "tz", name: "Tanzania",     joined: 2000, pop: 67.4 },
    { c: "ug", name: "Uganda",       joined: 2000, pop: 48.6 },
    { c: "rw", name: "Rwanda",       joined: 2007, pop: 14.1 },
    { c: "bi", name: "Burundi",      joined: 2007, pop: 13.2 },
    { c: "ss", name: "South Sudan",  joined: 2016, pop: 11.6 },
    { c: "cd", name: "DR Congo",     joined: 2022, pop: 102.3 },
    { c: "so", name: "Somalia",      joined: 2024, pop: 18.1 }
  ];
  var BY_CODE = {};
  COUNTRIES.forEach(function (x) { BY_CODE[x.c] = x; });
  function cname(code) { return (BY_CODE[code] || {}).name || code; }
  function flag(code, cls) {
    return el("img", { src: "../assets/flags/" + code + ".svg", alt: "", class: cls || "", loading: "lazy",
      width: 15, height: 11 });
  }

  /* the five flag hues, cycled for series colour */
  var HUES = ["var(--fg-green)", "var(--fg-gold)", "var(--fg-red)", "var(--fg-blue)", "var(--fg-ivory)"];
  function hue(i) { return HUES[i % HUES.length]; }

  /* ---------- tiny charts ---------- */
  /* Horizontal bars from [{label, value, hue?, note?}] */
  function barChart(host, rows, opts) {
    opts = opts || {};
    clear(host);
    if (!rows.length) { host.appendChild(el("p", { class: "empty", text: opts.empty || "No data." })); return; }
    var max = opts.max !== undefined ? opts.max : Math.max.apply(null, rows.map(function (r) { return r.value; }));
    if (!isFinite(max) || max <= 0) max = 1;
    rows.forEach(function (r) {
      var w = clamp((r.value / max) * 100, 0, 100);
      host.appendChild(el("div", { class: "barlbl" }, [
        el("span", { text: r.label, title: r.label }),
        el("span", { class: "bar" }, [el("i", { style: { width: w + "%", background: r.hue || "var(--sa)" } })]),
        el("span", { class: "n", text: r.note !== undefined ? r.note : fmt(r.value, opts.dp) })
      ]));
    });
  }

  /* Multi-series line chart. series = [{name, hue, points:[[x,y],...]}] */
  function lineChart(host, series, opts) {
    opts = opts || {};
    clear(host);
    var W = 640, H = opts.height || 250, L = 46, R = 14, T = 12, B = 30;
    var all = [];
    series.forEach(function (s) { s.points.forEach(function (p) { all.push(p); }); });
    if (!all.length) { host.appendChild(el("p", { class: "empty", text: "No data." })); return; }
    var xs = all.map(function (p) { return p[0]; }), ys = all.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = opts.y0 !== undefined ? opts.y0 : Math.min.apply(null, ys);
    var y1 = opts.y1 !== undefined ? opts.y1 : Math.max.apply(null, ys);
    if (y1 === y0) y1 = y0 + 1;
    var pad = (y1 - y0) * 0.08; y0 -= pad; y1 += pad;
    if (opts.y0 !== undefined) y0 = opts.y0;
    var bx = function (v) { return x1 === x0 ? L : L + ((v - x0) / (x1 - x0)) * (W - L - R); };
    var by = function (v) { return H - B - ((v - y0) / (y1 - y0)) * (H - T - B); };

    var g = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "chart", role: "img",
      "aria-label": opts.alt || "Line chart" });
    /* gridlines + y ticks */
    for (var i = 0; i <= 4; i++) {
      var yv = y0 + ((y1 - y0) * i) / 4, yy = by(yv);
      g.appendChild(svg("line", { class: "gl", x1: L, y1: yy.toFixed(1), x2: W - R, y2: yy.toFixed(1) }));
      g.appendChild(svg("text", { class: "tx", x: L - 7, y: (yy + 3.2).toFixed(1), "text-anchor": "end" }, [fmt(yv, opts.dp)]));
    }
    /* x ticks */
    var seen = {};
    xs.slice().sort(function (a, b) { return a - b; }).forEach(function (v) {
      if (seen[v]) return; seen[v] = 1;
      g.appendChild(svg("text", { class: "tx", x: bx(v).toFixed(1), y: H - B + 15, "text-anchor": "middle" }, [String(v)]));
    });
    g.appendChild(svg("line", { class: "ax", x1: L, y1: H - B, x2: W - R, y2: H - B }));

    series.forEach(function (s) {
      var d = s.points.slice().sort(function (a, b) { return a[0] - b[0]; })
        .map(function (p, i) { return (i ? "L" : "M") + bx(p[0]).toFixed(1) + " " + by(p[1]).toFixed(1); }).join(" ");
      g.appendChild(svg("path", { class: "ln", d: d, stroke: s.hue }));
      s.points.forEach(function (p) {
        var c = svg("circle", { class: "pt", cx: bx(p[0]).toFixed(1), cy: by(p[1]).toFixed(1), r: 3, fill: s.hue });
        c.appendChild(svg("title", {}, [s.name + " " + p[0] + ": " + fmt(p[1], opts.dp)]));
        g.appendChild(c);
      });
    });
    host.appendChild(g);
    if (opts.legend !== false && series.length > 1) {
      host.appendChild(el("div", { class: "legend" }, series.map(function (s) {
        return el("span", {}, [el("i", { style: { background: s.hue } }), s.name]);
      })));
    }
  }

  /* ---------- sortable table helper ---------- */
  function sortable(table, onSort) {
    $$("th[aria-sort]", table).forEach(function (th) {
      th.tabIndex = 0;
      function go() {
        var cur = th.getAttribute("aria-sort");
        var dir = cur === "descending" ? "ascending" : "descending";
        $$("th[aria-sort]", table).forEach(function (o) { o.setAttribute("aria-sort", "none"); });
        th.setAttribute("aria-sort", dir);
        onSort(th.dataset.key, dir === "ascending" ? 1 : -1);
      }
      th.addEventListener("click", go);
      th.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });
  }

  /* ---------- page boot ---------- */
  function boot(fn) {
    wireTheme();
    /* mark the current page in the prototype nav */
    var here = location.pathname.split("/").pop() || "index.html";
    $$(".protonav a").forEach(function (a) {
      if ((a.getAttribute("href") || "").split("/").pop() === here) a.setAttribute("aria-current", "page");
    });
    try { fn && fn(); }
    catch (e) {
      /* a broken prototype should say so rather than render a blank page */
      var host = $("#app") || document.body;
      host.appendChild(el("div", { class: "card" }, [
        el("h3", { text: "This prototype failed to start" }),
        el("p", { class: "hint", text: String(e && e.message || e) })
      ]));
      if (global.console) console.error(e);
    }
  }

  global.EM = {
    $: $, $$: $$, el: el, svg: svg, clear: clear,
    fmt: fmt, pct: pct, clamp: clamp, slug: slug, esc: esc, rng: rng,
    store: store, say: say, toCSV: toCSV, download: download, copy: copy,
    COUNTRIES: COUNTRIES, BY_CODE: BY_CODE, cname: cname, flag: flag, hue: hue, HUES: HUES,
    barChart: barChart, lineChart: lineChart, sortable: sortable, boot: boot
  };
})(window);
