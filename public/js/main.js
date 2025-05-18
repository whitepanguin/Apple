// 1. 헤더 동적 삽입 및 초기화
fetch("header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const storedRegion = localStorage.getItem("region");
    if (storedRegion) {
      updateRegionText(storedRegion);
    }

    // ✅ 헤더 검색 입력창 (선택사항, 따로 동작하게 할 수도 있음)
    const headerSearchInput = document.querySelector(".inputSearch");
    const headerSearchBtn = document.querySelector(".pageMoveBtn");

    if (headerSearchInput && headerSearchBtn) {
      headerSearchBtn.addEventListener("click", () =>
        handleSearch(headerSearchInput)
      );
      headerSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSearch(headerSearchInput);
      });
    }

    attachCategoryMenuToggle();
    attachRegionClickHandlers();
  })
  .catch((err) => console.log("헤더 로딩 실패", err));

// 2. 메인 검색 입력창 바인딩
window.addEventListener("DOMContentLoaded", () => {
  const mainSearchInput = document.getElementById("mainSearchInput");
  const mainSearchBtn = document.getElementById("mainSearchBtn");

  if (mainSearchInput && mainSearchBtn) {
    mainSearchBtn.addEventListener("click", () =>
      handleSearch(mainSearchInput)
    );
    mainSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSearch(mainSearchInput);
    });
  }
});

// 3. 검색 처리 함수 (공통 사용)
async function handleSearch(inputElement) {
  const query = inputElement.value.trim();
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
    // TODO: renderSearchResults(data.results); ← 나중에 구현
  } catch (err) {
    console.error("검색 요청 실패:", err);
    alert("검색 중 오류가 발생했습니다.");
  }
}

// 4. 지역 선택 바인딩
function attachRegionClickHandlers() {
  const buttons = document.querySelectorAll(".tag");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedRegion = button.textContent.trim();
      localStorage.setItem("region", selectedRegion);
      updateRegionText(selectedRegion);
    });
  });
}

// 5. 지역 텍스트 반영
function updateRegionText(regionName) {
  const mainArea = document.getElementById("areaName");
  if (mainArea) {
    mainArea.textContent = regionName;
  }

  const headerP = document.querySelector(".header__button__searchArea p");
  if (headerP) {
    headerP.textContent = regionName;
  }

  const searchP = document.querySelector(".search__button__searchArea p");
  if (searchP) {
    searchP.textContent = regionName;
  }

  document.title = `${regionName} - 지역 선택됨`;
}

// 6. 카테고리 메뉴 열기/닫기
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
