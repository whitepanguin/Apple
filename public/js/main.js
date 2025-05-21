import { fetchKakaoLocation } from "./region.js";
import { getLocation } from "./userlocation.js";

// 1. 헤더 동적 삽입 및 초기화
fetch("header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const storedRegion = localStorage.getItem("region");
    if (storedRegion) updateRegionText(storedRegion);

    // ✅ 헤더 검색 입력창 바인딩
    const headerSearchInput = document.querySelector(".inputSearch");
    const headerSearchBtn = document.querySelector(".pageMoveBtn");

    if (headerSearchInput && headerSearchBtn) {
      headerSearchBtn.addEventListener("click", () =>
        handleSearch(headerSearchInput)
      );
      headerSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSearch(headerSearchInput);
      });
    }
  })
  .catch((err) => console.error("헤더 로딩 실패", err));

// 2. 메인 검색 입력창 바인딩
window.addEventListener("DOMContentLoaded", () => {
  const mainSearchInput = document.getElementById("mainSearchInput");
  const mainSearchBtn = document.getElementById("mainSearchBtn");

  if (mainSearchInput && mainSearchBtn) {
    mainSearchBtn.addEventListener("click", () =>
      handleSearch(mainSearchInput)
    );
    mainSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSearch(mainSearchInput);
    });
  }

  attachRegionClickHandlers();
});

// 3. 검색 처리 함수
async function handleSearch(inputElement) {
  const query = inputElement.value.trim();
  if (!query) {
    alert("검색어를 입력해주세요.");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:8000/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    console.log("🔍 검색 결과:", data.results);
  } catch (err) {
    console.error("검색 요청 실패:", err);
    alert("검색 중 오류가 발생했습니다.");
  }
}

// 4. 지역 선택 바인딩
function attachRegionClickHandlers() {
  const buttons = document.querySelectorAll(".tag");
  const regionBox = document.getElementById("region-box");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedRegion = button.textContent.trim();

      // 지역 이름 저장
      localStorage.setItem("region", selectedRegion);

      // 화면에 지역 이름 표시
      updateRegionText(selectedRegion);

      // 지역 선택 박스 숨기기
      regionBox.classList.remove("show");
    });
  });
}

// 5. 지역 텍스트 반영
function updateRegionText(regionName) {
  const mainArea = document.getElementById("areaName");
  if (mainArea) {
    mainArea.textContent = regionName;
  }

  const headerP = document.querySelector(".header__button__searchArea p");
  if (headerP) {
    headerP.textContent = regionName;
  }

  const searchP = document.querySelector(".search__button__searchArea p");
  if (searchP) {
    searchP.textContent = regionName;
  }

  document.title = `${regionName} - 지역 선택됨`;
}

// 6. 카테고리 메뉴 열기/닫기
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

// 7. 지역 선택 박스 표시 및 현재 위치 버튼 기능
document.addEventListener("DOMContentLoaded", () => {
  const regionBox = document.getElementById("region-box");
  if (!regionBox) {
    console.error("❌ region-box 요소를 찾을 수 없음! HTML을 확인하세요.");
    return;
  }

  document
    .querySelector(".search__button__searchArea")
    .addEventListener("click", () => {
      const regionBox = document.getElementById("region-box");
      regionBox.classList.add("show"); // ✅ 여기에 console.log 추가
      console.log("지역 박스가 표시되었음!");
    });

  const closeBtn = document.getElementById("close-region-box");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      regionBox.classList.remove("show");
    });
  }

  const locationBtn = document.getElementById("get-location-btn");
  if (locationBtn) {
    locationBtn.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          document.getElementById(
            "areaName"
          ).innerText = `위도: ${latitude}, 경도: ${longitude}`;
          regionBox.classList.remove("show");
        });
      } else {
        alert("위치 정보를 가져올 수 없습니다.");
      }
    });
  }
});

// 8. 위치 권한 요청
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("위치 권한 허용됨!", position.coords);
      },
      (error) => {
        console.warn("위치 권한 거부됨", error);
        alert("위치 권한을 허용해주세요.");
      }
    );
  }
};
document.getElementById("region-box").classList.add("show");
