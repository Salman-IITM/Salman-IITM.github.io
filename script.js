// ============================================================
// Footer year
// ============================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// Wave tank — a small live sketch of wave scattering by a
// porous floating structure, standing in for the usual
// "rolling video" hero element.
// ============================================================
(function () {
  const canvas = document.getElementById("waveCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let width, height, dpr;
  let structureX; // horizontal position of the porous cage
  let time = 0;
  let amplitude = 22; // px, incident wave height (draggable)
  let targetAmplitude = 22;
  const period = 2.6; // seconds per incident wavelength (visual, not physical units)
  const wavelength = 130; // px

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    structureX = width * 0.55;
  }

  const colors = {
    incident: "#EAF2EE",
    transmitted: "#6F8B8E",
    structure: "#C9A15A",
    baseline: "rgba(234,242,238,0.12)",
  };

  function drawStructure(midY) {
    // A schematic porous cage: a vertical perforated panel
    const w = 20;
    const top = midY - 74;
    const bottom = midY + 74;
    ctx.fillStyle = "rgba(201,161,90,0.10)";
    ctx.fillRect(structureX - w / 2, top, w, bottom - top);
    ctx.strokeStyle = colors.structure;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(structureX - w / 2, top, w, bottom - top);

    // perforations
    ctx.fillStyle = colors.structure;
    const holeCount = 9;
    for (let i = 0; i < holeCount; i++) {
      const y = top + ((bottom - top) / (holeCount - 1)) * i;
      ctx.beginPath();
      ctx.arc(structureX, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // mooring lines to floor, suggesting a floating cage
    ctx.strokeStyle = "rgba(201,161,90,0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(structureX - w / 2 - 4, bottom);
    ctx.lineTo(structureX - w / 2 - 4, height);
    ctx.moveTo(structureX + w / 2 + 4, bottom);
    ctx.lineTo(structureX + w / 2 + 4, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const midY = height * 0.52;

    // baseline still-water line
    ctx.strokeStyle = colors.baseline;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    const k = (Math.PI * 2) / wavelength;
    const omega = (Math.PI * 2) / period;
    const attenuation = 0.42; // fraction of amplitude that survives the structure

    // Incident wave: left region up to the structure
    ctx.beginPath();
    ctx.strokeStyle = colors.incident;
    ctx.lineWidth = 2;
    for (let x = 0; x <= structureX; x++) {
      const y = midY + Math.sin(x * k - time * omega) * amplitude;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Transmitted / scattered wave: right region, reduced amplitude + phase lag
    ctx.beginPath();
    ctx.strokeStyle = colors.transmitted;
    ctx.lineWidth = 2;
    for (let x = structureX; x <= width; x++) {
      const localAmp =
        amplitude * attenuation +
        (amplitude - amplitude * attenuation) *
          Math.exp(-(x - structureX) / 90); // near-field bump decaying with distance
      const y =
        midY +
        Math.sin(x * k - time * omega - 0.6) * localAmp;
      if (x === structureX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    drawStructure(midY);

    // ease amplitude toward drag target
    amplitude += (targetAmplitude - amplitude) * 0.08;
  }

  function tick() {
    time += 1 / 60;
    draw();
    if (!prefersReduced) requestAnimationFrame(tick);
  }

  // ---- pointer interaction: drag vertically to change wave height ----
  let dragging = false;
  let startY = 0;
  let startAmp = amplitude;

  function pointerY(e) {
    return e.touches ? e.touches[0].clientY : e.clientY;
  }

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    startY = pointerY(e);
    startAmp = targetAmplitude;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dy = startY - pointerY(e);
    targetAmplitude = Math.min(46, Math.max(6, startAmp + dy * 0.4));
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach((evt) =>
    canvas.addEventListener(evt, () => (dragging = false))
  );

  window.addEventListener("resize", resize);
  resize();

  if (prefersReduced) {
    draw(); // static single frame, respects reduced-motion preference
  } else {
    tick();
  }
})();
