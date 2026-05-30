document.body.classList.add("is-loading");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
  }, 650);

  if (window.gsap) {
    window.setTimeout(() => {
      gsap.to(".reveal", {
        autoAlpha: 1,
        y: 0,
        duration: 1.65,
        ease: "power4.out",
        stagger: 0.16,
      });
    }, 520);
    return;
  }
});

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

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
