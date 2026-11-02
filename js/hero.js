/* Home page plot: a scatter with a line fitted by recursive least squares (RLS).
   Each click adds a point and updates the estimate with a single RLS step. */
(function () {
  const canvas = document.getElementById("fit-canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const eqEl = document.getElementById("fit-eq");
  const resetBtn = document.getElementById("fit-reset");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const X_MAX = 10, Y_MAX = 10;

  let C = {};
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const v = n => cs.getPropertyValue(n).trim();
    C = { blue: v("--blue"), orange: v("--orange"), grid: v("--plot-grid"), axis: v("--plot-axis"), resid: v("--plot-resid"), text: v("--muted"), halo: v("--plot-bg") };
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(rand) { const u = 1 - rand(), v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function seedPoints() {
    const rand = mulberry32(2026), pts = [];
    for (let i = 0; i < 24; i++) {
      const x = 0.6 + rand() * 8.8;
      pts.push({ x, y: Math.min(9.5, Math.max(0.5, 1.6 + 0.6 * x + gauss(rand) * 0.8)) });
    }
    return pts;
  }

  let points, theta, P, shown = [0, 0], lineProgress = 1;
  function rlsInit() { theta = [0, 0]; P = [[1e4, 0], [0, 1e4]]; }
  function rlsUpdate(x, y) {
    const phi = [1, x];
    const Pphi = [P[0][0] + P[0][1] * x, P[1][0] + P[1][1] * x];
    const denom = 1 + phi[0] * Pphi[0] + phi[1] * Pphi[1];
    const k = [Pphi[0] / denom, Pphi[1] / denom];
    const err = y - (theta[0] + theta[1] * x);
    theta = [theta[0] + k[0] * err, theta[1] + k[1] * err];
    P = [[P[0][0] - k[0] * Pphi[0], P[0][1] - k[0] * Pphi[1]], [P[1][0] - k[1] * Pphi[0], P[1][1] - k[1] * Pphi[1]]];
  }
  function reset() { points = seedPoints(); rlsInit(); points.forEach(p => rlsUpdate(p.x, p.y)); shown = theta.slice(); updateEq(); }
  function updateEq() {
    const b = theta[0], m = theta[1];
    eqEl.textContent = `ŷ = ${m.toFixed(2)}x ${b < 0 ? "−" : "+"} ${Math.abs(b).toFixed(2)}, n = ${points.length}`;
  }

  let W = 0, H = 0, pad = {};
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pad = W < 420 ? { l: 28, r: 12, t: 14, b: 26 } : { l: 36, r: 16, t: 16, b: 30 };
    draw();
  }
  const sx = x => pad.l + (x / X_MAX) * (W - pad.l - pad.r);
  const sy = y => H - pad.b - (y / Y_MAX) * (H - pad.t - pad.b);
  const ix = px => ((px - pad.l) / (W - pad.l - pad.r)) * X_MAX;
  const iy = py => ((H - pad.b - py) / (H - pad.t - pad.b)) * Y_MAX;

  function draw() {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    ctx.font = `${W < 420 ? 10 : 11}px "Schibsted Grotesk", system-ui, sans-serif`;
    ctx.fillStyle = C.text;
    for (let v = 0; v <= 10; v += 2) {
      ctx.strokeStyle = C.grid;
      ctx.beginPath(); ctx.moveTo(sx(v) + 0.5, sy(0)); ctx.lineTo(sx(v) + 0.5, sy(Y_MAX)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx(0), sy(v) + 0.5); ctx.lineTo(sx(X_MAX), sy(v) + 0.5); ctx.stroke();
      ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(String(v), sx(v), sy(0) + 7);
      ctx.textAlign = "right"; ctx.textBaseline = "middle"; if (v > 0) ctx.fillText(String(v), sx(0) - 7, sy(v));
    }
    ctx.strokeStyle = C.axis;
    ctx.beginPath(); ctx.moveTo(sx(0) + 0.5, sy(Y_MAX)); ctx.lineTo(sx(0) + 0.5, sy(0) + 0.5); ctx.lineTo(sx(X_MAX), sy(0) + 0.5); ctx.stroke();

    ctx.save();
    ctx.beginPath(); ctx.rect(sx(0), sy(Y_MAX), sx(X_MAX) - sx(0), sy(0) - sy(Y_MAX)); ctx.clip();
    const [b, m] = shown;
    if (lineProgress >= 1) {
      ctx.strokeStyle = C.resid; ctx.setLineDash([2, 3]);
      points.forEach(p => { ctx.beginPath(); ctx.moveTo(sx(p.x) + 0.5, sy(p.y)); ctx.lineTo(sx(p.x) + 0.5, sy(b + m * p.x)); ctx.stroke(); });
      ctx.setLineDash([]);
    }
    points.forEach(p => {
      ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), p.added ? 5.5 : 4.5, 0, Math.PI * 2);
      ctx.globalAlpha = p.added ? 1 : 0.75; ctx.fillStyle = C.blue; ctx.fill(); ctx.globalAlpha = 1;
      if (p.added) { ctx.strokeStyle = C.halo; ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1; }
    });
    const xEnd = X_MAX * lineProgress;
    ctx.strokeStyle = C.orange; ctx.lineWidth = 2.5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(sx(0), sy(b)); ctx.lineTo(sx(xEnd), sy(b + m * xEnd)); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.restore();
  }

  let anim = null;
  function animate(duration, step) {
    if (anim) cancelAnimationFrame(anim);
    if (reduceMotion) { step(1); draw(); return; }
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / duration), e = 1 - Math.pow(1 - t, 3);
      step(e); draw();
      anim = t < 1 ? requestAnimationFrame(tick) : null;
    };
    anim = requestAnimationFrame(tick);
  }
  function glideTo(to) {
    const from = shown.slice();
    animate(380, e => { shown = [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e]; });
  }

  canvas.addEventListener("click", ev => {
    const rect = canvas.getBoundingClientRect();
    const x = ix(ev.clientX - rect.left), y = iy(ev.clientY - rect.top);
    if (x < 0 || x > X_MAX || y < 0 || y > Y_MAX) return;
    points.push({ x, y, added: true });
    rlsUpdate(x, y); updateEq(); lineProgress = 1;
    glideTo(theta.slice());
  });
  resetBtn.addEventListener("click", () => { const from = shown.slice(); reset(); const to = shown.slice(); shown = from; glideTo(to); });
  document.addEventListener("themechange", () => { readColors(); draw(); });

  readColors(); reset();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas); else window.addEventListener("resize", resize);
  resize();
  const intro = () => { lineProgress = 0; animate(900, e => { lineProgress = e; }); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { resize(); intro(); }); else intro();
})();
