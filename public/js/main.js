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
  if (imageSearchPanel) {
    imageSearchPanel.addEventListener("click", () => {
      imageSearchPanel.classList.add("hidden");
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

  // 지역 선택 버튼 클릭 시 박스 표시
  document
    .querySelector(".search__button__searchArea")
    .addEventListener("click", () => {
      regionBox.classList.add("show");
      console.log("✅ 지역 박스가 표시되었음!");
    });

  // 닫기 버튼 클릭 시 박스 숨기기
  const closeBtn = document.getElementById("close-region-box");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      regionBox.classList.remove("show");
    });
  }

  // 현재 내 위치 버튼 클릭 시
  const locationBtn = document.getElementById("get-location-btn");
  if (locationBtn) {
    locationBtn.addEventListener("click", async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // ✅ 카카오 API 호출로 동 이름 가져오기
            try {
              const res = await fetch(
                `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
                {
                  headers: {
                    Authorization: `KakaoAK 8b360f9642c5df7d25933886c4f9d7b2`, // ✅ KakaoAK 붙이기!
                  },
                }
              );

              const data = await res.json();
              const region = data.documents?.[0]?.region_2depth_name;

              if (region) {
                updateRegionText(region);
                localStorage.setItem("region", region);
              } else {
                alert("지역 정보를 가져올 수 없습니다.");
              }

              regionBox.classList.remove("show");
            } catch (err) {
              console.error("카카오 API 오류:", err);
              alert("위치 정보를 가져오는데 실패했습니다.");
            }
          },
          (error) => {
            console.warn("위치 권한 거부됨", error);
            alert("위치 권한을 허용해주세요.");
          }
        );
      } else {
        alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      }
    });
  }

  // 지역 태그 클릭 바인딩
  attachRegionClickHandlers();
  attachCategoryMenuToggle();
});

// 8. 초기 위치 권한 확인용 로그 (선택적)
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("위치 권한 허용됨!", position.coords);
      },
      (error) => {
        console.warn("위치 권한 거부됨", error);
      }
    );
  }
};
