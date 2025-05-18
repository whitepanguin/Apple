document.addEventListener("DOMContentLoaded", () => {
  const applyBtn = document.getElementById("applyBtn");
  if (applyBtn) {
    applyBtn.addEventListener("click", applyFilter);
  }
});

function applyFilter() {
  const selectedRoomTypes = getCheckedValues("room-type");
  const selectedDealTypes = getCheckedValues("deal-type");
  const selectedFloors = getUncheckedNameValues("층수");
  const selectedOptions = getUncheckedNameValues("옵션");

  const properties = document.querySelectorAll(".property");

  properties.forEach((property) => {
    const infoText = property.innerText;
    let show = true;

    // 매물 종류
    if (selectedRoomTypes.length > 0 && !selectedRoomTypes.some(type => infoText.includes(type))) {
      show = false;
    }

    // 거래 유형
    if (selectedDealTypes.length > 0 && !selectedDealTypes.some(type => infoText.includes(type))) {
      show = false;
    }

    // 층수 필터
    if (selectedFloors.length > 0) {
      const floorMatch = selectedFloors.some(floor => {
        if (floor === "1층") {
          return infoText.includes("1층");
        }
        if (floor === "2~5층") {
          return ["2층", "3층", "4층", "5층"].some(f => infoText.includes(f));
        }
        if (floor === "6~9층") {
          return ["6층", "7층", "8층", "9층"].some(f => infoText.includes(f));
        }
        if (floor === "10층 이상") {
          return /1[0-9]층|[2-9][0-9]층/.test(infoText); // 10층 이상 정규표현식
        }
        return false;
      });
      if (!floorMatch) show = false;
    }

    // 옵션 필터는 아직 필터링 안 하지만 콘솔 출력
    if (selectedOptions.length > 0) {
      console.log("선택된 옵션:", selectedOptions);
    }

    property.style.display = show ? "block" : "none";
  });
}

function applyMobileFilter() {
  applyFilter();
  toggleFilter();
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(el => el.value);
}

function getUncheckedNameValues(sectionLabelText) {
  const group = Array.from(document.querySelectorAll(".filter-group")).find(group =>
    group.innerText.includes(sectionLabelText)
  );
  if (!group) return [];

  const inputs = group.querySelectorAll("input[type='checkbox']:checked");
  return Array.from(inputs).map(input => {
    const label = input.closest("label");
    return label ? label.innerText.trim() : "";
  });
}

function toggleFilter() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("show");

  if (sidebar.classList.contains("show")) {
    document.body.classList.add("sidebar-open");
  } else {
    document.body.classList.remove("sidebar-open");
  }
}