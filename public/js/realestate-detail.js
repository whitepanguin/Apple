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
  document.getElementById("realestate-dealing").textContent = data.price || "";
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
    // 7. 수정/삭제 버튼 제어 및 이벤트 등록
    const currentUser =
      localStorage.getItem("userid") || sessionStorage.getItem("userid");

    if (currentUser === data.userid) {
      document.getElementById("edit-post").style.display = "inline-block";
      document.getElementById("delete-post").style.display = "inline-block";
    }
  }

  // 8. 수정 기능: 모달 열기, 기존값 채우기
  const editBtn = document.getElementById("edit-post");
  const modal = document.getElementById("edit-modal");
  const cancelBtn = document.getElementById("cancel-edit");
  const submitBtn = document.getElementById("submit-edit");

  editBtn?.addEventListener("click", () => {
    const priceType = data.price;

    document.getElementById("edit-price-type").value = priceType;
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

  // 9. 수정 완료 시 PATCH 요청
  submitBtn?.addEventListener("click", async () => {
    const priceType = document.getElementById("edit-price-type").value;
    const sale = document.getElementById("edit-sale").value;
    const deposit = document.getElementById("edit-deposit").value;
    const monthly = document.getElementById("edit-monthly_rent").value;
    const text = document.getElementById("edit-text").value;

    const updateData = {
      price: priceType,
      sale: priceType === "매매" ? sale : null,
      deposit: priceType === "전세" || priceType === "월세" ? deposit : null,
      monthly_rent: priceType === "월세" ? monthly : null,
      details: text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== ""),
    };

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`/real/${data._id}`, {
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
      console.error("❌ 수정 중 에러:", err);
      alert("수정 중 오류 발생");
    }
  });
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
// 7. 수정/삭제 버튼 제어
const currentUser =
  localStorage.getItem("userid") || sessionStorage.getItem("userid");

if (currentUser === data.userid) {
  document.getElementById("edit-post").style.display = "inline-block";
  document.getElementById("delete-post").style.display = "inline-block";
}

// 8. 수정 기능: 모달 열기, 닫기, PATCH 요청
const editBtn = document.getElementById("edit-post");
const modal = document.getElementById("edit-modal");
const cancelBtn = document.getElementById("cancel-edit");
const submitBtn = document.getElementById("submit-edit");

editBtn?.addEventListener("click", () => {
  document.getElementById("edit-price").value = data.sale || data.price || "";
  document.getElementById("edit-text").value = data.text || "";
  modal.classList.remove("hidden");
});

cancelBtn?.addEventListener("click", () => {
  modal.classList.add("hidden");
});

submitBtn?.addEventListener("click", async () => {
  const updateData = {
    sale: document.getElementById("edit-price").value,
    text: document.getElementById("edit-text").value,
  };

  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const response = await fetch(`/real/${data._id}`, {
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
    console.error("❌ 수정 중 에러:", err);
    alert("수정 중 오류 발생");
  }
});

// 9. 삭제 기능: 삭제 버튼 클릭 시 삭제 요청
const deleteBtn = document.getElementById("delete-post");

deleteBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const confirmed = confirm("정말 삭제하시겠습니까?");
  if (!confirmed) return;

  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const response = await fetch(`/real/${data._id}`, {
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
    console.error("❌ 삭제 중 오류:", err);
    alert("삭제 중 오류가 발생했습니다.");
  }
});
