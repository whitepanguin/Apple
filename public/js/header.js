fetch("../header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const header = document.querySelector(".header");

    const hamburgerBtn = document.querySelector(".header__hamburger");
    const searchAreaBtn = document.querySelector(".header__button__searchArea");
    const headerXBtn = document.querySelector(".header__x");
    const menu = document.getElementById("menu");

    const searchBtn = document.querySelector(".header__button__search");
    const searchInputArea = document.getElementById("searchInputArea");

    const headerHeight = header.offsetHeight;

    // ✅ 스크롤 시 헤더 줄만 적용, 검색 버튼은 항상 보임
    let lastScrollY = window.scrollY;

    document.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > headerHeight) {
        header.classList.add("header--line");
      } else {
        header.classList.remove("header--line");
      }

      // ⬆️ 스크롤 올릴 때 검색창 닫기
      if (currentScrollY < lastScrollY) {
        if (searchInputArea && !searchInputArea.classList.contains("hidden")) {
          searchInputArea.classList.add("hidden");
        }
      }

      lastScrollY = currentScrollY;
    });

    // ✅ 햄버거 메뉴 열기
    hamburgerBtn.addEventListener("click", () => {
      menu.classList.remove("display__none");
      headerXBtn.classList.remove("display__none");

      if (searchAreaBtn) searchAreaBtn.classList.add("display__none");
      hamburgerBtn.classList.add("display__none");
      searchInputArea.classList.add("hidden");

      document.body.style.overflow = "hidden";
    });

    // ✅ X 버튼로 메뉴 닫기
    headerXBtn.addEventListener("click", () => {
      menu.classList.add("display__none");
      headerXBtn.classList.add("display__none");

      if (searchAreaBtn) searchAreaBtn.classList.remove("display__none");
      hamburgerBtn.classList.remove("display__none");
      searchInputArea.classList.add("hidden");

      document.body.style.overflow = "";
    });

    // ✅ 검색 버튼 토글
    searchBtn.addEventListener("click", () => {
      searchInputArea.classList.toggle("hidden");
    });

    // ✅ 카테고리 메뉴 토글
    attachCategoryMenuToggle();
  })
  .catch((err) => console.log("헤더 로딩 실패", err));

// ✅ 카테고리 메뉴 열기/닫기 핸들러
function attachCategoryMenuToggle() {
  const categoryBtn = document.querySelector(".selectCategoryBtn");
  const categoryMenu = document.getElementById("categoryMenu");

  if (!categoryBtn || !categoryMenu) {
    console.warn("카테고리 버튼 또는 메뉴 요소가 없습니다.");
    return;
  }

  categoryBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    categoryMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!categoryBtn.contains(e.target) && !categoryMenu.contains(e.target)) {
      categoryMenu.classList.add("hidden");
    }
  });
}
