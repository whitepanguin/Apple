fetch("../header.html")
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

    const searchBtn = document.querySelector(".header__button__search");
    const searchInputArea = document.getElementById("searchInputArea");

    const headerHeight = header.offsetHeight;

    // ✅ 스크롤 시 헤더 줄 생성 및 검색 버튼 크기 조절
    let lastScrollY = window.scrollY;

    document.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      // 헤더 스타일 변경
      if (currentScrollY > headerHeight) {
        header.classList.add("header--line");
        header__button__searchs.forEach((btn) =>
          btn.classList.add("header__button__search--size")
        );
      } else {
        header.classList.remove("header--line");
        header__button__searchs.forEach((btn) =>
          btn.classList.remove("header__button__search--size")
        );
      }

      // ⬆️ 스크롤 올릴 때 검색창 닫기
      if (currentScrollY < lastScrollY) {
        const searchInputArea = document.getElementById("searchInputArea");
        if (searchInputArea && !searchInputArea.classList.contains("hidden")) {
          searchInputArea.classList.add("hidden");
        }
      }

      lastScrollY = currentScrollY;
    });

    // ✅ 햄버거 버튼 클릭 → 메뉴 열기
    hamburgerBtn.addEventListener("click", () => {
      menu.classList.remove("display__none");
      headerXBtn.classList.remove("display__none");

      searchAreaBtn.classList.add("display__none");
      hamburgerBtn.classList.add("display__none");

      searchInputArea.classList.add("hidden");

      header__button__searchs.forEach((btn) =>
        btn.classList.add("display__none")
      );

      document.body.style.overflow = "hidden";
    });

    // ✅ X 버튼 클릭 → 메뉴 닫기
    headerXBtn.addEventListener("click", () => {
      menu.classList.add("display__none");
      headerXBtn.classList.add("display__none");

      searchAreaBtn.classList.remove("display__none");
      hamburgerBtn.classList.remove("display__none");

      searchInputArea.classList.add("hidden");

      header__button__searchs.forEach((btn) =>
        btn.classList.remove("display__none")
      );

      document.body.style.overflow = "";
    });

    // ✅ 검색 버튼 클릭 시 검색창 토글
    searchBtn.addEventListener("click", () => {
      searchInputArea.classList.toggle("hidden");
    });

    // ✅ 카테고리 메뉴 토글 핸들러
    attachCategoryMenuToggle();
  })
  .catch((err) => console.log("헤더 로딩 실패", err));

// ✅ 카테고리 메뉴 열기/닫기 핸들러 정의
function attachCategoryMenuToggle() {
  const categoryBtn = document.querySelector(".selectCategoryBtn");
  const categoryMenu = document.getElementById("categoryMenu");

  if (!categoryBtn || !categoryMenu) {
    console.warn("카테고리 버튼 또는 메뉴 요소가 없습니다.");
    return;
  }

  categoryBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // 이벤트 전파 방지 (문서 전체 클릭에 걸리지 않게)
    categoryMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!categoryBtn.contains(e.target) && !categoryMenu.contains(e.target)) {
      categoryMenu.classList.add("hidden");
    }
  });
}
