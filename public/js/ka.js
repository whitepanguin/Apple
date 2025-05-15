const rangeInput = document.getElementById('pyeongRange');
const valueDisplay = document.getElementById('pyeongValue');

rangeInput.addEventListener('input', () => {
  valueDisplay.textContent = `${rangeInput.value}평이상`;
});

function applyFilter() {
  const selectedPyeong = rangeInput.value;
  const usePyeong = document.getElementById('usePyeong').checked;

  if (usePyeong) {
    alert(`선택된 평수: ${selectedPyeong}평`);
    // 여기에 필터링 로직 추가 하기
  }
}
