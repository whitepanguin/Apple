fetch("../header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const header = document.querySelector(".header");
    const searchBtn = document.querySelector(".header__button__search");
    const searchInputArea = document.getElementById("searchInputArea");
    const headerHeight = header.offsetHeight;

    // ✅ 검색 버튼 클릭 시 검색창 토글
    if (searchBtn && searchInputArea) {
      searchBtn.addEventListener("click", () => {
        searchInputArea.classList.toggle("hidden");
      });
    }

    // ✅ 스크롤 이벤트 처리
    let lastScrollY = window.scrollY;

    document.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      // 헤더 줄 생기기
      if (currentScrollY > headerHeight) {
        header.classList.add("header--line");
      } else {
        header.classList.remove("header--line");
      }

      // 스크롤 ↑ 방향일 때 검색창 닫기
      if (currentScrollY < lastScrollY) {
        if (searchInputArea && !searchInputArea.classList.contains("hidden")) {
          searchInputArea.classList.add("hidden");
        }
      }

      lastScrollY = currentScrollY;
    });

    // ✅ 카테고리 메뉴 열기/닫기 기능 연결
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
