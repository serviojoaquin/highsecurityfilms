document.body.classList.add("is-loading");

const legacySectionIds = {
  "#problema": "#para-quien",
  "#autoridad": "#servicios",
  "#nosotros": "#quienes-somos",
};

const migrateLegacyHash = () => {
  const currentHash = window.location.hash;
  const updatedHash = legacySectionIds[currentHash];

  if (!updatedHash) {
    return;
  }

  window.history.replaceState(null, "", updatedHash);
  document.querySelector(updatedHash)?.scrollIntoView();
};

const revealPage = () => {
  if (document.body.classList.contains("is-ready")) {
    return;
  }

  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");

  if (window.gsap) {
    gsap.to(".reveal", {
      autoAlpha: 1,
      y: 0,
      duration: 1.65,
      ease: "power4.out",
      stagger: 0.16,
    });
  }
};

window.addEventListener("load", () => {
  migrateLegacyHash();
  window.setTimeout(revealPage, 650);
});

window.setTimeout(revealPage, 2600);

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

const updateHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const closeMenu = () => {
  header?.classList.remove("is-menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const ambientVideos = document.querySelectorAll(".clients-video-grid video");

const playAmbientVideo = (video) => {
  const source = video.querySelector("source[data-src]");
  if (source) {
    source.src = source.dataset.src;
    source.removeAttribute("data-src");
    video.load();
  }
  video.play().catch(() => {});
};

if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !document.hidden) {
        playAmbientVideo(target);
      } else {
        target.pause();
      }
    });
  }, { threshold: 0.2 });

  ambientVideos.forEach((video) => videoObserver.observe(video));
} else {
  ambientVideos.forEach(playAmbientVideo);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.querySelectorAll("video[autoplay]").forEach((video) => video.pause());
    return;
  }

  document.querySelector(".hero-video")?.play().catch(() => {});
  ambientVideos.forEach((video) => {
    const bounds = video.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) {
      playAmbientVideo(video);
    }
  });
});

const animatedSections = document.querySelectorAll(".section, .cta-band, .final-cta");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  animatedSections.forEach((section) => {
    section.classList.add("scroll-reveal");
    sectionObserver.observe(section);
  });
} else {
  animatedSections.forEach((section) => section.classList.add("is-visible"));
}
