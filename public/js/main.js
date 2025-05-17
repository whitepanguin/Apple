fetch("header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const storedRegion = localStorage.getItem("region");
    if (storedRegion) {
      updateRegionText(storedRegion); // ← header도 여기서 바뀜
    }

    attachRegionClickHandlers(); // ← 클릭 이벤트 바인딩
    attachCategoryMenuToggle(); // 메뉴 클릭 기능
  });

// 2. 지역 버튼 클릭 처리
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

// 3. 텍스트 반영 함수 (main + header)
function updateRegionText(regionName) {
  // main 영역
  const mainArea = document.getElementById("areaName");
  if (mainArea) {
    mainArea.textContent = regionName;
  }
  // header 영역 (동적 로드된 후에만 존재)
  const headerP = document.querySelector(".header__button__searchArea p");
  if (headerP) {
    headerP.textContent = regionName;
  }
  // search 버튼 내 .search__button__searchArea > p
  const searchP = document.querySelector(".search__button__searchArea p");
  if (searchP) {
    searchP.textContent = regionName;
  }

  document.title = `${regionName} - 지역 선택됨`;
}

// 카테고리 메뉴 열기/닫기 핸들러
function attachCategoryMenuToggle() {
  const categoryBtn = document.querySelector(".selectCategoryBtn");
  const categoryMenu = document.getElementById("categoryMenu");

  if (!categoryBtn || !categoryMenu) {
    console.warn("카테고리 버튼 또는 메뉴 요소가 없습니다.");
    return;
  }

  categoryBtn.addEventListener("click", () => {
    categoryMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!categoryBtn.contains(e.target) && !categoryMenu.contains(e.target)) {
      categoryMenu.classList.add("hidden");
    }
  });
}
