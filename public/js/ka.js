const rangeInput = document.getElementById("pyeongRange");
const valueDisplay = document.getElementById("pyeongValue");

rangeInput.addEventListener("input", () => {
  valueDisplay.textContent = `${rangeInput.value}평이상`;
});

function applyFilter() {
  const selectedPyeong = rangeInput.value;
  const usePyeong = document.getElementById("usePyeong").checked;

  if (usePyeong) {
    alert(`선택된 평수: ${selectedPyeong}평`);
    // 여기에 필터링 로직 추가 하기
  }
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
      console.log(data);
    } else {
      alert(data.message || "데이터 불러옴 실패");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }
}

window.onload = function () {
  loadData();
};
