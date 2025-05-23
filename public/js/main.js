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
let selectedSearchType = "used";

window.addEventListener("DOMContentLoaded", () => {
  const dropdownBtn = document.getElementById("categoryDropdownBtn");
  const dropdown = document.getElementById("categoryDropdown");
  const categorySpan = document.getElementById("selectedCategory");
  const mainSearchInput = document.getElementById("mainSearchInput");
  const mainSearchBtn = document.getElementById("mainSearchBtn");
  const imageSearchPanel = document.getElementById("imageSearchPanel");
  const imageUploadBtn = document.querySelector(".upload-btn");
  const imageUploadInput = document.getElementById("imageUploadInput");

  // 검색 index 종류 선택 (중고물품/부동산)
  dropdownBtn.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });
  dropdown.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const type = item.dataset.type;
      selectedSearchType = type;
      categorySpan.textContent = item.textContent;
      dropdown.classList.add("hidden");
    });
  });

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
  // 타입에 따라 es 인덱스 선택됨.
  window.location.href = `/search-results.html?q=${encodeURIComponent(
    query
  )}&type=text&selectedSearchType=${selectedSearchType}`;
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

async function getUserid() {
  const usersToken = sessionStorage.getItem("token");
  if (usersToken) {
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
        // console.log(data.userid);
        sessionStorage.setItem("userid", data.userid);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        alert("서버와 통신 중 문제가 발생했습니다.");
      });
  }
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

//카카오 api
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

            const regionName = await getRegionNameViaProxy(latitude, longitude);
            if (regionName && !regionName.includes("오류")) {
              updateRegionText(regionName);
              localStorage.setItem("region", regionName);
            } else {
              alert("지역 정보를 가져올 수 없습니다.");
            }

            const regionBox = document.getElementById("region-box");
            if (regionBox) regionBox.classList.remove("show");
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
  getUserid();
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
