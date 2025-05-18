fetch("../header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const header = document.querySelector(".header");
    const searchIconBtn = document.querySelector(".header__button__search");
    const searchInputArea = document.getElementById("searchInputArea");
    const headerHeight = header.offsetHeight;

    // ✅ 검색 엔진
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    async function handleSearch() {
      const query = searchInput.value.trim();
      if (!query) {
        alert("검색어를 입력해주세요.");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8000/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        console.log("🔍 검색 결과:", data.results);

        // 여기에 검색 결과 렌더링 함수 추가
        // 기존의 전체 데이터 인덱싱 후 렌더링 예정
      } catch (err) {
        console.error("검색 요청 실패:", err);
        alert("검색 중 오류가 발생했습니다.");
      }
    }

    // ✅ 검색 버튼 클릭 시 검색창 토글
    if (searchIconBtn && searchInputArea) {
      searchIconBtn.addEventListener("click", () => {
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

    if (searchBtn && searchInput) {
      searchBtn.addEventListener("click", handleSearch);
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSearch();
      });
    }
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
