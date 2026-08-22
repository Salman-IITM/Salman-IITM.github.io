// ============================================================
// Footer year
// ============================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// Wave tanks — four small live sketches standing in for the
// usual "rolling video" hero element. Each panel is a distinct
// wave–structure problem; dragging any panel changes its
// incident wave height.
// ============================================================
(function () {
  const canvases = document.querySelectorAll(".tank-canvas");
  if (!canvases.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const COLOR = {
    incident: "#EAF2EE",
    transmitted: "#6F8B8E",
    structure: "#C9A15A",
    baseline: "rgba(234,242,238,0.12)",
    signal: "#FF6A4D",
  };

  const WAVELENGTH = 110;
  const PERIOD = 2.6;
  const K = (Math.PI * 2) / WAVELENGTH;
  const OMEGA = (Math.PI * 2) / PERIOD;

  function incidentY(x, t, amp, phase) {
    return Math.sin(x * K - t * OMEGA - (phase || 0)) * amp;
  }

  function baseline(ctx, w, midY) {
    ctx.strokeStyle = COLOR.baseline;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();
  }

  // ---------- panel renderers ----------
  // Each receives (ctx, w, h, t, amp) and owns its own drawing.

  function drawBaffle(ctx, w, h, t, amp) {
    const midY = h * 0.54;
    const structX = w * 0.52;
    const attenuation = 0.4;

    baseline(ctx, w, midY);

    ctx.beginPath();
    ctx.strokeStyle = COLOR.incident;
    ctx.lineWidth = 2;
    for (let x = 0; x <= structX; x++) {
      const y = midY + incidentY(x, t, amp, 0);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = COLOR.transmitted;
    ctx.lineWidth = 2;
    for (let x = structX; x <= w; x++) {
      const localAmp =
        amp * attenuation +
        (amp - amp * attenuation) * Math.exp(-(x - structX) / 70);
      const y = midY + incidentY(x, t, localAmp, 0.6);
      x === structX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    const pw = 14;
    const top = midY - h * 0.32;
    const bottom = midY + h * 0.32;
    ctx.fillStyle = "rgba(201,161,90,0.10)";
    ctx.fillRect(structX - pw / 2, top, pw, bottom - top);
    ctx.strokeStyle = COLOR.structure;
    ctx.lineWidth = 1.4;
    ctx.strokeRect(structX - pw / 2, top, pw, bottom - top);
    ctx.fillStyle = COLOR.structure;
    const holes = 6;
    for (let i = 0; i < holes; i++) {
      const y = top + ((bottom - top) / (holes - 1)) * i;
      ctx.beginPath();
      ctx.arc(structX, y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawOWC(ctx, w, h, t, amp) {
    const midY = h * 0.5;
    const chamberX = w * 0.62;
    const chamberW = w * 0.3;
    const wallTop = midY - h * 0.4;
    const wallBottom = midY + h * 0.42;

    baseline(ctx, w, midY);

    ctx.beginPath();
    ctx.strokeStyle = COLOR.incident;
    ctx.lineWidth = 2;
    for (let x = 0; x <= chamberX - chamberW / 2 + 4; x++) {
      const y = midY + incidentY(x, t, amp, 0);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    const innerAmp = amp * 1.35;
    const innerPhase = 0.9;
    const innerY = midY + incidentY(chamberX, t, innerAmp, innerPhase);
    const prevInnerY = midY + incidentY(chamberX, t - 1 / 60, innerAmp, innerPhase);
    const velocity = innerY - prevInnerY;

    ctx.strokeStyle = COLOR.structure;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(chamberX - chamberW / 2, wallBottom);
    ctx.lineTo(chamberX - chamberW / 2, wallTop);
    ctx.lineTo(chamberX - 5, wallTop);
    ctx.moveTo(chamberX + 5, wallTop);
    ctx.lineTo(chamberX + chamberW / 2, wallTop);
    ctx.lineTo(chamberX + chamberW / 2, wallBottom);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = COLOR.transmitted;
    ctx.lineWidth = 2;
    ctx.moveTo(chamberX - chamberW / 2 + 3, innerY);
    ctx.lineTo(chamberX + chamberW / 2 - 3, innerY);
    ctx.stroke();
    ctx.fillStyle = "rgba(111,139,142,0.18)";
    ctx.fillRect(
      chamberX - chamberW / 2 + 3,
      innerY,
      chamberW - 6,
      wallBottom - innerY
    );

    const arrowMag = Math.min(16, Math.abs(velocity) * 9);
    if (arrowMag > 1.5) {
      const dir = velocity > 0 ? -1 : 1;
      ctx.strokeStyle = COLOR.signal;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      const ax = chamberX;
      const ay1 = wallTop - 6;
      const ay2 = wallTop - 6 - dir * arrowMag;
      ctx.moveTo(ax, ay1);
      ctx.lineTo(ax, ay2);
      ctx.moveTo(ax - 3, ay2 + dir * 3);
      ctx.lineTo(ax, ay2);
      ctx.lineTo(ax + 3, ay2 + dir * 3);
      ctx.stroke();
    }

    const turbineY = wallTop - 20;
    ctx.strokeStyle = COLOR.structure;
    ctx.beginPath();
    ctx.arc(chamberX, turbineY, 7, 0, Math.PI * 2);
    ctx.stroke();
    const spin = t * (2 + Math.abs(velocity) * 6);
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 3; i++) {
      const a = spin + (i * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.moveTo(chamberX, turbineY);
      ctx.lineTo(chamberX + Math.cos(a) * 6, turbineY + Math.sin(a) * 6);
      ctx.stroke();
    }
  }

  function drawMembrane(ctx, w, h, t, amp) {
    const midY = h * 0.54;
    const memX = w * 0.52;
    const attenuation = 0.55;

    baseline(ctx, w, midY);

    ctx.beginPath();
    ctx.strokeStyle = COLOR.incident;
    ctx.lineWidth = 2;
    for (let x = 0; x <= memX; x++) {
      const y = midY + incidentY(x, t, amp, 0);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = COLOR.transmitted;
    ctx.lineWidth = 2;
    for (let x = memX; x <= w; x++) {
      const localAmp =
        amp * attenuation +
        (amp - amp * attenuation) * Math.exp(-(x - memX) / 60);
      const y = midY + incidentY(x, t, localAmp, 0.4);
      x === memX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    const top = midY - h * 0.42;
    const bottom = midY + h * 0.42;
    const flex = Math.max(4, amp * 0.5);
    ctx.beginPath();
    ctx.strokeStyle = COLOR.structure;
    ctx.lineWidth = 2;
    for (let y = top; y <= bottom; y += 2) {
      const x = memX + Math.sin(y * 0.06 - t * OMEGA * 1.1) * flex;
      y === top ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    const dotCount = 5;
    for (let i = 0; i < dotCount; i++) {
      const speed = 26;
      const spanStart = memX - 34;
      const spanEnd = memX + 34;
      const span = spanEnd - spanStart;
      const offset = (t * speed + i * (span / dotCount)) % span;
      const x = spanStart + offset;
      const y = top + 14 + i * ((bottom - top - 28) / (dotCount - 1));
      const throughMembrane = (x - memX) / 20;
      const opacity = Math.max(0.12, 1 - Math.abs(throughMembrane) * 0.35);
      ctx.beginPath();
      ctx.fillStyle = `rgba(234,242,238,${x < memX ? opacity : opacity * 0.6})`;
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawMoored(ctx, w, h, t, amp) {
    const midY = h * 0.5;
    const floatX = w * 0.5;
    const floatW = w * 0.22;
    const floatH = h * 0.14;
    const seabedY = h - 10;

    ctx.beginPath();
    ctx.strokeStyle = COLOR.incident;
    ctx.lineWidth = 2;
    for (let x = 0; x <= w; x++) {
      const y = midY + incidentY(x, t, amp, 0);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(234,242,238,0.10)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, seabedY);
    ctx.lineTo(w, seabedY);
    ctx.stroke();

    const heaveY = midY + incidentY(floatX, t, amp, 0);
    const dx = 8;
    const slopeL = incidentY(floatX - dx, t, amp, 0);
    const slopeR = incidentY(floatX + dx, t, amp, 0);
    const roll = Math.atan2(slopeR - slopeL, dx * 2) * 0.6;

    const cosR = Math.cos(roll);
    const sinR = Math.sin(roll);

    // mooring lines from float corners (in world space) to fixed seabed anchors
    const corners = [
      [-floatW / 2, floatH / 2],
      [floatW / 2, floatH / 2],
    ];
    const anchors = [
      [floatX - floatW * 1.1, seabedY],
      [floatX + floatW * 1.1, seabedY],
    ];
    ctx.strokeStyle = "rgba(201,161,90,0.55)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 4]);
    corners.forEach((c, i) => {
      const worldX = floatX + c[0] * cosR - c[1] * sinR;
      const worldY = heaveY + c[0] * sinR + c[1] * cosR;
      ctx.beginPath();
      ctx.moveTo(worldX, worldY);
      ctx.lineTo(anchors[i][0], anchors[i][1]);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    ctx.save();
    ctx.translate(floatX, heaveY);
    ctx.rotate(roll);
    ctx.fillStyle = "rgba(201,161,90,0.14)";
    ctx.strokeStyle = COLOR.structure;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.rect(-floatW / 2, -floatH / 2, floatW, floatH);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  const RENDERERS = {
    baffle: drawBaffle,
    owc: drawOWC,
    membrane: drawMembrane,
    moored: drawMoored,
  };

  // ---------- tank instances ----------
  const tanks = Array.from(canvases).map((canvas) => {
    const ctx = canvas.getContext("2d");
    const type = canvas.dataset.type;
    const render = RENDERERS[type] || drawBaffle;

    const state = {
      canvas,
      ctx,
      render,
      width: 0,
      height: 0,
      amplitude: 16,
      targetAmplitude: 16,
      dragging: false,
      startY: 0,
      startAmp: 16,
    };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = canvas.clientWidth;
      state.height = canvas.clientHeight;
      canvas.width = state.width * dpr;
      canvas.height = state.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function pointerY(e) {
      return e.touches ? e.touches[0].clientY : e.clientY;
    }

    canvas.addEventListener("pointerdown", (e) => {
      state.dragging = true;
      state.startY = pointerY(e);
      state.startAmp = state.targetAmplitude;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!state.dragging) return;
      const dy = state.startY - pointerY(e);
      state.targetAmplitude = Math.min(34, Math.max(5, state.startAmp + dy * 0.35));
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((evt) =>
      canvas.addEventListener(evt, () => (state.dragging = false))
    );

    window.addEventListener("resize", resize);
    resize();

    return state;
  });

  let time = 0;

  function frame() {
    time += 1 / 60;
    tanks.forEach((tk) => {
      tk.ctx.clearRect(0, 0, tk.width, tk.height);
      tk.amplitude += (tk.targetAmplitude - tk.amplitude) * 0.08;
      tk.render(tk.ctx, tk.width, tk.height, time, tk.amplitude);
    });
    if (!prefersReduced) requestAnimationFrame(frame);
  }

  frame(); // always draw at least one frame, even in reduced-motion mode
})();
