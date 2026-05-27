window.addEventListener("load", () => {
  if (window.gsap) {
    gsap.to(".reveal", {
      autoAlpha: 1,
      y: 0,
      duration: 1.65,
      ease: "power4.out",
      stagger: 0.16,
    });
    return;
  }

  document.body.classList.add("is-ready");
});
