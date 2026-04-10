let products = [
  {
    id: "P001",
    name: "Tomatoes",
    category: "Vegetables",
    vendor: "Diddly Farm",
    price: 3.20,
    stock: 5,
    tempStock: 5
  },
  {
    id: "P002",
    name: "Fresh Basil",
    category: "Herbs",
    vendor: "Diddly Farm",
    price: 2.50,
    stock: 3,
    tempStock: 3
  },
  {
    id: "P003",
    name: "Raw Honey",
    category: "Honey",
    vendor: "Farmer's Market",
    price: 9.00,
    stock: 20,
    tempStock: 20
  },
  {
    id: "P004",
    name: "Carrots",
    category: "Vegetables",
    vendor: "Tony's Family Farm",
    price: 4.00,
    stock: 7,
    tempStock: 7
  },
  {
    id: "P005",
    name: "Lettuce",
    category: "Vegetables",
    vendor: "Dina's Garden",
    price: 3.80,
    stock: 15,
    tempStock: 15
  }
];

const productTableBody = document.getElementById("productTableBody");
const searchProductName = document.getElementById("searchProductName");
const topProductSearchInput = document.getElementById("topProductSearchInput");
const productCategoryFilter = document.getElementById("productCategoryFilter");
const productStockFilter = document.getElementById("productStockFilter");
const openAddProductBtn = document.getElementById("openAddProductBtn");
const addProductCard = document.getElementById("addProductCard");
const addProductForm = document.getElementById("addProductForm");

function getProductStatus(stock) {
  return stock <= 7 ? "Low Stock" : "Available";
}

function getProductStatusClass(stock) {
  return stock <= 7 ? "low-stock" : "available";
}

function renderProducts() {
  const searchValue = searchProductName.value.toLowerCase().trim();
  const topSearchValue = topProductSearchInput.value.toLowerCase().trim();
  const selectedCategory = productCategoryFilter.value;
  const selectedStock = productStockFilter.value;

  const filteredProducts = products.filter(function (product) {
    const matchesSearchName =
      searchValue === "" ||
      product.name.toLowerCase().includes(searchValue) ||
      product.vendor.toLowerCase().includes(searchValue);

    const matchesTopSearch =
      topSearchValue === "" ||
      product.name.toLowerCase().includes(topSearchValue) ||
      product.vendor.toLowerCase().includes(topSearchValue) ||
      product.category.toLowerCase().includes(topSearchValue);

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const productStatus = getProductStatus(product.tempStock);
    const matchesStock =
      selectedStock === "All" || productStatus === selectedStock;

    return matchesSearchName && matchesTopSearch && matchesCategory && matchesStock;
  });

  productTableBody.innerHTML = "";

  filteredProducts.forEach(function (product) {
    productTableBody.innerHTML += `
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.vendor}</td>
        <td>$${Number(product.price).toFixed(2)}</td>

        <!-- STOCK COLUMN -->
        <td>
          <div class="stock-control">
            <button class="stock-btn" onclick="changeTempStock('${product.id}', -1)">-</button>
            <span class="stock-number">${product.tempStock}</span>
            <button class="stock-btn" onclick="changeTempStock('${product.id}', 1)">+</button>
          </div>
        </td>

        <!-- STATUS -->
        <td>
          <span class="status ${getProductStatusClass(product.tempStock)}">
            ${getProductStatus(product.tempStock)}
          </span>
        </td>

        <!-- ACTIONS -->
        <td>
          <button class="save-btn" onclick="saveStock('${product.id}')">Save</button>
          <button class="reject-btn" onclick="deleteProduct('${product.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function changeTempStock(productId, change) {
  const product = products.find(function (item) {
    return item.id === productId;
  });

  if (product) {
    product.tempStock = Number(product.tempStock) + change;

    if (product.tempStock < 0) {
      product.tempStock = 0;
    }

    renderProducts();
  }
}

function saveStock(productId) {
  const product = products.find(function (item) {
    return item.id === productId;
  });

  if (product) {
    product.stock = product.tempStock;
    alert("Stock saved successfully");
    renderProducts();
  }
}

function deleteProduct(productId) {
  products = products.filter(function (item) {
    return item.id !== productId;
  });
  renderProducts();
}

function generateProductId() {
  const nextNumber = products.length + 1;
  return "P" + String(nextNumber).padStart(3, "0");
}

openAddProductBtn.addEventListener("click", function () {
  addProductCard.style.display =
    addProductCard.style.display === "none" ? "block" : "none";
});

addProductForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const stockValue = Number(document.getElementById("productStock").value.trim());

  const newProduct = {
    id: generateProductId(),
    name: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value,
    vendor: document.getElementById("productVendor").value,
    price: document.getElementById("productPrice").value.trim(),
    stock: stockValue,
    tempStock: stockValue
  };

  products.push(newProduct);
  addProductForm.reset();
  addProductCard.style.display = "none";
  renderProducts();
});

searchProductName.addEventListener("input", renderProducts);
topProductSearchInput.addEventListener("input", renderProducts);
productCategoryFilter.addEventListener("change", renderProducts);
productStockFilter.addEventListener("change", renderProducts);

renderProducts();