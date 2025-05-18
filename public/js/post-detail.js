// post-detail.js

// 1. URL에서 게시글 ID 추출
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

// 시간 차이 출력 함수
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
      // ✅ 게시글 정보 화면에 출력
      document.getElementById("post-image").src = post.img;
      document.getElementById("post-title").textContent = post.tittle;
      document.getElementById("post-category-text").textContent = post.category;
      document.getElementById(
        "post-price"
      ).textContent = `${post.price.toLocaleString()}원`;

      document.getElementById("post-description").innerHTML = post.text.replace(
        /\n/g,
        "<br>"
      );

      document.getElementById("breadcrumb-title").textContent = post.tittle;

      const createdAt = new Date(post.createdAt);
      document.getElementById("post-time").textContent = timeAgo(
        post.createdAt
      );

      // ✅ 작성자(user) 정보 요청
      fetch(`/api/${post.userid}`)
        .then((res) => {
          if (!res.ok) throw new Error("판매자 정보 없음");
          return res.json();
        })
        .then((user) => {
          document.getElementById("seller-name").textContent = user.userid;
          document.getElementById("seller-meta").textContent = `${
            user.address
          } · 매너온도 ${user.temp.toFixed(1)}°`;
          document.getElementById("seller-image").src =
            user.profilepic || "img/profile.png";
        })
        .catch((err) => {
          console.error("❌ 판매자 정보 불러오기 실패:", err);
          document.getElementById("seller-meta").textContent =
            "주소 정보 없음 · 매너온도 N/A";
        });

      console.log("✅ 게시글 데이터:", post);
    })
    .catch((err) => {
      console.error("❌ 게시글 불러오기 실패:", err);
      alert("해당 게시글을 찾을 수 없습니다.");
    });

  // 클릭시 데이터 불러오기기
  if (postId) {
    fetch(`/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {})
      .catch((err) => console.error("게시글 로딩 실패", err));
  }
}
