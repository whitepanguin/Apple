if (!token) {
  token = sessionStorage.getItem("token") || localStorage.getItem("token");
}

// 초기 프로필 불러오기
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 변경됨
      },
    });

    const data = await res.json();
    if (res.ok && data.profile) {
      document.getElementById("profilePreview").src = data.profile;

      // ✅ 환영 메시지 표시
      const welcomeEl = document.getElementById("nickname");
      if (welcomeEl && data.userid) {
        welcomeEl.textContent = `${data.userid}님`;
        welcomeEl.style.display = "inline-block";
      }
    }
  } catch (err) {
    console.error("프로필 이미지 불러오기 실패:", err);
  }
});

async function loadData() {
  try {
    const response = await fetch("/api/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data);
    } else {
      alert(data.message || "데이터를 불러오는 데 실패했습니다.");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }
}

// 페이지 로드 시 데이터 불러오기
window.onload = function () {
  loadData();
};

// 로그인 페이지 이동
const loginButton = document.getElementById("login-button");
if (loginButton) {
  loginButton.addEventListener("click", () => {
    window.location.href = "/login.html";
  });
}

// 정보수정 페이지로 이동 (로그인 여부 체크 추가)
const retouchButton = document.querySelector(".retouch");
if (retouchButton) {
  retouchButton.addEventListener("click", () => {
    if (token) {
      // 로그인 상태라면 user.html로 이동
      window.location.href = "/user.html";
    } else {
      // 로그인되지 않았다면 login.html로 이동
      alert("로그인이 필요합니다!");
      window.location.href = "/login.html";
    }
  });
}
