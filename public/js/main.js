import { fetchKakaoLocation } from "./region.js";
import { getLocation } from "./userlocation.js";

// 1. 헤더 동적 삽입 및 초기화
fetch("header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const storedRegion = localStorage.getItem("region");
    if (storedRegion) updateRegionText(storedRegion);

    const headerSearchInput = document.querySelector(".inputSearch");
    if (headerSearchInput) {
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
  const imageSearchPanel = document.getElementById("imageSearchPanel");
  const imageUploadBtn = document.querySelector(".upload-btn");
  const imageUploadInput = document.getElementById("imageUploadInput");

  // Enter 키로 검색
  if (mainSearchInput) {
    mainSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = mainSearchInput.value.trim();
        if (query) {
          handleSearch(mainSearchInput);
        } else {
          alert("검색어를 입력해주세요.");
        }
      }
    });
  }

  // 이미지 아이콘 버튼 클릭 시 패널 열기
  if (mainSearchBtn && imageSearchPanel) {
    mainSearchBtn.addEventListener("click", () => {
      imageSearchPanel.classList.toggle("hidden");
    });
  }

  // 이미지 업로드 버튼
  if (imageUploadBtn && imageUploadInput) {
    imageUploadBtn.addEventListener("click", () => {
      imageUploadInput.click();
    });

    imageUploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`선택된 파일: ${file.name}`);
        // TODO: 파일 업로드 처리
      }
    });
  }
  attachRegionClickHandlers();
});

// 3. 검색 처리 함수
function handleSearch(inputElement) {
  const query = inputElement.value.trim();
  if (!query) {
    alert("검색어를 입력해주세요.");
    return;
  }

  window.location.href = `/search-results.html?q=${encodeURIComponent(query)}`;
}

function attachRegionClickHandlers() {
  const buttons = document.querySelectorAll(".tag");
  const regionBox = document.getElementById("region-box");
  let lastSelectedRegion = localStorage.getItem("region") || "";

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedRegion = button.textContent.trim();

      if (
        selectedRegion === lastSelectedRegion &&
        regionBox.classList.contains("show")
      ) {
        regionBox.classList.remove("show");
        return;
      }

      localStorage.setItem("region", selectedRegion);
      lastSelectedRegion = selectedRegion;

      updateRegionText(selectedRegion);
      regionBox.classList.remove("show");
    });
  });
}

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
