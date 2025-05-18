document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/posts");
    if (!response.ok) throw new Error("게시글 불러오기 실패");

    const posts = await response.json();
    console.log("✅ 받아온 게시글:", posts);

    renderCategoryFilter(posts);
    renderPostList(posts);

    // 필터 클릭 이벤트
    document
      .getElementById("category-filter")
      .addEventListener("change", (e) => {
        if (e.target.name === "category") {
          const selected = e.target.value;
          const filtered =
            selected === "전체"
              ? posts
              : posts.filter((post) => normalize(post.category) === selected);
          renderPostList(filtered);
        }
      });
  } catch (error) {
    console.error("❌ 중고거래 게시글 로딩 실패:", error);
  }
});

// ✅ 중복 제거된 카테고리 렌더링
function renderCategoryFilter(posts) {
  const box = document.getElementById("category-filter");
  box.innerHTML = "";

  const categories = Array.from(
    new Set(posts.map((p) => normalize(p.category)))
  );

  categories.sort();
  categories.unshift("전체");

  categories.forEach((cat) => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="radio" name="category" value="${cat}" />
      ${cat}
    `;
    box.appendChild(label);
  });
}

// ✅ 게시글 목록 렌더링
function renderPostList(posts) {
  const container = document.querySelector(".property-list__box");
  container.innerHTML = "";

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "property";

    card.innerHTML = `
      <div class="img--box">
        <img src="${post.img || "img/default.jpg"}" alt="상품 이미지" />
      </div>
      <div class="info">
        <p>${post.category || "카테고리 없음"}</p>
        <h2>${post.tittle || "제목 없음"}</h2>
        <p>${post.userid || "작성자"} · ${timeAgo(post.createdAt)}</p>
        <p>${Number(post.price).toLocaleString()}원</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// ✅ 시간 계산
function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

// ✅ 문자열 정리 (중복 제거에 사용)
function normalize(str) {
  return (str || "기타").trim();
}

function renderPostList(posts) {
  const listContainer = document.querySelector(".property-list__box");
  listContainer.innerHTML = ""; // 기존 내용 비우기

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "property";

    // ✅ 클릭 시 post-detail.html로 이동
    card.addEventListener("click", () => {
      window.location.href = `post-detail.html?id=${post._id}`;
    });

    card.innerHTML = `
      <div class="img--box">
        <img src="${post.img || "img/default.jpg"}" alt="상품 이미지" />
      </div>
      <div class="info">
        <p>${post.category?.trim() || "카테고리 없음"}</p>
        <h2>${post.tittle || "제목 없음"}</h2>
        <p>${post.userid || "작성자"} · ${timeAgo(post.createdAt)}</p>
        <p>${Number(post.price).toLocaleString()}원</p>
      </div>
    `;

    listContainer.appendChild(card);
  });
}
