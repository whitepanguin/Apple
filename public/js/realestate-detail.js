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
    console.log("✅ realestate 데이터:", data);
    renderRealestateDetail(data);
  } catch (error) {
    console.error("매물 정보 불러오기 실패:", error);
    alert("매물 정보를 불러오는 데 실패했습니다.");
  }
});

function renderRealestateDetail(data) {
  // 기본 정보 출력
  document.getElementById("breadcrumb-title").textContent = data.apartment;
  document.getElementById("post-image").src = data.img
    ? `/uploads/${data.img}`
    : "/img/2.jpg";
  document.getElementById("realestate-type").textContent = data.apartment;
  document.getElementById("realestate-createdAt").textContent =
    data.sale_date || "-";
  document.getElementById("realestate-status").textContent =
    data.sales_status || "-";
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
  // document.getElementById("realestate-dealing").textContent = data.price || "";
  // document.getElementById("realestate-price").textContent = data.sale || "";

  const pricetag = document.getElementsByClassName("price2")[0];

  const priceText =
    data.price === "월세"
      ? `${data.deposit || 0} / ${data.monthly_rent || 0}`
      : data.price === "전세"
      ? `${data.deposit || 0}`
      : `${data.sale}`;

  const div = document.createElement("div");
  div.innerHTML = `<strong>가격:</strong> <span id="realestate-price">${priceText}</span>`;
  pricetag.appendChild(div);

  // 조건 출력
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
    detailSection.innerHTML = data.text?.replace(/\n/g, "<br>") || "-";
  }

  // 판매자 정보
  if (data.userid) {
    fetch(`/api/${data.userid}`)
      .then((res) => {
        if (!res.ok) throw new Error("판매자 정보 없음");
        return res.json();
      })
      .then((user) => {
        document.getElementById("seller-name").textContent = user.userid;
        document.getElementById("seller-meta").textContent = `${
          user.address
        } · 매너온도 ${user.temp.toFixed(1)}°`;
        document.getElementById("seller-image").src =
          user.profilepic || "img/profile.png";
      })
      .catch((err) => {
        console.error("❌ 판매자 정보 불러오기 실패:", err);
        document.getElementById("seller-meta").textContent =
          "주소 정보 없음 · 매너온도 N/A";
      });
  }

  // 위치 정보 로드
  fetch("/place")
    .then((res) => res.json())
    .then((places) => {
      console.log("✅ 전체 place:", places);
      console.log("🔍 매물의 userid:", data.userid);

      const matchedPlace = places.find((p) => p.userid === data.userid);
      if (matchedPlace) {
        console.log("✅ 해당 사용자 위치:", matchedPlace);

        // 지도가 정상 로드되었을 때만 실행
        if (window.kakao && window.kakao.maps && kakao.maps.load) {
          kakao.maps.load(() => {
            const mapContainer = document.getElementById("map");
            const mapOption = {
              center: new kakao.maps.LatLng(
                matchedPlace.Latitude,
                matchedPlace.Longitude
              ),
              level: 3,
            };

            const map = new kakao.maps.Map(mapContainer, mapOption);
            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(
                matchedPlace.Latitude,
                matchedPlace.Longitude
              ),
            });
            marker.setMap(map);
          });
        } else {
          console.error("❌ kakao.maps가 로드되지 않았습니다.");
        }
      } else {
        console.warn("⚠️ 해당 사용자 위치 정보 없음");
      }
    })
    .catch((err) => {
      console.error("❌ 위치 정보 불러오기 실패:", err);
    });
}
