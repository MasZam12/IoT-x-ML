document.addEventListener("DOMContentLoaded", function () {
  const reveals = document.querySelectorAll(".reveal");

  function checkVisibility() {
    reveals.forEach((reveal) => {
      const rect = reveal.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        reveal.classList.add("visible");
      } else {
        reveal.classList.remove("visible");
      }
    });
  }

  window.addEventListener("scroll", checkVisibility);
  checkVisibility();
});