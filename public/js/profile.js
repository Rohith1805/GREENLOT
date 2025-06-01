document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("smartIrrigationLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("smartIrrigationCurrentUser"));
    
    // Redirect to login if not logged in
    if (!isLoggedIn || !user) {
      window.location.href = 'signin.html';
      return;
    }
    
    // Populate profile name
    document.getElementById('profileName').textContent = user.name || 'User';
    
    // Load profile data from localStorage or set defaults
    const profileData = JSON.parse(localStorage.getItem("smartIrrigationProfileData")) || {
      cropType: "Rice",
      soilType: "Clay Loam",
      farmerType: "Small Scale",
      monthlyCost: "₹2,500"
    };
    
    // Update UI with profile data
    document.getElementById('cropType').textContent = profileData.cropType;
    document.getElementById('soilType').textContent = profileData.soilType;
    document.getElementById('farmerType').textContent = profileData.farmerType;
    document.getElementById('monthlyCost').textContent = profileData.monthlyCost;
    
    // Setup navigation profile dropdown
    setupNavProfileDropdown(user);
    
    // Apply theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      document.getElementById('themeText').textContent = 'Light Mode';
    }
    
    // Setup Dark Mode Toggle
    document.getElementById('darkModeToggle').addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      document.getElementById('themeText').textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
    
    // Setup Logout
    document.getElementById('logoutButton').addEventListener('click', () => {
      localStorage.removeItem('smartIrrigationLoggedIn');
      localStorage.removeItem('smartIrrigationCurrentUser');
      window.location.href = 'signin.html';
    });
    
    // Setup Settings
    document.getElementById('settingsBtn').addEventListener('click', () => {
      alert('Settings feature coming soon!');
    });
    
    // Setup Field Editing
    setupFieldEditing();
  });
  
  function setupNavProfileDropdown(user) {
    const profileSection = document.getElementById("profileSection");
    
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
    
    document.getElementById('toggleDarkMode').addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('smartIrrigationLoggedIn');
      localStorage.removeItem('smartIrrigationCurrentUser');
      window.location.href = 'signin.html';
    });
    
    // Close dropdown if clicked outside
    window.addEventListener('click', function(e) {
      if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.style.display = 'none';
      }
    });
  }
  
  function setupFieldEditing() {
    const modal = document.getElementById("editModal");
    const closeBtn = document.querySelector(".close-modal");
    const fieldInput = document.getElementById("fieldInput");
    const fieldLabel = document.getElementById("fieldLabel");
    const saveBtn = document.getElementById("saveFieldBtn");
    let currentField = null;
    
    // Set up edit buttons
    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const field = btn.getAttribute("data-field");
        const currentValue = document.getElementById(field).textContent;
        
        // Set up modal
        fieldLabel.textContent = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        fieldInput.value = currentValue;
        currentField = field;
        
        // Show modal
        modal.style.display = "block";
      });
    });
    
    // Save changes
    saveBtn.addEventListener("click", () => {
      if (currentField && fieldInput.value.trim()) {
        // Update UI
        document.getElementById(currentField).textContent = fieldInput.value;
        
        // Save to localStorage
        const profileData = JSON.parse(localStorage.getItem("smartIrrigationProfileData")) || {};
        profileData[currentField] = fieldInput.value;
        localStorage.setItem("smartIrrigationProfileData", JSON.stringify(profileData));
        
        // Close modal
        modal.style.display = "none";
      }
    });
    
    // Close modal
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    
    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }