/* ============================================================
   SALMAN SHAH
   Academic Research Portfolio
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------------------------------------
     Smooth navigation
     ---------------------------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const header = document.querySelector(".topbar");

      const headerHeight = header
        ? header.offsetHeight
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        16;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

    });

  });


  /* ----------------------------------------------------------
     HERO RESEARCH VIDEO
     ---------------------------------------------------------- */

  const heroVideo =
    document.querySelector(".hero-video video");


  /*
     Try to start the video automatically.

     Because the video is muted, modern browsers
     normally allow autoplay.
  */

  if (heroVideo) {

    heroVideo.muted = true;

    const playVideo = () => {

      const playPromise = heroVideo.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {
          /*
             Browser blocked autoplay.
             The video will still work normally
             if the user interacts with the page.
          */
        });

      }

    };

    playVideo();

  }


  /* ----------------------------------------------------------
     PAUSE VIDEO WHEN IT IS OFF SCREEN
     ---------------------------------------------------------- */

  if (
    heroVideo &&
    "IntersectionObserver" in window
  ) {

    const videoObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              heroVideo.play().catch(() => {});

            } else {

              heroVideo.pause();

            }

          });

        },
        {
          threshold: 0.15
        }
      );

    videoObserver.observe(heroVideo);

  }


  /* ----------------------------------------------------------
     SUBTLE VIDEO PARALLAX EFFECT
     ---------------------------------------------------------- */

  const hero =
    document.querySelector(".hero");


  if (hero && heroVideo) {

    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {

        if (!ticking) {

          window.requestAnimationFrame(() => {

            const scrollY =
              Math.min(window.scrollY, 500);

            /*
              Very subtle zoom while scrolling.
              This prevents the effect from looking flashy.
            */

            const scale =
              1 + scrollY * 0.00005;

            heroVideo.style.transform =
              `scale(${scale})`;

            ticking = false;

          });

          ticking = true;

        }

      },
      {
        passive: true
      }
    );

  }


  /* ----------------------------------------------------------
     ACTIVE NAVIGATION
     Highlights the section currently being viewed.
     ---------------------------------------------------------- */

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  const navLinks = document.querySelectorAll(
    ".nav-links a"
  );


  if (
    sections.length &&
    navLinks.length &&
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            const currentId =
              entry.target.getAttribute("id");

            navLinks.forEach(link => {

              const linkTarget =
                link.getAttribute("href");

              if (
                linkTarget === `#${currentId}`
              ) {

                link.classList.add("active");

              } else {

                link.classList.remove("active");

              }

            });

          });

        },
        {
          rootMargin:
            "-25% 0px -65% 0px"
        }
      );


    sections.forEach(section => {
      sectionObserver.observe(section);
    });

  }


  /* ----------------------------------------------------------
     IMAGE FALLBACK
     ---------------------------------------------------------- */

  const profileImage =
    document.querySelector(".profile-photo img");


  if (profileImage) {

    profileImage.addEventListener(
      "error",
      () => {

        profileImage.style.display =
          "none";

        profileImage.parentElement
          .classList.add("photo-missing");

      }
    );

  }


  /* ----------------------------------------------------------
     VIDEO ERROR HANDLING
     ---------------------------------------------------------- */

  if (heroVideo) {

    heroVideo.addEventListener(
      "error",
      () => {

        const videoContainer =
          document.querySelector(".hero-video");

        if (!videoContainer) {
          return;
        }

        /*
          If the video cannot load, keep the
          hero visually attractive instead of
          showing a broken video element.
        */

        videoContainer.classList.add(
          "video-unavailable"
        );

      }
    );

  }

});
