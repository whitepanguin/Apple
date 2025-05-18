fetch("header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const storedRegion = localStorage.getItem("region");
    if (storedRegion) updateRegionText(storedRegion);

    // ✅ 헤더 검색 입력창 바인딩
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
  .catch((err) => console.error("헤더 로딩 실패", err));

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

// 3. 검색 처리 함수 (즉시 이동만 담당)
function handleSearch(inputElement) {
  const query = inputElement.value.trim();
  if (!query) {
    alert("검색어를 입력해주세요.");
    return;
  }

  // ✅ 즉시 검색결과 페이지로 이동
  window.location.href = `/search-results.html?q=${encodeURIComponent(query)}`;
}
