import { fetchKakaoLocation } from "./region.js";
import { getLocation } from "./userlocation.js";

// 1. 헤더 동적 삽입 및 초기화
fetch("header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const storedRegion = localStorage.getItem("region");

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
