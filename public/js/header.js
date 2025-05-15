fetch("../public/header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const header = document.querySelector(".header");
    const header__button__searchs = document.querySelectorAll(
      ".header__button__search"
    );

    const hamburgerBtn = document.querySelector(".header__hamburger");
    const searchAreaBtn = document.querySelector(".header__button__searchArea");
    const headerXBtn = document.querySelector(".header__x");
    const menu = document.getElementById("menu");

    const headerHeight = header.offsetHeight;

    document.addEventListener("scroll", () => {
      if (window.scrollY > headerHeight) {
        header.classList.add("header--line");
        header__button__searchs.forEach((header__button__search) => {
          header__button__search.classList.add("header__button__search--size");
        });
      } else {
        header.classList.remove("header--line");
        header__button__searchs.forEach((header__button__search) => {
          header__button__search.classList.remove(
            "header__button__search--size"
          );
        });
      }
    });
    hamburgerBtn.addEventListener("click", () => {
      menu.classList.toggle("display__none");
      headerXBtn.classList.toggle("display__none");

      searchAreaBtn.classList.toggle("display__none");
      hamburgerBtn.classList.toggle("display__none");
      header__button__searchs.forEach((header__button__search) => {
        header__button__search.classList.toggle("display__none");
      });

      document.body.style.overflow = "hidden";
    });
  })
  .catch((err) => console.log("헤더 로딩 실패", err));
