card.addEventListener("click", () => {
  localStorage.setItem("selectedProduct", JSON.stringify(item));
  window.location.href = "product.html";
});
