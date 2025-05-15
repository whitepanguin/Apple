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
