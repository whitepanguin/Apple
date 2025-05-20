document.addEventListener("DOMContentLoaded", () => {
  const rangeInput = document.getElementById("pyeongRange");
  const valueDisplay = document.getElementById("pyeongValue");
  const usePyeong = document.getElementById("usePyeong");
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');

  if (rangeInput) {
    valueDisplay.textContent = `${rangeInput.value}평이상`;
    rangeInput.addEventListener("input", () => {
      valueDisplay.textContent = `${rangeInput.value}평이상`;
      runFilter();
    });
  }

  if (usePyeong) {
    usePyeong.addEventListener("change", runFilter);
  }

  allCheckboxes.forEach((cb) => {
    cb.addEventListener("change", runFilter);
  });
});

function runFilter() {
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

    // 층수 필터
    if (selectedFloors.length > 0) {
      const floorMatch = selectedFloors.some((floor) => {
        if (floor === "1층") {
          return /\b1\s*층\b/.test(infoText);
        }
        if (floor === "2~5층") {
          return /(^|\s)(2층|3층|4층|5층)($|\s)/.test(infoText);
        }
        if (floor === "6~9층") {
          return /\b(6|7|8|9)\s*층\b/.test(infoText);
        }
        if (floor === "10층 이상") {
          return /\b(1[0-9]|[2-9][0-9])\s*층\b/.test(infoText);
        }
        return false;
      });
      if (!floorMatch) show = false;
    }

    // 평수 필터
    if (usePyeong) {
      const match = infoText.match(/([\d.]+)\s*평/);
      const pyeongNum = match ? parseFloat(match[1]) : 0;
      if (pyeongNum < selectedPyeong) {
        show = false;
      }
    }

    // 옵션 필터
    if (selectedOptions.length > 0) {
      const optionMatch = selectedOptions.every((option) =>
        infoText.includes(option)
      );
      if (!optionMatch) show = false;
    }

    property.style.display = show ? "block" : "none";
  });
}

function getCheckedValues(name) {
  return Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`)
  ).map((el) => el.value);
}

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
    const priceText =
      item.price === "월세"
        ? `${item.deposit || 0} / ${item.monthly_rent || 0}`
        : item.price === "전세"
        ? `${item.deposit || 0}`
        : `${item.sale}`;

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
    } else {
      alert(data.message || "데이터 불러옴 실패");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }
}

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

window.onload = function () {
  loadData();
  loadData2();
};
