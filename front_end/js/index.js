async function update() {
  const product_name = document.getElementById("product_name").value;
  const quantity_available =
    document.getElementById("quantity_available").value;
  const cost = document.getElementById("cost").value;
  try {
    const response = await fetch("http://localhost:3000/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_name, quantity_available, cost }),
    });

    const status = response.status;

    const data = await response.json();

    if (status === 200 || status === 201) {
      alert(
        `Updated: ${product_name} Quantity: ${quantity_available} Cost: ${cost}`
      );
    } else {
      alert(`Failed to updated. ${data.message || "Something went wrong."}`);
    }
  } catch (error) {
    console.error("Error during updated:", error);
    alert(`Failed to updated data: ${error.message}`);
  }
}

async function upLoad() {
  const product_name = document.getElementById("product_name").value;
  const quantity_available =
    document.getElementById("quantity_available").value;
  const cost = document.getElementById("cost").value;
  try {
    const response = await fetch("http://localhost:3000/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_name, quantity_available, cost }),
    });

    const status = response.status;

    const data = await response.json();

    if (status === 200 || status === 201) {
      alert(
        `Uploaded: ${product_name} Quantity: ${quantity_available} Cost: ${cost}`
      );
    } else {
      alert(`Failed to upload. ${data.message || "Something went wrong."}`);
    }
  } catch (error) {
    console.error("Error during upload:", data);
    alert(`Failed to upload data: ${error.message}`);
  }
}

async function getProduct() {
  const product_name = "Roids";

  try {
    const response = await fetch(`http://localhost:3000/data/${product_name}`);

    const data = await response.json();
    const data_dict = data[0];
    const quantity = data_dict.quantity_available;
    document.getElementById("product_name").value = product_name;
    document.getElementById("quantity_available").value = quantity;
  } catch (error) {
    console.log(error);
  }
}

window.onload = getProduct;
