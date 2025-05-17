fetch("../header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const header = document.querySelector(".header");
    const searchIconBtn = document.querySelector(".header__button__search");
    const searchInputArea = document.getElementById("searchInputArea");
    const headerHeight = header.offsetHeight;

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

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

    // ✅ 카테고리 메뉴 열기/닫기 기능 연결
    attachCategoryMenuToggle();
  })
  .catch((err) => console.log("헤더 로딩 실패", err));

// 검색 엔진
async function handleSearch() {
  const input = searchInput.value.trim();
  if (!input) {
    alert("검색어를 입력해주세요.");
    return;
  }
  try {
    const response = await fetch("http://localhost:8000/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    const data = await response.json();
    console.log("🔹 임베딩 결과:", data.vector);

    // Qdrant, Elasticsearch에 전달
    // fetch("/api/search", { method: "POST", body: JSON.stringify({ vector: data.vector }) })
  } catch (err) {
    console.error("임베딩 요청 실패:", err);
    alert("임베딩에 실패했습니다.");
  }
}

// ✅ 클릭 시 실행
searchBtn.addEventListener("click", handleSearch);

// ✅ 엔터키 입력 시 실행
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

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
