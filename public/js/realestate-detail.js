// 전역 변수 선언
let realestateData = null;

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const realestateId = urlParams.get("id");

  if (!realestateId) {
    alert("매물 ID가 없습니다.");
    return;
  }

  try {
    // 매물 정보 조회
    const response = await fetch(`/real/${realestateId}`);
    if (!response.ok) throw new Error("서버 응답 오류");

    const data = await response.json();
    realestateData = data;
    console.log("realestate 데이터:", data);

    // 로그인한 사용자 확인 후 수정/삭제 버튼 표시
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    fetch("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        if (user.userid === data.userid) {
          document.getElementById("edit-post").style.display = "inline-block";
          document.getElementById("delete-post").style.display = "inline-block";
        }
      })
      .catch((err) => {
        console.error("작성자 확인 실패:", err);
      });

    // 화면 렌더링
    renderRealestateDetail(data);
  } catch (error) {
    console.error("매물 정보 불러오기 실패:", error);
    alert("매물 정보를 불러오는 데 실패했습니다.");
  }
});

// 매물 정보 화면 출력 함수
function renderRealestateDetail(data) {
  // 텍스트 정보 출력
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
  document.getElementById("realestate-dealing").textContent = data.price || "";

  // 가격 정보 표시
  const priceText =
    data.price === "월세"
      ? `${data.deposit || 0} / ${data.monthly_rent || 0}`
      : data.price === "전세"
      ? `${data.deposit || 0}`
      : `${data.sale}`;
  const div = document.createElement("div");
  div.innerHTML = `<strong>가격:</strong> <span id="realestate-price">${priceText}</span>`;
  document.getElementsByClassName("price2")[0].appendChild(div);

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
  detailSection.innerHTML = Array.isArray(data.details)
    ? data.details.map((line) => `${line}<br>`).join("")
    : data.text?.replace(/\n/g, "<br>") || "-";

  // 판매자 정보 표시
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
        console.error("판매자 정보 불러오기 실패:", err);
        document.getElementById("seller-meta").textContent =
          "주소 정보 없음 · 매너온도 N/A";
      });
  }

  // 수정 버튼 클릭 시 모달 열기
  const editBtn = document.getElementById("edit-post");
  const modal = document.getElementById("edit-modal");
  const cancelBtn = document.getElementById("cancel-edit");
  const submitBtn = document.getElementById("submit-edit");

  editBtn?.addEventListener("click", () => {
    document.getElementById("edit-price-type").value = data.price;
    document.getElementById("edit-sale").value = data.sale || "";
    document.getElementById("edit-deposit").value = data.deposit || "";
    document.getElementById("edit-monthly_rent").value =
      data.monthly_rent || "";
    document.getElementById("edit-text").value = Array.isArray(data.details)
      ? data.details.join("\n")
      : data.text || "";

    modal.classList.remove("hidden");
  });

  // 모달 닫기
  cancelBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // 수정 제출 처리
  submitBtn?.addEventListener("click", async () => {
    const priceType = document.getElementById("edit-price-type").value;
    const updateData = {
      price: priceType,
      sale:
        priceType === "매매"
          ? document.getElementById("edit-sale").value
          : null,
      deposit:
        priceType === "전세" || priceType === "월세"
          ? document.getElementById("edit-deposit").value
          : null,
      monthly_rent:
        priceType === "월세"
          ? document.getElementById("edit-monthly_rent").value
          : null,
      details: document
        .getElementById("edit-text")
        .value.split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== ""),
    };

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`/real/${realestateData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("수정 실패");
      alert("수정 완료!");
      location.reload();
    } catch (err) {
      console.error("수정 중 오류:", err);
      alert("수정 중 오류 발생");
    }
  });

  // 지도 표시
  fetch("/place")
    .then((res) => res.json())
    .then((places) => {
      const matchedPlace = places.find((p) => p.userid === data.userid);
      if (
        matchedPlace &&
        window.kakao &&
        window.kakao.maps &&
        kakao.maps.load
      ) {
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
        console.warn("사용자 위치 정보 없음 또는 kakao 지도 로드 실패");
      }
    })
    .catch((err) => {
      console.error("위치 정보 불러오기 실패:", err);
    });
}

// 삭제 버튼 클릭 처리
const deleteBtn = document.getElementById("delete-post");

deleteBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const confirmed = confirm("정말 삭제하시겠습니까?");
  if (!confirmed) return;

  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const response = await fetch(`/real/${realestateData._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      alert("삭제가 완료되었습니다.");
      window.location.href = "./realestate.html";
    } else if (response.status === 403) {
      alert("본인 매물만 삭제할 수 있습니다.");
    } else if (response.status === 404) {
      alert("매물이 존재하지 않습니다.");
    } else {
      throw new Error("알 수 없는 오류 발생");
    }
  } catch (err) {
    console.error("삭제 중 오류:", err);
    alert("삭제 중 오류가 발생했습니다.");
  }
});
