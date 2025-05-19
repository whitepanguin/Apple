fetch("../header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    // DOM 삽입 후 요소 다시 참조
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const welcomeEl = document.getElementById("welcome-message");

    // ✅ 저장된 토큰 확인
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      // ✅ 토큰이 있을 경우 사용자 상태 확인
      fetch("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("인증 실패");
          return res.json();
        })
        .then((data) => {
          // ✅ 로그인 상태일 경우
          loginBtn?.classList.add("hidden");
          logoutBtn?.classList.remove("hidden");

          if (welcomeEl && data.userid) {
            welcomeEl.textContent = `${data.userid}님 안녕하세요!`;
            welcomeEl.classList.remove("hidden");
          }
        })
        .catch(() => {
          // ✅ 토큰 유효하지 않음 → 로그아웃 처리
          loginBtn?.classList.remove("hidden");
          logoutBtn?.classList.add("hidden");
          welcomeEl?.classList.add("hidden");
        });
    } else {
      // ✅ 토큰이 아예 없으면 비로그인 상태 처리
      loginBtn?.classList.remove("hidden");
      logoutBtn?.classList.add("hidden");
      welcomeEl?.classList.add("hidden");
    }

    // ✅ 로그아웃 처리
    logoutBtn?.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await fetch("/auth/logout", { method: "POST" });
      } catch (e) {
        console.error("서버 로그아웃 실패:", e);
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
      // 로그인 상태
      if (loginBtn) loginBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";

      // ✅ 환영 메시지 표시
      const welcomeEl = document.getElementById("welcome-message");
      if (welcomeEl && data.userid) {
        welcomeEl.textContent = `${data.userid}님 어서오세요!`;
        welcomeEl.style.display = "inline-block"; // 표시
      }
    }
  })
  .catch(() => {
    // 로그인 안 된 상태
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";

    const welcomeEl = document.getElementById("welcome-message");
    if (welcomeEl) welcomeEl.style.display = "none";
  });