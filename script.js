document.addEventListener("DOMContentLoaded", function () {

  /*
   * Smooth scrolling for internal navigation
   */

  const links = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  links.forEach(function (link) {

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


  /*
   * Highlight the current navigation section
   */

  const sections = document.querySelectorAll(
    "#research, #publications, #experience, #recognition"
  );

  const navLinks = document.querySelectorAll(
    ".nav-links a"
  );


  const observer = new IntersectionObserver(
    function (entries) {

      entries.forEach(function (entry) {

        if (!entry.isIntersecting) {
          return;
        }

        const currentId = entry.target.id;

        navLinks.forEach(function (link) {

          link.classList.remove("active");

          if (
            link.getAttribute("href") === "#" + currentId
          ) {
            link.classList.add("active");
          }

        });

      });

    },
    {
      rootMargin: "-20% 0px -65% 0px"
    }
  );


  sections.forEach(function (section) {
    observer.observe(section);
  });


  /*
   * Small fade-in effect for publication and experience
   * records.
   */

  const records = document.querySelectorAll(
    ".paper, .experience"
  );

  const revealObserver = new IntersectionObserver(
    function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {

          entry.target.classList.add("show");

          revealObserver.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.08
    }
  );


  records.forEach(function (record) {

    record.style.opacity = "0";
    record.style.transform = "translateY(10px)";
    record.style.transition =
      "opacity 0.5s ease, transform 0.5s ease";

    revealObserver.observe(record);

  });


  /*
   * Apply the visible state.
   */

  document.addEventListener(
    "scroll",
    function () {

      document
        .querySelectorAll(".show")
        .forEach(function (element) {

          element.style.opacity = "1";
          element.style.transform = "translateY(0)";

        });

    },
    { passive: true }
  );

});
