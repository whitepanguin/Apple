//  URL에서 게시글 ID 추출
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

//  시간 계산 함수
function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

//  게시글 ID가 없을 경우 예외 처리
if (!postId) {
  console.error("❌ 게시글 ID가 없습니다.");
} else {
  //  게시글 데이터 불러오기
  fetch(`/posts/${postId}`)
    .then((res) => {
      if (!res.ok) throw new Error("서버 오류");
      return res.json();
    })
    .then((post) => {
      //  받아온 게시글 데이터 화면에 출력
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
      document.getElementById("post-time").textContent = timeAgo(
        post.createdAt
      );

      // 판매자 정보 요청 후 화면에 출력 manner 데이터
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

      //  수정 모달 관련 DOM 요소 가져오기
      const editBtn = document.getElementById("edit-post");
      const modal = document.getElementById("edit-modal");
      const cancelBtn = document.getElementById("cancel-edit");
      const submitBtn = document.getElementById("submit-edit");

      //  수정하기 버튼 클릭 -> 모달 열기 -> 기존 값 채우기
      if (editBtn) {
        editBtn.addEventListener("click", () => {
          document.getElementById("edit-tittle").value = post.tittle;
          document.getElementById("edit-category").value = post.category;
          document.getElementById("edit-price").value = post.price;
          document.getElementById("edit-text").value = post.text;
          modal.classList.remove("hidden");
        });
      }

      // 취소 버튼 클릭 -> 모달 닫기
      cancelBtn?.addEventListener("click", () => {
        modal.classList.add("hidden");
      });

      //  수정 완료 버튼 클릭 -> PATCH 요청 전송
      submitBtn?.addEventListener("click", async () => {
        const updateData = {
          tittle: document.getElementById("edit-tittle").value,
          category: document.getElementById("edit-category").value,
          price: Number(document.getElementById("edit-price").value),
          text: document.getElementById("edit-text").value,
        };

        try {
          const token = localStorage.getItem("token"); // 토큰 반드시 필요
          const response = await fetch(`/posts/${post._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, //  인증 헤더
            },
            body: JSON.stringify(updateData),
          });

          if (!response.ok) throw new Error("수정 실패");
          alert("수정 완료!");
          location.reload(); //  새로고침으로 최신 데이터 반영
        } catch (err) {
          console.error("❌ 수정 중 에러:", err);
          alert("수정 중 오류 발생");
        }
      });
    })
    .catch((err) => {
      console.error("❌ 게시글 불러오기 실패:", err);
      alert("해당 게시글을 찾을 수 없습니다.");
    });
}
