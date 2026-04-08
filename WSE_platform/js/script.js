
// Register

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const user = {
      name: document.getElementById("regName").value,
      email: document.getElementById("regEmail").value,
      phone: document.getElementById("regPhone").value,
      password: document.getElementById("regPassword").value,
      address: ""
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Registered Successfully");
    window.location.href = "index.html";
  });
}

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));

      alert("✅ Login successful");

      if (email === "admin@mail.com") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }

    } else {
      alert("❌ Invalid credentials");
    }
  });
}
function confirmLogout() {
    const choice = confirm("Are you sure you want to logout?");

    if (choice) {
        // clear user data if needed
        localStorage.removeItem("currentUser");

        // redirect
        window.location.href = "index.html";
    }
}

// SOS button
document.getElementById("sosBtn")?.addEventListener("click", function () {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            document.getElementById("status").innerText =
                "SOS Sent! Location: " + lat + ", " + lon;

            alert("Emergency Alert Sent!");
        });
    } else {
        alert("Geolocation not supported");
    }
});

// Load alerts when page opens
document.addEventListener("DOMContentLoaded", displayAlerts);

// Add alert
function addAlertToHistory(location) {
    let alerts = JSON.parse(localStorage.getItem("alerts")) || [];

    const newAlert = {
        location: location,
        time: new Date().toLocaleString()
    };

    alerts.unshift(newAlert);

    localStorage.setItem("alerts", JSON.stringify(alerts));

    displayAlerts();
}


// SOS button
function goToSOS() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const location = `Lat: ${lat}, Lng: ${lon}`;

                alert("SOS Sent with Live Location!");

                addAlertToHistory(location);
            },

            () => {
                alert("Location access denied!");
            }
        );

    } else {
        alert("Geolocation not supported!");
    }
}

// Clear history
function clearHistory() {
    localStorage.removeItem("alerts");
    displayAlerts();
}


// dashboard- Alert response
function acceptAlert() {
    let card = document.querySelector(".alert-card");

    card.innerHTML = `
    <p>Status: 🚑 On the way</p>
    <p>Responder assigned</p>
  `;
}

function declineAlert() {
    let card = document.querySelector(".alert-card");

    card.innerHTML = `
    <p>Status: ❌ Declined</p>
    <p>Searching for another volunteer...</p>
  `;
}


// profile edit state
let isEditing = false;


// Load user data when page opens
document.addEventListener("DOMContentLoaded", function () {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    //  Run ONLY on profile page
    if (document.getElementById("name")) {

        if (!currentUser) {
            window.location.href = "index.html";
            return;
        }

        document.getElementById("name").value = currentUser.name || "";
        document.getElementById("email").value = currentUser.email || "";
        document.getElementById("phone").value = currentUser.phone || "";
        document.getElementById("address").value = currentUser.address || "";

        if (currentUser.image) {
            document.getElementById("profilePic").src = currentUser.image;
        }
    }

    displayAlerts();
});

// Toggle Edit / Save
function toggleEdit() {
    const inputs = document.querySelectorAll(".field input");
    const btn = document.getElementById("editBtn");

    if (!isEditing) {
        // Enable editing
        inputs.forEach(i => i.disabled = false);
        btn.innerText = "Save";
        isEditing = true;

    } else {
        // Save data

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        const updatedUser = {
            ...currentUser,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            image: document.getElementById("profilePic").src
        };

        // update current user
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        // update users list
        const updatedUsers = users.map(u =>
            u.email === currentUser.email ? updatedUser : u
        );

        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Disable editing again
        inputs.forEach(i => i.disabled = true);
        btn.innerText = "Edit";
        isEditing = false;

        alert("✅ Profile Saved!");
    }
}


// Image upload
const imageInput = document.getElementById("imageUpload");

if (imageInput) {
    imageInput.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function () {
                document.getElementById("profilePic").src = reader.result;
            };

            reader.readAsDataURL(file);
        }
    });
}

function displayAlerts() {
    const historyList = document.getElementById("history");
    const alerts = JSON.parse(localStorage.getItem("alerts")) || [];

    historyList.innerHTML = "";

    if (alerts.length === 0) {
        historyList.innerHTML = '<li class="empty">No alerts yet</li>';
        return;
    }

    alerts.forEach(alert => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>🚨 SOS Triggered</strong><br>
            📍 Location: ${alert.location}<br>
            🕒 Time: ${alert.time}
        `;
        historyList.appendChild(li);
    });
}


// admin table

const tableBody = document.getElementById("userTableBody");

if (tableBody) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  tableBody.innerHTML = "";

  users.forEach(user => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
    `;

    tableBody.appendChild(row);
  });
}

// scroll
// Fade-in on scroll
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("section-show");
        }
    });
}, {
    threshold: 0.15
});

sections.forEach((section) => {
    observer.observe(section);
});

const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("nav-menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
});