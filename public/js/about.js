document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".toggle-btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const device = button.dataset.device;
      const isOn = button.classList.contains("on");

      button.classList.toggle("on");
      button.textContent = isOn ? `Turn On` : `Turn Off`;

      // Firebase update mock (replace with actual logic)
      console.log(`${device} toggled to ${!isOn ? "ON" : "OFF"}`);
    });
  });

  // Add profile from localStorage if logged in
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
          <a href="profile.html">My Profile</a>
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

  // Restore theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const sensorDescriptions = {
    esp32: {
      title: "ESP32-WROOM-32D",
      desc: "The ESP32 is the core controller of our system. It features built-in Wi-Fi and Bluetooth, allowing for real-time sensor communication and remote monitoring of irrigation operations."
    },
    relay: {
      title: "Relay Module",
      desc: "This module allows the ESP32 to control high-power devices like pumps by safely isolating the control and power circuits."
    },
    dht22: {
      title: "DHT22 Sensor",
      desc: "The DHT22 measures ambient temperature and humidity with high precision. These readings help optimize irrigation based on weather conditions."
    },
    pump: {
      title: "DC Motor Pump",
      desc: "A low-voltage water pump automatically waters plants when the soil is dry, based on real-time soil moisture readings."
    },
    soil: {
      title: "Soil Moisture Sensor",
      desc: "This sensor monitors the water level in the soil to ensure optimal irrigation and prevent overwatering or underwatering."
    },
    mq5: {
      title: "MQ-5 Gas Sensor",
      desc: "It detects gases like LPG, methane, and propane. Though optional, it's used to monitor the environment in greenhouses or enclosed areas."
    },
    ldr: {
      title: "LDR (Light Dependent Resistor)",
      desc: "This sensor detects ambient light. It can help decide irrigation schedules based on daylight availability or control artificial lighting."
    }
  };

  const cards = document.querySelectorAll(".sensor-card");
  const modal = document.getElementById("sensorModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDescription");
  const closeBtn = document.querySelector(".close-btn");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const sensorKey = card.dataset.sensor;
      if (sensorDescriptions[sensorKey]) {
        modalTitle.textContent = sensorDescriptions[sensorKey].title;
        modalDesc.textContent = sensorDescriptions[sensorKey].desc;
        modal.classList.remove("hidden");
      }
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
});