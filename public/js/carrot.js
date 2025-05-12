const products = [
  {
    title: "아이폰 13 미개봉",
    price: "850,000원",
    location: "역삼동 · 10분 전",
    imageUrl:
      "https://media.bunjang.co.kr/product/245646024_1_1702092807_w360.jpg",
  },
  {
    title: "삼성 갤럭시 버즈",
    price: "55,000원",
    location: "강남구 · 5분 전",
    imageUrl:
      "https://images.samsung.com/kdp/goods/2024/07/07/aa3e0609-b894-432f-87ea-d111bb690138.png?$944_550_PNG$",
  },
  {
    title: "닌텐도 스위치 OLED",
    price: "300,000원",
    location: "서초동 · 1시간 전",
    imageUrl:
      "https://media.bunjang.co.kr/product/250328865_1_1705764601_w360.jpg",
  },
  {
    title: "아이패드 미니 6세대",
    price: "600,000원",
    location: "논현동 · 2시간 전",
    imageUrl:
      "https://cdn.bizwatch.co.kr/news/photo/2021/11/23/9972605d25a92ba1c89769d60cc83f82.jpg",
  },
];

const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");

// 상품 렌더링 함수
function renderProducts(data) {
  productList.innerHTML = ""; // 기존 목록 초기화
  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}" />
      <h2 class="product-title">${item.title}</h2>
      <p class="product-price">${item.price}</p>
      <p class="product-location">${item.location}</p>
    `;
    productList.appendChild(card);
  });
}

// 초기 렌더링
renderProducts(products);

// 검색 기능
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = products.filter((item) =>
    item.title.toLowerCase().includes(keyword)
  );
  renderProducts(filtered);
});
