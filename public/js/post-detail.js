//  1. URL에서 게시글 ID 추출
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

// 2. 시간 계산 함수
function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

//  3. 게시글 ID 없을 경우 예외 처리
if (!postId) {
  console.error("❌ 게시글 ID가 없습니다.");
} else {
  //  4. 게시글 데이터 불러오기
  fetch(`/posts/${postId}`)
    .then((res) => {
      if (!res.ok) throw new Error("서버 오류");
      return res.json();
    })
    .then((post) => {
      // 5. 게시글 화면에 출력
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
      console.log("✅ 게시글 데이터:", post);

      // 6. 판매자 정보 요청 및 출력
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

      // 7. 수정 모달 요소 및 이벤트 연결
      const editBtn = document.getElementById("edit-post");
      const modal = document.getElementById("edit-modal");
      const cancelBtn = document.getElementById("cancel-edit");
      const submitBtn = document.getElementById("submit-edit");

      // 수정 버튼 ->모달 열기 + 값 채우기
      editBtn?.addEventListener("click", () => {
        document.getElementById("edit-tittle").value = post.tittle;
        document.getElementById("edit-category").value = post.category;
        document.getElementById("edit-price").value = post.price;
        document.getElementById("edit-text").value = post.text;
        modal.classList.remove("hidden");
      });

      // 취소 버튼 -> 모달 닫기
      cancelBtn?.addEventListener("click", () => {
        modal.classList.add("hidden");
      });

      // 수정 완료 -> PATCH 요청
      submitBtn?.addEventListener("click", async () => {
        const updateData = {
          tittle: document.getElementById("edit-tittle").value,
          category: document.getElementById("edit-category").value,
          price: Number(document.getElementById("edit-price").value),
          text: document.getElementById("edit-text").value,
        };

        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`/posts/${post._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          });

          if (!response.ok) throw new Error("수정 실패");
          alert("수정 완료!");
          location.reload();
        } catch (err) {
          console.error("❌ 수정 중 에러:", err);
          alert("수정 중 오류 발생");
        }
      });

      // 8. 삭제 버튼 이벤트 연결
      const deleteBtn = document.getElementById("delete-post");

      deleteBtn?.addEventListener("click", async (e) => {
        e.preventDefault();
        const confirmed = confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`/posts/${post._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 204) {
            alert("삭제가 완료되었습니다.");
            window.location.href = "./post.html";
          } else if (response.status === 403) {
            alert("본인 게시글만 삭제할 수 있습니다.");
          } else if (response.status === 404) {
            alert("게시글이 존재하지 않습니다.");
          } else {
            throw new Error("알 수 없는 오류 발생");
          }
        } catch (err) {
          console.error("❌ 삭제 중 오류:", err);
          alert("삭제 중 오류가 발생했습니다.");
        }
      });
    })
    .catch((err) => {
      console.error("❌ 게시글 불러오기 실패:", err);
      alert("해당 게시글을 찾을 수 없습니다.");
    });
}
