document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".toggle-btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const device = button.dataset.device;
      const isOn = button.classList.contains("on");
      const newState = !isOn ? "ON" : "OFF";

      // Toggle button appearance
      button.classList.toggle("on");
      button.textContent = newState === "ON" ? "Turn Off" : "Turn On";

      // ✅ Send update to Firebase
      fetch("https://smart-irrigation-fbefa-default-rtdb.firebaseio.com/actuators.json", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          [device]: newState
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(`${device} state updated to ${newState}`, data);
      })
      .catch(err => {
        console.error("Firebase update failed:", err);
      });
      // ✅ Send update to Firebase
      const bodyData = device === "pump"
      ? { pump: newState, mode: "manual" }
      : { [device]: newState };
  
    fetch("https://smart-irrigation-fbefa-default-rtdb.firebaseio.com/actuators.json", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    })
    .then(res => res.json())
    .then(data => {
      console.log(`${device} state updated to ${newState}`, data);
    })
    .catch(err => {
      console.error("Firebase update failed:", err);
    });
  });
  });
  const modeToggleBtn = document.getElementById("modeToggleBtn");
let currentMode = "auto"; // Default mode

modeToggleBtn.addEventListener("click", () => {
  currentMode = currentMode === "auto" ? "manual" : "auto";

  fetch("https://smart-irrigation-fbefa-default-rtdb.firebaseio.com/actuators.json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mode: currentMode })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Mode changed to:", currentMode);
    modeToggleBtn.textContent = currentMode === "auto"
      ? "Switch to Manual Mode"
      : "Switch to Auto Mode";
  })
  .catch(err => {
    console.error("Failed to update mode:", err);
  });
});


  // 🔐 User Info Section
  const profileSection = document.getElementById("profileSection");
  const isLoggedIn = localStorage.getItem("smartIrrigationLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("smartIrrigationCurrentUser"));

  if (isLoggedIn && user) {
    profileSection.innerHTML = `
       <a href="notifications.html" class="notification" title="Notifications">
  <i class="fa-solid fa-bell"></i>
  <span class="dot"></span>
</a>
      <div class="user-profile-container">
        <div class="user-profile" id="profileBtn">
          <i class="fa-solid fa-user"></i>
          <span>${user.name}</span>
          <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="profile-dropdown" id="profileDropdown">
          <a href="#">Settings</a>
          <button id="toggleDarkMode">Toggle Dark Mode</button>
          <button id="logoutBtn">Logout</button>
        </div>
      </div>
    `;

    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    profileBtn.addEventListener('click', () => {
      profileDropdown.style.display = profileDropdown.style.display === 'flex' ? 'none' : 'flex';
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('smartIrrigationLoggedIn');
      localStorage.removeItem('smartIrrigationCurrentUser');
      window.location.href = 'signin.html';
    });

    document.getElementById('toggleDarkMode').addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    window.addEventListener('click', function (e) {
      if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.style.display = 'none';
      }
    });
  }

  // Restore dark mode if previously set
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
});
