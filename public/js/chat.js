async function loadData() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      //   localStorage.setItem("userid", userid);
    } else {
      alert(data.message || "데이터 불러옴 실패");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }
}

// localStorage.setItem("channel", channel);
window.onload = function () {
  loadData();
};
