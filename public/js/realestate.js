// ✅ 평수 슬라이더
const rangeInput = document.getElementById("pyeongRange");
const valueDisplay = document.getElementById("pyeongValue");

rangeInput.addEventListener("input", () => {
  valueDisplay.textContent = `${rangeInput.value}평이상`;
  applyFilter(); // 슬라이더 변경 시 실시간 필터링
});

// ✅ 필터 적용 버튼 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
  const applyBtn = document.getElementById("applyBtn");
  if (applyBtn) {
    applyBtn.addEventListener("click", applyFilter);
  }
});

// ✅ 필터 적용 함수
function applyFilter() {
  const selectedRoomTypes = getCheckedValues("room-type");
  const selectedDealTypes = getCheckedValues("deal-type");
  const selectedFloors = getUncheckedNameValues("층수");
  const selectedOptions = getUncheckedNameValues("옵션");

  const selectedPyeong = parseInt(document.getElementById("pyeongRange").value);
  const usePyeong = document.getElementById("usePyeong").checked;

  const properties = document.querySelectorAll(".property");

  properties.forEach((property) => {
    const infoText = property.innerText;
    let show = true;

    // 매물 종류
    if (
      selectedRoomTypes.length > 0 &&
      !selectedRoomTypes.some((type) => infoText.includes(type))
    ) {
      show = false;
    }

    // 거래 유형
    if (
      selectedDealTypes.length > 0 &&
      !selectedDealTypes.some((type) => infoText.includes(type))
    ) {
      show = false;
    }

    // 층수
    if (selectedFloors.length > 0) {
      const floorMatch = selectedFloors.some((floor) => {
        if (floor === "1층") {
          return /(^|\s)1층($|\s)/.test(infoText);
        }
        if (floor === "2~5층") {
          return /(^|\s)(2층|3층|4층|5층)($|\s)/.test(infoText);
        }
        if (floor === "6~9층") {
          return ["6층", "7층", "8층", "9층"].some((f) => infoText.includes(f));
        }
        if (floor === "10층 이상") {
          return /1[0-9]층|[2-9][0-9]층/.test(infoText);
        }
        return false;
      });
      if (!floorMatch) show = false;
    }

    // 평수
    if (usePyeong) {
      const match = infoText.match(/\b(\d{1,3})\s*평\b/);
      const pyeongNum = match ? parseInt(match[1]) : 0;
      if (pyeongNum < selectedPyeong) {
        show = false;
      }
    }

    // 옵션
    if (selectedOptions.length > 0) {
      const optionMatch = selectedOptions.every((option) =>
        infoText.includes(option)
      );
      if (!optionMatch) show = false;
    }

    property.style.display = show ? "block" : "none";
  });
}

// ✅ 체크된 값 가져오기
function getCheckedValues(name) {
  return Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`)
  ).map((el) => el.value);
}

// ✅ 체크된 필터 그룹에서 값 가져오기
function getUncheckedNameValues(sectionLabelText) {
  const group = Array.from(document.querySelectorAll(".filter-group")).find(
    (group) => group.innerText.includes(sectionLabelText)
  );
  if (!group) return [];

  const inputs = group.querySelectorAll("input[type='checkbox']:checked");
  return Array.from(inputs).map((input) => {
    const label = input.closest("label");
    return label ? label.innerText.trim() : "";
  });
}

// ✅ 사이드바 토글 (모바일 전용)
function toggleFilter() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("show");
  document.body.classList.toggle("sidebar-open", sidebar.classList.contains("show"));
}

function applyMobileFilter() {
  applyFilter();
  toggleFilter();
}

// ✅ 매물 데이터 렌더링
function insertImg(items) {
  const container = document.querySelector(".property-list__box");
  container.innerHTML = "";

  items.forEach((item) => {
    const conditionText = [];
    if (item.condition.loan_available) conditionText.push("대출가능");
    if (item.condition.parking) conditionText.push("주차가능");
    if (item.condition.pet_allowed) conditionText.push("반려동물");
    if (item.condition.elevator) conditionText.push("엘리베이터");

    const conditionResult = conditionText.join(", ");
    const detailList = item.details
      .map((detail) => `<div>${detail}</div>`)
      .join("");

    const priceText =
      item.price === "월세"
        ? `${item.deposit || 0} / ${item.monthly_rent || 0}`
        : item.price === "전세"
        ? `${item.deposit || 0}`
        : `${item.sale}`; // 매매

    const div = document.createElement("div");
    div.className = "property";
    div.innerHTML = `
      <img src="./uploads/${item.img}" alt="매물 이미지" />
      <div class="info">
        <p>${item.building_usage}</p>
        <h2>${item.price} / ${priceText}</h2>
        <p>${item.floor} / ${item.supply_area}</p>
        <p>${conditionResult}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

// ✅ 서버에서 매물 데이터 불러오기
async function loadData() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("/real", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      insertImg(data);
      console.log(data);
    } else {
      alert(data.message || "데이터 불러옴 실패");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }
}

// ✅ 기타 장소 정보 불러오기 (선택사항)
async function loadData2() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("/place", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "데이터 불러옴 실패");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }
}

// ✅ 페이지 로드시 데이터 불러오기
window.onload = function () {
  loadData();
  loadData2();
};
