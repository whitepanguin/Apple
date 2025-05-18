const params = new URLSearchParams(window.location.search);
const query = params.get("q");

const resultsContainer = document.getElementById("search-results");
const title = document.getElementById("search-query-title");

if (!query) {
  title.textContent = "❌ 검색어가 없습니다.";
  resultsContainer.innerHTML = "<p>검색어를 입력해주세요.</p>";
} else {
  title.textContent = `🔍 "${query}"의 검색 결과`;

  // ✅ 1-1. 스켈레톤 UI 먼저 보여주기
  showSkeletonCards(10);

  // 2. 검색 API 호출
  fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`)
    .then((res) => {
      if (!res.ok) throw new Error("검색 요청 실패");
      return res.json();
    })
    .then((data) => {
      const results = data.results;
      resultsContainer.innerHTML = ""; // 기존 스켈레톤 제거

      if (!results.length) {
        resultsContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
        return;
      }

      // 3. 결과 렌더링
      results.forEach((item) => {
        const card = document.createElement("div");
        card.className = "search-card";
        card.innerHTML = `
          <img src="${
            item.img || "img/placeholder.png"
          }" class="search-card__img" alt="상품 이미지" />
          <div class="search-card__info">
            <h3>${item.title}</h3>
            <p>${item.price.toLocaleString()}원</p>
            <p class="category">${item.category}</p>
          </div>
        `;

        card.addEventListener("click", () => {
          window.location.href = `post-detail.html?id=${item.id}`;
        });

        resultsContainer.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("❌ 검색 오류:", err);
      resultsContainer.innerHTML = "<p>검색 중 오류가 발생했습니다.</p>";
    });
}

function showSkeletonCards(count = 10) {
  resultsContainer.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "search-card skeleton-card";

    skeleton.innerHTML = `
      <div class="skeleton-image skeleton"></div>
      <div class="skeleton-content">
        <div class="skeleton-title skeleton"></div>
        <div class="skeleton-price skeleton"></div>
        <div class="skeleton-category skeleton"></div>
      </div>
    `;

    resultsContainer.appendChild(skeleton);
  }
}
