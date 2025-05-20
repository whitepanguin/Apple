fetch("../header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const header = document.querySelector(".header");
    const searchIconBtn = document.querySelector(".header__button__search");
    const searchInputArea = document.getElementById("searchInputArea");
    const headerHeight = header.offsetHeight;

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    async function handleSearch() {
      const query = searchInput.value.trim();
      if (!query) {
        alert("검색어를 입력해주세요.");
        return;
      }
      window.location.href = `/search-results.html?q=${encodeURIComponent(
        query
      )}`;
    }
    if (searchBtn && searchInput) {
      searchBtn.addEventListener("click", handleSearch);
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSearch();
      });
    }

    // ✅ 검색 버튼 클릭 시 검색창 토글
    if (searchIconBtn && searchInputArea) {
      searchIconBtn.addEventListener("click", () => {
        searchInputArea.classList.toggle("hidden");
      });
    }

    // ✅ 스크롤 이벤트 처리
    let lastScrollY = window.scrollY;

    document.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      // 헤더 줄 생기기
      if (currentScrollY > headerHeight) {
        header.classList.add("header--line");
      } else {
        header.classList.remove("header--line");
      }

      // 스크롤 ↑ 방향일 때 검색창 닫기
      if (currentScrollY < lastScrollY) {
        if (searchInputArea && !searchInputArea.classList.contains("hidden")) {
          searchInputArea.classList.add("hidden");
        }
      }

      lastScrollY = currentScrollY;
    });

    // ✅ 카테고리 메뉴 열기/닫기 기능 연결
    attachCategoryMenuToggle();

    // DOM 삽입 후 요소 다시 참조
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const welcomeEl = document.getElementById("welcome-message");
    const mypageBtn = document.getElementById("mypageBtn"); // ✅ 추가

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
          // ✅ 마이페이지 버튼 표시
          if (mypageBtn) {
            mypageBtn.style.display = "inline-block";
          }

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
if (token) {
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
}

async function handleSearch() {
  const input = searchInput.value.trim();
  if (!input) {
    alert("검색어를 입력해주세요.");
    return;
  }
  try {
    const response = await fetch("http://localhost:8000/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    const data = await response.json();
    console.log("🔹 임베딩 결과:", data.vector);

    // Qdrant, Elasticsearch에 전달
    // fetch("/api/search", { method: "POST", body: JSON.stringify({ vector: data.vector }) })
  } catch (err) {
    console.error("임베딩 요청 실패:", err);
    alert("임베딩에 실패했습니다.");
  }
}

// ✅ 클릭 시 실행
searchBtn.addEventListener("click", handleSearch);

// ✅ 엔터키 입력 시 실행
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// ✅ 카테고리 메뉴 열기/닫기 핸들러
function attachCategoryMenuToggle() {
  const categoryBtn = document.querySelector(".selectCategoryBtn");
  const categoryMenu = document.getElementById("categoryMenu");

  if (!categoryBtn || !categoryMenu) {
    console.warn("카테고리 버튼 또는 메뉴 요소가 없습니다.");
    return;
  }

  categoryBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    categoryMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!categoryBtn.contains(e.target) && !categoryMenu.contains(e.target)) {
      categoryMenu.classList.add("hidden");
    }
  });
}
