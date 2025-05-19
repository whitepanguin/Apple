fetch("../header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    // ✅ 이제 DOM이 삽입된 이후이므로 다시 요소를 찾음
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    // ✅ 사용자 로그인 상태 확인
    fetch("/auth/me", {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("token") || sessionStorage.getItem("token")
        }`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.userid || data.email) {
          // ✅ 로그인 상태
          if (loginBtn) loginBtn.style.display = "none";
          if (logoutBtn) logoutBtn.style.display = "inline-block";

          // ✅ 환영 메시지 표시
          const welcomeEl = document.getElementById("welcome-message");
          if (welcomeEl && data.userid) {
            welcomeEl.textContent = `${data.userid}님 안녕하세요!`;
          }
        }
      })
      .catch(() => {
        // ✅ 로그인 안 된 상태
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
      });

    // ✅ 로그아웃 로직
    logoutBtn?.addEventListener("click", async (e) => {
      e.preventDefault(); // form의 기본 제출 막기
      try {
        await fetch("/auth/logout", { method: "POST" });
      } catch (e) {
        console.error("서버 로그아웃 실패", e);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("userid");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userid");

      alert("로그아웃 되었습니다.");
      window.location.href = "/main.html";
    });
  })
  .catch((err) => console.log("헤더 로딩 실패", err));
