/*
// 1. 상세 글 하나 불러오기
// ✅ 1. URL에서 게시글 ID 추출
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId) {
  console.error("게시글 ID가 없습니다.");
} else {
  // ✅ 2. 해당 ID로 게시글 하나 불러오기
  fetch(`/posts/${postId}`)
    .then((res) => res.json())
    .then((post) => {
      // HTML 텍스트 가져오기
      const descriptionText =
        document.getElementById("post-description").textContent;

      //  post 객체에 넣기
      post.text = descriptionText;
      console.log("메인에 보여줄 글:", post);
    })

    .catch((err) => {
      console.error("게시글 불러오기 실패:", err);
    });
}
    */

// post-detail.js

// 1. URL에서 게시글 ID 추출
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

if (!postId) {
  console.error("❌ 게시글 ID가 없습니다.");
} else {
  fetch(`/posts/${postId}`)
    .then((res) => {
      if (!res.ok) throw new Error("서버 오류");
      return res.json();
    })
    .then((post) => {
      //  받아온 데이터를 HTML에 반영
      document.getElementById("post-image").src = post.img;
      document.getElementById("post-title").textContent = post.tittle;
      document.getElementById("post-category-text").textContent = post.category;
      document.getElementById(
        "post-price"
      ).textContent = `${post.price.toLocaleString()}원`;
      document.getElementById("post-description").textContent = post.text;
      document.getElementById("seller-name").textContent = post.userid;
      document.getElementById("breadcrumb-category").textContent =
        post.category;
      document.getElementById("breadcrumb-title").textContent = post.tittle;
      const createdAt = new Date(post.createdAt);
      document.getElementById("post-time").textContent =
        createdAt.toLocaleString();
      document.getElementById("post-time").textContent = timeAgo(
        post.createdAt
      );

      // seller-meta는  일단 고정 텍스트
      document.getElementById("seller-meta").textContent =
        "서울 마포구 · 매너온도 36.5°";

      console.log("✅ 화면에 반영된 post:", post);
    })
    .catch((err) => {
      console.error("❌ 게시글 불러오기 실패:", err);
    });
}
