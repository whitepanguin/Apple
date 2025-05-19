// 위치 수신 성공 시 실행되는 함수
export function setLocation(position) {
  const { latitude, longitude } = position.coords;

  // HTML 요소 확인 후 값 설정
  const latElement = document.getElementById("latitude");
  const lonElement = document.getElementById("longitude");

  if (latElement && lonElement) {
    latElement.value = latitude;
    lonElement.value = longitude;
  } else {
    console.warn("❌ 위치 정보 입력 요소를 찾을 수 없음!");
  }

  // 사용자 위치를 화면에 표시
  const areaNameElement = document.getElementById("areaName");
  if (areaNameElement) {
    areaNameElement.textContent = `위도: ${latitude}, 경도: ${longitude}`;
  }
}

// 위치 수신 실패 시 실행되는 함수
export function showError(error) {
  const errorMessage = document.getElementById("location-error");
  let message;

  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "위치 정보 사용이 거부되었습니다.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "위치 정보를 사용할 수 없습니다.";
      break;
    case error.TIMEOUT:
      message = "위치 정보를 가져오는 데 시간이 초과되었습니다.";
      break;
    default:
      message = "알 수 없는 오류가 발생했습니다.";
  }

  console.warn("❌ 위치 오류:", message);

  if (errorMessage) {
    errorMessage.textContent = message;
  } else {
    alert(message);
  }
}

// 위치 정보 요청
export function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLocation, showError);
  } else {
    console.warn("❌ 이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    alert("기본 위치를 설정합니다.");
    setLocation({ coords: { latitude: 37.5665, longitude: 126.978 } }); // 서울 기본값
  }
}
