document.body.classList.add("is-loading");

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

const heroVideo = document.querySelector(".hero-video");

heroVideo?.addEventListener("error", () => {
  if (!heroVideo.dataset.fallbackApplied) {
    heroVideo.dataset.fallbackApplied = "true";
    heroVideo.innerHTML = '<source src="assets/video.mp4" type="video/mp4" />';
    heroVideo.load();
    heroVideo.play().catch(() => {});
  }
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
