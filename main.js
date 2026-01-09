const menuBtn = document.getElementById("rightMenu");
const menu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
  } else {
    menu.classList.add("active");
  }
});