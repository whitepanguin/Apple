const params = new URLSearchParams(window.location.search);
const query = params.get("q");
const dataType = params.get("dataType");
const fileName = params.get("fileName");

const resultsContainer = document.getElementById("search-results");
const title = document.getElementById("search-query-title");

if (dataType === "image" && fileName) {
  // 이미지 검색 요청
  title.textContent = `🖼️ ${fileName}로 이미지 검색한 결과`;

  showSkeletonCards(10);

  // 예: 이미지 검색 API 호출
  fetch(
    `http://localhost:8000/search/image?fileName=${encodeURIComponent(
      fileName
    )}`
  )
    .then((res) => {
      if (!res.ok) throw new Error("이미지 검색 실패");
      return res.json();
    })
    .then((data) => {
      renderResults(data.results);
    })
    .catch((err) => {
      console.error("❌ 이미지 검색 오류:", err);
      resultsContainer.innerHTML = "<p>검색 중 오류가 발생했습니다.</p>";
    });
} else if (query) {
  // 텍스트 검색 요청
  title.textContent = `🔍 ${query}의 검색 결과`;

  showSkeletonCards(10);

  fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`)
    .then((res) => {
      if (!res.ok) throw new Error("검색 요청 실패");
      return res.json();
    })
    .then((data) => {
      renderResults(data.results);
    })
    .catch((err) => {
      console.error("❌ 검색 오류:", err);
      resultsContainer.innerHTML = "<p>검색 중 오류가 발생했습니다.</p>";
    });
} else {
  // 검색어 없음
  title.textContent = "❌ 검색어가 없습니다.";
  resultsContainer.innerHTML = "<p>검색어를 입력해주세요.</p>";
}

// 공통 결과 렌더링 함수
function renderResults(results) {
  resultsContainer.innerHTML = ""; // 스켈레톤 제거

  if (!results.length) {
    resultsContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
    return;
  }

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
      </div>`;

    card.addEventListener("click", () => {
      window.location.href = `post-detail.html?id=${item.id}`;
    });

    resultsContainer.appendChild(card);
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
      </div>`;

    resultsContainer.appendChild(skeleton);
  }
}
