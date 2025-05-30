document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') document.body.classList.add('dark-mode');

  const isLoggedIn = localStorage.getItem("smartIrrigationLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("smartIrrigationCurrentUser"));

  if (isLoggedIn && user) {
    document.body.classList.add("home-page");

    const rightSection = document.querySelector(".right-section");
    rightSection.innerHTML = `
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

    // Close dropdown if clicked outside
    window.addEventListener('click', function (e) {
      if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.style.display = 'none';
      }
    });
  }

  // Dark mode toggle for guests
  const toggleBtn = document.getElementById('toggle-dark');
  toggleBtn?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
});
document.getElementsByClassName("discover-btn")[0].addEventListener('click',function(){
window.location.href='about.html';
});