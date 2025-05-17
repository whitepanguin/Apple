document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const realestateId = urlParams.get("id");

  if (!realestateId) {
    alert("매물 ID가 없습니다.");
    return;
  }

  try {
    const response = await fetch(`/real/${realestateId}`);
    if (!response.ok) throw new Error("서버 응답 오류");

    const data = await response.json();
    renderRealestateDetail(data);
  } catch (error) {
    console.error("매물 정보 불러오기 실패:", error);
    alert("매물 정보를 불러오는 데 실패했습니다.");
  }
});

function renderRealestateDetail(data) {
  // 기본 정보
  document.getElementById("breadcrumb-title").textContent = data.apartment;
  document.getElementById("post-image").src = "img/4.jpg"; // 서버 이미지 연동 시 수정
  document.getElementById("seller-name").textContent = "일산짱"; // 추후 사용자 연결
  document.getElementById("seller-meta").textContent = "서초4동";

  document.getElementById("realestate-type").textContent = data.apartment;
  document.getElementById("realestate-createdAt").textContent =
    data.sale_date || "-";
  document.getElementById("realestate-status").textContent =
    data.sales_status || "-";

  // 요약 정보
  document.getElementById("realestate-supply").textContent =
    data.supply_area || "-";
  document.getElementById("realestate-extend").textContent =
    data.exclusive_area || "-";
  document.getElementById("realestate-roomcount").textContent =
    data.number_of_rooms || "-";
  document.getElementById("realestate-floor").textContent = data.floor || "-";
  document.getElementById("realestate-maintenance").textContent =
    data.maintenance_fee || "-";
  document.getElementById("realestate-approved").textContent =
    data.approved_date || "-";
  document.getElementById("realestate-dealing").textContent = data.price || "-";
  document.getElementById("realestate-price").textContent = data.sale || "-";

  // 조건 (대출/반려동물/주차/엘리베이터)
  const conditionList = [];
  if (data.condition?.loan_available) conditionList.push("대출 가능");
  if (data.condition?.pet_allowed) conditionList.push("반려동물 가능");
  if (data.condition?.parking) conditionList.push("주차 가능");
  if (data.condition?.elevator) conditionList.push("엘리베이터 있음");

  document.getElementById("realestate-condition").textContent =
    conditionList.length > 0 ? conditionList.join(", ") : "-";

  // 내부 시설
  document.getElementById("realestate-facilities").textContent =
    data.internal_facilities || "-";

  // 상세 설명
  const detailSection = document.getElementById("realestate-description");
  if (Array.isArray(data.details)) {
    detailSection.innerHTML = data.details
      .map((line) => `${line}<br>`)
      .join("");
  } else {
    detailSection.textContent = "-";
  }
}
