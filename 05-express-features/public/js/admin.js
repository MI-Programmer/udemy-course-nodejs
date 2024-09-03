const deleteProduct = async (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  try {
    const res = await fetch(`/admin/products/${productId}`, {
      method: "DELETE",
      headers: { "csrf-token": csrf },
    });
    const data = await res.json();
    console.log(data);
    productElement.parentNode.removeChild(productElement);
  } catch (err) {
    console.log(err);
  }
};
