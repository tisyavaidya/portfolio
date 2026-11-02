/* ==========================================================================
   Site shell and page behaviour. Content comes from js/data.js.
   ========================================================================== */
(function () {
  "use strict";
  const S = window.SITE;
  const page = document.body.dataset.page || "home";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ------------------------------------------------------------ Theme */
  function storedTheme() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }
  function currentTheme() { return document.documentElement.dataset.theme === "dark" ? "dark" : "light"; }
  function setTheme(t, remember) {
    document.documentElement.dataset.theme = t;
    if (remember) { try { localStorage.setItem("theme", t); } catch (e) { /* storage unavailable */ } }
    document.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  }
  // Follow the system setting until the visitor makes a choice
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  if (mq.addEventListener) mq.addEventListener("change", e => { if (!storedTheme()) setTheme(e.matches ? "dark" : "light", false); });

  /* --------------------------------------------------------- Backdrop */
  const bd = document.createElement("div");
  bd.className = "backdrop";
  bd.innerHTML = window.BACKDROP_SVG || "";
  document.body.prepend(bd);

  /* ----------------------------------------------------------- Header */
  const navItems = [
    ["home", "index.html", "Home"],
    ["about", "about.html", "About"],
    ["experience", "experience.html", "Experience"],
    ["projects", "projects.html", "Projects"],
    ["contact", "contact.html", "Contact"]
  ];
  const navLinks = navItems.map(([id, href, label]) =>
    `<a href="${href}"${id === page ? ' aria-current="page"' : ""}>${label}</a>`).join("");

  // Sigmoid theme switch: the dot slides along σ(x) from 0 (light) to 1 (dark)
  const SIG_W = 46, SIG_H = 26;
  const sigX = t => 6 + t * (SIG_W - 12);
  const sigY = t => { const z = (t - 0.5) * 10; return SIG_H - 5 - (SIG_H - 10) / (1 + Math.exp(-z)); };
  let sigPath = "";
  for (let i = 0; i <= 30; i++) { const t = i / 30; sigPath += (i ? "L" : "M") + sigX(t).toFixed(1) + "," + sigY(t).toFixed(1); }

  const header = $("#site-header");
  header.className = "masthead";
  header.innerHTML = `
    <a class="who" href="index.html">
      <img src="assets/avatar.jpg" alt="" width="44" height="44">
      <span class="who-text">
        <span class="who-name">${esc(S.name)}</span>
        <span class="badge"><span class="pulse" aria-hidden="true"></span>${esc(S.status)}</span>
      </span>
    </a>
    <nav class="nav" id="site-nav" aria-label="Pages">${navLinks}
      <a class="nav-extra" href="${S.resume}" target="_blank" rel="noopener">Résumé</a>
      <button type="button" class="nav-extra" data-open-ask>Ask Tisya</button>
    </nav>
    <div class="tools">
      <button type="button" class="btn-ghost" data-open-ask>Ask Tisya</button>
      <button type="button" class="sigmoid" id="theme-toggle" aria-pressed="false" aria-label="Dark theme">
        <svg viewBox="0 0 ${SIG_W} ${SIG_H}" width="${SIG_W}" height="${SIG_H}" aria-hidden="true">
          <line x1="3" y1="${SIG_H - 5}" x2="${SIG_W - 3}" y2="${SIG_H - 5}" class="sig-axis"/>
          <path d="${sigPath}" class="sig-curve"/>
          <circle r="4.5" class="sig-dot"/>
        </svg>
      </button>
      <a class="btn-solid" href="${S.resume}" target="_blank" rel="noopener">Résumé</a>
      <button type="button" class="menu-btn" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>`;

  const toggle = $("#theme-toggle");
  const dot = $(".sig-dot", toggle);
  let dotT = currentTheme() === "dark" ? 1 : 0;
  function placeDot(t) { dot.setAttribute("cx", sigX(t)); dot.setAttribute("cy", sigY(t)); }
  function syncToggle() {
    const dark = currentTheme() === "dark";
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.title = dark ? "σ(theme) = 1: dark. Click for light." : "σ(theme) = 0: light. Click for dark.";
  }
  placeDot(dotT); syncToggle();
  let fromClick = false;
  toggle.addEventListener("click", () => {
    const to = currentTheme() === "dark" ? 0 : 1;
    fromClick = true;
    setTheme(to ? "dark" : "light", true);
    fromClick = false;
    syncToggle();
    if (reduceMotion) { dotT = to; placeDot(dotT); return; }
    const from = dotT, start = performance.now();
    const step = now => {
      const k = Math.min(1, (now - start) / 420), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      dotT = from + (to - from) * e; placeDot(dotT);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  // Theme changed by the system setting rather than the switch
  document.addEventListener("themechange", () => {
    if (fromClick) return;
    syncToggle(); dotT = currentTheme() === "dark" ? 1 : 0; placeDot(dotT);
  });

  const menuBtn = $(".menu-btn", header);
  menuBtn.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  /* ----------------------------------------------------------- Footer */
  const footer = $("#site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <p>© ${new Date().getFullYear()} ${esc(S.name)}, ${esc(S.location)}</p>
      <p class="footnote">The background is a loss surface. The orange path is gradient descent, walking down to its minimum.</p>`;
  }

  /* ---------------------------------------------------------- Ask Tisya */
  const ask = document.createElement("dialog");
  ask.className = "ask";
  ask.setAttribute("aria-labelledby", "ask-title");
  ask.innerHTML = `
    <div class="ask-head">
      <img src="assets/avatar.jpg" alt="" width="40" height="40">
      <div>
        <h2 id="ask-title">Ask Tisya</h2>
        <p>Answers I've written myself, matched to your question.</p>
      </div>
      <button type="button" class="close" aria-label="Close">×</button>
    </div>
    <div class="ask-log" aria-live="polite"></div>
    <div class="ask-chips"></div>
    <form class="ask-form">
      <label class="sr-only" for="ask-input">Your question</label>
      <input id="ask-input" type="text" autocomplete="off" placeholder="Ask about my studies, work or projects">
      <button type="submit" class="btn-solid">Ask</button>
    </form>`;
  document.body.appendChild(ask);
  const log = $(".ask-log", ask), chips = $(".ask-chips", ask), input = $("#ask-input", ask);

  function addMsg(text, who) {
    const m = document.createElement("p");
    m.className = "msg " + who;
    m.textContent = text;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  }
  function answer(q) {
    const text = q.toLowerCase();
    const words = text.match(/[a-zé]+/g) || [];
    let best = null, bestScore = 0;
    S.ask.answers.forEach(item => {
      let score = 0;
      item.keys.forEach(k => {
        if (k.includes(" ")) { if (text.includes(k)) score += 2; }
        else if (words.some(w => w === k || (k.length > 3 && w.startsWith(k)))) score += 1;
      });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return best ? best.a : S.ask.fallback;
  }
  function askQ(q) {
    q = q.trim(); if (!q) return;
    addMsg(q, "you");
    const a = answer(q);
    if (reduceMotion) addMsg(a, "me");
    else {
      const typing = document.createElement("p");
      typing.className = "msg me typing"; typing.textContent = "…";
      log.appendChild(typing); log.scrollTop = log.scrollHeight;
      setTimeout(() => { typing.remove(); addMsg(a, "me"); }, 450);
    }
  }
  chips.innerHTML = S.ask.suggestions.map(s => `<button type="button" class="chip">${esc(s)}</button>`).join("");
  chips.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) askQ(b.textContent); });
  $(".ask-form", ask).addEventListener("submit", e => { e.preventDefault(); askQ(input.value); input.value = ""; input.focus(); });
  $(".close", ask).addEventListener("click", () => ask.close());
  ask.addEventListener("click", e => { if (e.target === ask) ask.close(); });
  function openAsk() {
    if (!log.childElementCount) addMsg("Hi! I'm Tisya. Ask me anything about my studies, experience or projects.", "me");
    if (typeof ask.showModal === "function") ask.showModal(); else ask.setAttribute("open", "");
    input.focus();
  }
  document.addEventListener("click", e => { if (e.target.closest("[data-open-ask]")) { e.preventDefault(); openAsk(); } });

  /* ------------------------------------------------------- Mini charts */
  // Small SVG pictures drawn from code, so every card has an image without screenshots.
  function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const W = 240, H = 130;
  const axes = `<line class="ax" x1="20" y1="112" x2="226" y2="112"/><line class="ax" x1="20" y1="14" x2="20" y2="112"/>`;
  const CHARTS = {
    bars() {
      const v = [0.62, 0.7, 0.66, 0.58, 0.77];
      return axes + v.map((h, i) => `<rect class="${i === 4 ? "fb" : "fa"}" x="${34 + i * 38}" y="${112 - h * 92}" width="26" height="${h * 92}" rx="2"/>`).join("");
    },
    bars2() {
      const v = [[0.5, 0.7], [0.8, 0.55], [0.35, 0.45], [0.65, 0.9]];
      return axes + v.map((p, i) => `<rect class="fa" x="${32 + i * 48}" y="${112 - p[0] * 90}" width="16" height="${p[0] * 90}" rx="2"/><rect class="fb" x="${50 + i * 48}" y="${112 - p[1] * 90}" width="16" height="${p[1] * 90}" rx="2"/>`).join("");
    },
    line() {
      const r = rng(7); let y = 80, d = "", pts = [];
      for (let i = 0; i <= 40; i++) { y += (r() - 0.44) * 12; y = Math.max(22, Math.min(104, y)); pts.push([22 + i * 5.1, y]); }
      d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");
      return axes + `<path class="area" d="${d}L226,112L22,112Z"/><path class="la" d="${d}"/>`;
    },
    scatter() {
      const r = rng(11); let s = axes;
      for (let i = 0; i < 34; i++) { const x = 28 + r() * 190, y = 104 - (x - 28) * 0.38 - (r() - 0.5) * 34; s += `<circle class="fa" cx="${x.toFixed(1)}" cy="${Math.max(18, y).toFixed(1)}" r="3.2"/>`; }
      return s + `<line class="lb" x1="24" y1="106" x2="224" y2="30"/>`;
    },
    heatmap() {
      const m = [[0.92, 0.1, 0.05], [0.12, 0.85, 0.08], [0.04, 0.09, 0.9]];
      let s = "";
      m.forEach((row, i) => row.forEach((v, j) => {
        s += `<rect class="${i === j ? "fa" : "fm"}" x="${62 + j * 40}" y="${8 + i * 39}" width="37" height="36" rx="3" fill-opacity="${(0.15 + v * 0.85).toFixed(2)}"/>`;
        s += `<text x="${80.5 + j * 40}" y="${30 + i * 39}" class="${i === j && v > 0.5 ? "tl" : "td"}">${v.toFixed(2)}</text>`;
      }));
      return s;
    },
    pie() {
      const cx = 120, cy = 65, R = 50, n = 8; let s = `<circle class="fm" cx="${cx}" cy="${cy}" r="${R}" fill-opacity=".25"/>`;
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; s += `<line class="ax" x1="${cx}" y1="${cy}" x2="${(cx + R * Math.cos(a)).toFixed(1)}" y2="${(cy + R * Math.sin(a)).toFixed(1)}"/>`; }
      const a0 = -Math.PI / 2 - Math.PI / 4, a1 = -Math.PI / 2, off = 9, mx = Math.cos((a0 + a1) / 2) * off, my = Math.sin((a0 + a1) / 2) * off;
      s += `<path class="fb" d="M${cx + mx},${cy + my}L${(cx + mx + R * Math.cos(a0)).toFixed(1)},${(cy + my + R * Math.sin(a0)).toFixed(1)}A${R},${R} 0 0 1 ${(cx + mx + R * Math.cos(a1)).toFixed(1)},${(cy + my + R * Math.sin(a1)).toFixed(1)}Z"/>`;
      return s;
    },
    hist() {
      const v = [0.08, 0.18, 0.34, 0.6, 0.85, 1, 0.82, 0.55, 0.32, 0.17, 0.08];
      let s = axes + v.map((h, i) => `<rect class="fa" x="${26 + i * 18}" y="${112 - h * 90}" width="16" height="${h * 90}"/>`).join("");
      let d = ""; for (let i = 0; i <= 50; i++) { const x = 26 + i * 3.96, z = (i - 25) / 9; d += (i ? "L" : "M") + x.toFixed(1) + "," + (112 - 92 * Math.exp(-z * z / 2)).toFixed(1); }
      return s + `<path class="lb" d="${d}"/>`;
    },
    grid() {
      const r = rng(3); let s = "";
      for (let c = 0; c < 5; c++) for (let rr = 0; rr < 4; rr++) {
        const on = r() > 0.55;
        s += `<rect class="${on ? (r() > 0.6 ? "fb" : "fa") : "fm"}" ${on ? "" : 'fill-opacity=".22"'} x="${30 + c * 38}" y="${12 + rr * 27}" width="34" height="23" rx="3"/>`;
      }
      return s;
    },
    blocks() {
      let s = "";
      [["L1", 4, 30], ["L2", 7, 22], ["L3", 10, 17]].forEach(([lab, n, w], i) => {
        const y = 14 + i * 36;
        s += `<text class="td" x="24" y="${y + 18}" text-anchor="start">${lab}</text>`;
        for (let k = 0; k < n; k++) s += `<rect class="${(i === 0 && k === 1) ? "fb" : "fa"}" fill-opacity="${i === 0 ? 1 : i === 1 ? 0.7 : 0.45}" x="${50 + k * (w + 2)}" y="${y}" width="${w}" height="26" rx="2"/>`;
      });
      return s;
    },
    map() {
      const p = [[40, 90], [95, 40], [150, 75], [205, 30], [190, 100]];
      let s = `<path class="lm" d="M40,90 Q60,40 95,40 T150,75 T205,30"/><path class="lm" d="M150,75 Q175,105 190,100"/>`;
      p.forEach((q, i) => { s += `<circle class="${i === 3 ? "fb" : "fa"}" cx="${q[0]}" cy="${q[1]}" r="${i === 3 ? 7 : 5.5}"/>`; });
      return s;
    },
    dashboard() {
      let s = `<rect class="fm" fill-opacity=".14" x="14" y="10" width="100" height="110" rx="5"/><rect class="fm" fill-opacity=".14" x="124" y="10" width="102" height="52" rx="5"/><rect class="fm" fill-opacity=".14" x="124" y="68" width="102" height="52" rx="5"/>`;
      const cx = 64, cy = 65, R = 30, C = 2 * Math.PI * R;
      s += `<circle cx="${cx}" cy="${cy}" r="${R}" class="ring-m"/><circle cx="${cx}" cy="${cy}" r="${R}" class="ring" stroke-dasharray="${(C * 0.62).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
      [0.5, 0.8, 0.35, 0.65, 0.9].forEach((h, i) => { s += `<rect class="${i === 4 ? "fb" : "fa"}" x="${136 + i * 17}" y="${56 - h * 38}" width="11" height="${h * 38}" rx="1.5"/>`; });
      s += `<path class="la" d="M134,108L150,100L166,104L182,88L198,92L216,78"/>`;
      return s;
    },
    density() {
      let d = ""; for (let i = 0; i <= 60; i++) { const x = 20 + i * 3.4, z = (i - 34) / 10; d += (i ? "L" : "M") + x.toFixed(1) + "," + (112 - 90 * Math.exp(-z * z / 2)).toFixed(1); }
      return axes + `<path class="area" d="${d}L224,112L20,112Z"/><path class="la" d="${d}"/><line class="lb" x1="135.6" y1="112" x2="135.6" y2="22" stroke-dasharray="3 3"/><circle class="fb" cx="135.6" cy="22" r="5"/>`;
    },
    gantt() {
      const rows = [[0.05, 0.9, "fc"], [0.25, 0.55, "fc"], [0.12, 0.08, "fa"], [0.45, 0.06, "fa"], [0.46, 0.05, "fg"], [0.68, 0.12, "fg"], [0.88, 0.08, "fa"]];
      return `<line class="ax" x1="20" y1="118" x2="226" y2="118"/>` + rows.map((r, i) => `<rect class="${r[2]}" x="${20 + r[0] * 206}" y="${10 + i * 15}" width="${Math.max(8, r[1] * 206)}" height="10" rx="5"/>`).join("");
    },
    multiples() {
      const cell = (x, y, kind) => `<g transform="translate(${x} ${y}) scale(.46)">${CHARTS[kind]()}</g>`;
      return cell(4, 2, "bars") + cell(122, 2, "line") + cell(4, 64, "scatter") + cell(122, 64, "hist");
    },
    you() {
      const r = rng(19); let s = "";
      for (let i = 0; i < 40; i++) s += `<circle class="fm" fill-opacity=".45" cx="${(20 + r() * 200).toFixed(1)}" cy="${(14 + r() * 100).toFixed(1)}" r="3"/>`;
      return s + `<circle class="fb" cx="168" cy="48" r="7"/><circle class="ring-b" cx="168" cy="48" r="14"/>`;
    }
  };
  function chart(kind, label) {
    const body = (CHARTS[kind] || CHARTS.bars)();
    return `<svg class="mini" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}>${body}</svg>`;
  }
  $$("[data-chart]").forEach(el => { el.innerHTML = chart(el.dataset.chart); });

  /* -------------------------------------------------------- Page: about */
  const eduEl = $("#education");
  if (eduEl) eduEl.innerHTML = S.education.map(e => `
    <li><p class="when">${esc(e.dates)}</p><div><h3>${esc(e.school)}</h3><p>${esc(e.degree)}</p><p class="muted">${esc(e.place)}</p></div></li>`).join("");
  const skillEl = $("#skills");
  if (skillEl) skillEl.innerHTML = S.skills.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  /* --------------------------------------------------- Page: experience */
  const gantt = $("#gantt");
  if (gantt) {
    const toM = s => { const [y, m] = s.split("-").map(Number); return y * 12 + (m - 1); };
    const items = S.experience.slice().sort((a, b) => toM(a.start) - toM(b.start));
    const lo = Math.min(...items.map(i => toM(i.start))) - 1, hi = Math.max(...items.map(i => toM(i.end))) + 2;
    const pct = m => ((m - lo) / (hi - lo)) * 100;
    const years = [];
    for (let y = Math.ceil(lo / 12); y * 12 <= hi; y++) years.push(y);
    const kindLabel = { work: "Work", research: "Research", teaching: "Teaching" };
    gantt.innerHTML = `
      <div class="g-axis" aria-hidden="true">${years.map(y => `<span style="left:${pct(y * 12).toFixed(2)}%">${y}</span>`).join("")}</div>
      <ol class="g-rows">${items.map(i => `
        <li class="g-row">
          <a class="g-label" href="#${i.id}">${esc(i.short || i.role)}<span>${esc(i.org.split(",")[0])}</span></a>
          <div class="g-track">
            ${years.map(y => `<i class="g-tick" style="left:${pct(y * 12).toFixed(2)}%"></i>`).join("")}
            <a class="g-bar k-${i.kind}" href="#${i.id}" style="left:${pct(toM(i.start)).toFixed(2)}%;width:${Math.max(1.6, pct(toM(i.end) + 1) - pct(toM(i.start))).toFixed(2)}%"
               aria-label="${esc(i.role)}, ${esc(i.dates)}" title="${esc(i.role)}: ${esc(i.dates)}"></a>
          </div>
        </li>`).join("")}</ol>
      <p class="g-legend">${Object.keys(kindLabel).map(k => `<span><i class="k-${k}"></i>${kindLabel[k]}</span>`).join("")}</p>`;

    const list = $("#exp-list");
    const sections = [["Work and research", ["work", "research"]], ["Teaching", ["teaching"]]];
    list.innerHTML = sections.map(([title, kinds]) => `
      <h2 class="sub">${title}</h2>
      <ol class="timeline">${S.experience.filter(e => kinds.includes(e.kind)).sort((a, b) => toM(b.start) - toM(a.start)).map(e => `
        <li id="${e.id}">
          <p class="when">${esc(e.dates)}</p>
          <div>
            <h3>${esc(e.role)}</h3>
            <p class="muted">${esc(e.org)}, ${esc(e.place)}</p>
            <ul>${e.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
          </div>
        </li>`).join("")}</ol>`).join("");
  }

  /* ----------------------------------------------------- Page: projects */
  const grid = $("#project-grid");
  if (grid) {
    const cats = { ml: "Machine learning", analytics: "Analytics", software: "Software" };
    const filters = $("#project-filters");
    filters.innerHTML = [["all", "All"]].concat(Object.entries(cats)).map(([k, v], i) =>
      `<button type="button" class="chip" data-filter="${k}" aria-pressed="${i === 0}">${v}</button>`).join("");
    grid.innerHTML = S.projects.map(p => `
      <li class="pcard${p.featured ? " featured" : ""}" data-cat="${p.category}">
        <button type="button" data-project="${p.id}">
          <span class="thumb">${chart(p.chart)}</span>
          <span class="pmeta">
            <span class="ptitle">${esc(p.title)}</span>
            <span class="psum">${esc(p.summary)}</span>
            <span class="pstack">${p.stack.map(esc).join(", ")}</span>
          </span>
        </button>
      </li>`).join("");
    filters.addEventListener("click", e => {
      const b = e.target.closest("[data-filter]"); if (!b) return;
      $$("[data-filter]", filters).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const f = b.dataset.filter;
      $$(".pcard", grid).forEach(c => { c.hidden = f !== "all" && c.dataset.cat !== f; });
    });

    const dlg = document.createElement("dialog");
    dlg.className = "project-dialog";
    dlg.setAttribute("aria-labelledby", "pd-title");
    document.body.appendChild(dlg);
    function openProject(id, fromHash) {
      const p = S.projects.find(x => x.id === id); if (!p) return;
      dlg.innerHTML = `
        <button type="button" class="close" aria-label="Close">×</button>
        <div class="pd-thumb">${chart(p.chart, p.title)}</div>
        <div class="pd-body">
          <p class="muted">${cats[p.category]}</p>
          <h2 id="pd-title">${esc(p.title)}</h2>
          <ul class="tags">${p.stack.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
          ${p.metrics ? `<dl class="metrics">${p.metrics.map(([v, l]) => `<div><dd>${esc(v)}</dd><dt>${esc(l)}</dt></div>`).join("")}</dl>` : ""}
          ${p.body.map(t => `<p>${esc(t)}</p>`).join("")}
          ${p.results ? `<h3>Results</h3><ul class="results">${p.results.map(r => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
          ${p.link ? `<p class="pd-link"><a class="btn-solid" href="${p.link}" target="_blank" rel="noopener">View code on GitHub</a></p>` : ""}
        </div>`;
      $(".close", dlg).addEventListener("click", () => dlg.close());
      if (typeof dlg.showModal === "function") { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute("open", "");
      if (!fromHash) history.replaceState(null, "", "#" + id);
    }
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", () => { if (location.hash) history.replaceState(null, "", location.pathname + location.search); });
    grid.addEventListener("click", e => { const b = e.target.closest("[data-project]"); if (b) openProject(b.dataset.project); });
    const fromHash = () => { const id = location.hash.slice(1); if (id) openProject(id, true); };
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }

  /* ------------------------------------------------------ Page: contact */
  const copyBtn = $("#copy-email");
  if (copyBtn) copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(S.email); copyBtn.textContent = "Copied"; }
    catch (e) { copyBtn.textContent = "Select the address to copy"; }
    setTimeout(() => { copyBtn.textContent = "Copy email"; }, 2200);
  });
})();
