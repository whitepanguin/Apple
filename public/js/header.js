const token = localStorage.getItem("token") || sessionStorage.getItem("token");

fetch("../header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const header = document.querySelector(".header");
    const searchIconBtn = document.querySelector(".header__button__search");
    const searchInputArea = document.getElementById("searchInputArea");
    const headerHeight = header.offsetHeight;
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileDropdown = document.getElementById("mobileDropdown");

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

    if (searchIconBtn && searchInputArea) {
      searchIconBtn.addEventListener("click", () => {
        searchInputArea.classList.toggle("hidden");
      });
    }

    let lastScrollY = window.scrollY;
    document.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > headerHeight) {
        header.classList.add("header--line");
      } else {
        header.classList.remove("header--line");
      }
      if (currentScrollY < lastScrollY) {
        if (searchInputArea && !searchInputArea.classList.contains("hidden")) {
          searchInputArea.classList.add("hidden");
        }
      }
      lastScrollY = currentScrollY;
    });

    attachCategoryMenuToggle();

    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const welcomeEl = document.getElementById("welcome-message");
    const mypageBtn = document.getElementById("mypageBtn");

    // 모바일 메뉴 로직 추가
    if (mobileMenuBtn && mobileDropdown) {
      mobileMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        mobileDropdown.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (
          !mobileMenuBtn.contains(e.target) &&
          !mobileDropdown.contains(e.target)
        ) {
          mobileDropdown.classList.remove("show");
        }
      });
    }

    if (token) {
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
          loginBtn?.classList.add("hidden");
          logoutBtn?.classList.remove("hidden");
          logoutBtn.style.display = "inline-block";
          mypageBtn && (mypageBtn.style.display = "inline-block");

          if (welcomeEl && data.userid) {
            welcomeEl.textContent = `${data.userid}님 안녕하세요!`;
            welcomeEl.classList.remove("hidden");
          }

          if (mobileDropdown) {
            mobileDropdown.innerHTML = `
              <button onclick="location.href='mycarrot.html'">마이페이지</button>
              <form action='/auth/logout' method='POST'>
                <button type='submit'>로그아웃</button>
              </form>
            `;
          }
        })
        .catch(() => {
          loginBtn?.classList.remove("hidden");
          logoutBtn?.classList.add("hidden");
          welcomeEl?.classList.add("hidden");
          if (mobileDropdown) {
            mobileDropdown.innerHTML = `<button onclick="location.href='login.html'">로그인</button>`;
          }
        });
    } else {
      loginBtn?.classList.remove("hidden");
      logoutBtn?.classList.add("hidden");
      welcomeEl?.classList.add("hidden");
      if (mobileDropdown) {
        mobileDropdown.innerHTML = `<button onclick="location.href='login.html'">로그인</button>`;
      }
    }

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

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }
});
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
