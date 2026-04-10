let defaultVendors = [
  {
    id: "V001",
    vendorName: "John Carter",
    farmName: "Diddly Farm",
    category: "Vegetables",
    location: "Melbourne",
    email: "diddly@farm.com",
    status: "Approved"
  },
  {
    id: "V002",
    vendorName: "Anthony Brown",
    farmName: "Tony's Family Farm",
    category: "Mixed Produce",
    location: "Geelong",
    email: "tony@familyfarm.com",
    status: "Pending"
  },
  {
    id: "V003",
    vendorName: "Sarah Lee",
    farmName: "Farmer's Market",
    category: "Fresh Produce",
    location: "Ballarat",
    email: "farmersmarket@market.com",
    status: "Approved"
  },
  {
    id: "V004",
    vendorName: "Dina Wilson",
    farmName: "Dina's Garden",
    category: "Organic Produce",
    location: "Melbourne",
    email: "dina@garden.com",
    status: "Approved"
  }
];

let vendors = JSON.parse(localStorage.getItem("vendors")) || defaultVendors;

const vendorTableBody = document.getElementById("vendorTableBody");
const pendingVendorTableBody = document.getElementById("pendingVendorTableBody");
const searchName = document.getElementById("searchName");
const topSearchInput = document.getElementById("topSearchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const openAddVendorBtn = document.getElementById("openAddVendorBtn");
const addVendorCard = document.getElementById("addVendorCard");
const addVendorForm = document.getElementById("addVendorForm");

function getStatusClass(status) {
  if (status === "Approved") return "approved";
  if (status === "Pending") return "pending";
  if (status === "Suspended") return "suspended";
  if (status === "Rejected") return "cancelled";
  return "";
}

function renderVendors() {
  const searchValue = searchName.value.toLowerCase().trim();
  const topSearchValue = topSearchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;

  const filteredVendors = vendors.filter(function (vendor) {
    const matchesSearchName =
      searchValue === "" ||
      vendor.vendorName.toLowerCase().includes(searchValue) ||
      vendor.farmName.toLowerCase().includes(searchValue) ||
      vendor.email.toLowerCase().includes(searchValue);

    const matchesTopSearch =
      topSearchValue === "" ||
      vendor.vendorName.toLowerCase().includes(topSearchValue) ||
      vendor.farmName.toLowerCase().includes(topSearchValue) ||
      vendor.email.toLowerCase().includes(topSearchValue) ||
      vendor.location.toLowerCase().includes(topSearchValue) ||
      vendor.category.toLowerCase().includes(topSearchValue);

    const matchesCategory =
      selectedCategory === "All" || vendor.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" || vendor.status === selectedStatus;

    return matchesSearchName && matchesTopSearch && matchesCategory && matchesStatus;
  });

  vendorTableBody.innerHTML = "";

  filteredVendors.forEach(function (vendor) {
    vendorTableBody.innerHTML += `
      <tr>
        <td>${vendor.id}</td>
        <td>${vendor.vendorName}</td>
        <td>${vendor.farmName}</td>
        <td>${vendor.category}</td>
        <td>${vendor.location}</td>
        <td>${vendor.email}</td>
        <td><span class="status ${getStatusClass(vendor.status)}">${vendor.status}</span></td>
        <td>
          <select id="vendor-${vendor.id}" class="vendor-status-dropdown">
            <option value="Approved" ${vendor.status === "Approved" ? "selected" : ""}>Approved</option>
            <option value="Pending" ${vendor.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Suspended" ${vendor.status === "Suspended" ? "selected" : ""}>Suspended</option>
            <option value="Rejected" ${vendor.status === "Rejected" ? "selected" : ""}>Rejected</option>
          </select>
          <button class="approve-btn" onclick="updateVendorStatus('${vendor.id}')">Update</button>
        </td>
      </tr>
    `;
  });

  renderPendingVendors();
}

function renderPendingVendors() {
  pendingVendorTableBody.innerHTML = "";

  const pendingVendors = vendors.filter(function (vendor) {
    return vendor.status === "Pending";
  });

  pendingVendors.forEach(function (vendor) {
    pendingVendorTableBody.innerHTML += `
      <tr>
        <td>${vendor.id}</td>
        <td>${vendor.vendorName}</td>
        <td>${vendor.farmName}</td>
        <td>${vendor.category}</td>
        <td>${vendor.location}</td>
        <td>${vendor.email}</td>
        <td><span class="status pending">${vendor.status}</span></td>
      </tr>
    `;
  });

  if (pendingVendors.length === 0) {
    pendingVendorTableBody.innerHTML = `
      <tr>
        <td colspan="7">No pending vendors</td>
      </tr>
    `;
  }
}

function updateVendorStatus(vendorId) {
  const vendor = vendors.find(function (item) {
    return item.id === vendorId;
  });

  if (vendor) {
    const newStatus = document.getElementById("vendor-" + vendorId).value;
    vendor.status = newStatus;

    localStorage.setItem("vendors", JSON.stringify(vendors));
    renderVendors();
    alert("Vendor updated successfully!");
  }
}

function generateVendorId() {
  const nextNumber = vendors.length + 1;
  return "V" + String(nextNumber).padStart(3, "0");
}

openAddVendorBtn.addEventListener("click", function () {
  if (addVendorCard.style.display === "none") {
    addVendorCard.style.display = "block";
  } else {
    addVendorCard.style.display = "none";
  }
});

addVendorForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newVendor = {
    id: generateVendorId(),
    vendorName: document.getElementById("vendorName").value.trim(),
    farmName: document.getElementById("farmName").value.trim(),
    category: document.getElementById("vendorCategory").value,
    location: document.getElementById("vendorLocation").value.trim(),
    email: document.getElementById("vendorEmail").value.trim(),
    status: document.getElementById("vendorStatus").value
  };

  vendors.push(newVendor);
  localStorage.setItem("vendors", JSON.stringify(vendors));

  addVendorForm.reset();
  addVendorCard.style.display = "none";
  renderVendors();
});

searchName.addEventListener("input", renderVendors);
topSearchInput.addEventListener("input", renderVendors);
categoryFilter.addEventListener("change", renderVendors);
statusFilter.addEventListener("change", renderVendors);

renderVendors();