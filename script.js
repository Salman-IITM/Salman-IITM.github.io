/* ============================================================
   SALMAN SHAH — SCIENTIST PORTFOLIO
   Lightweight interaction
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ----------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------- */

  const revealElements = document.querySelectorAll(
    ".paper, .experience-row, .index-section"
  );

  const revealObserver = new IntersectionObserver(
    function (entries, observer) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.08
    }
  );


  revealElements.forEach(function (element) {

    revealObserver.observe(element);

  });



  /* ----------------------------------------------------------
     Smooth navigation
     ---------------------------------------------------------- */

  const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  navigationLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

      const targetId = link.getAttribute("href");

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });



  /* ----------------------------------------------------------
     Active navigation item
     ---------------------------------------------------------- */

  const sections = document.querySelectorAll(
    "#research, #publications, #experience, #recognition"
  );

  const navItems = document.querySelectorAll(
    ".nav-links a"
  );


  const sectionObserver = new IntersectionObserver(
    function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {

          const id = entry.target.id;

          navItems.forEach(function (item) {

            item.classList.remove("active");

            if (item.getAttribute("href") === "#" + id) {
              item.classList.add("active");
            }

          });

        }

      });

    },
    {
      rootMargin: "-20% 0px -65% 0px"
    }
  );


  sections.forEach(function (section) {

    sectionObserver.observe(section);

  });



  /* ----------------------------------------------------------
     Add active styling
     ---------------------------------------------------------- */

  const style = document.createElement("style");

  style.textContent = `
    .nav-links a.active {
      color: #147493;
    }

    .nav-links a.active::after {
      width: 100%;
    }
  `;

  document.head.appendChild(style);

});
