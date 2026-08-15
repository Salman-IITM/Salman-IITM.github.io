/* ============================================================
   SALMAN SHAH — ACADEMIC WEBSITE
   Subtle Vanta ocean background
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  if (
    typeof VANTA !== "undefined" &&
    typeof VANTA.WAVES === "function"
  ) {

    VANTA.WAVES({

      el: "#ocean-header",

      mouseControls: true,

      touchControls: true,

      gyroControls: false,

      minHeight: 200.00,

      minWidth: 200.00,

      scale: 1.00,

      scaleMobile: 1.00,

      color: 0x07506b,

      shininess: 35,

      waveHeight: 12,

      waveSpeed: 0.35,

      zoom: 1.05

    });

  }

});
