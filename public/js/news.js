import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import {
  getDatabase,
  ref,
  get
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0N7Mur6QbhZ9cOeWJwSZ3PZ-mvK8dQP0",
  authDomain: "smart-irrigation-f767b.firebaseapp.com",
  projectId: "smart-irrigation-f767b",
  storageBucket: "smart-irrigation-f767b.appspot.com",
  messagingSenderId: "832482451249",
  appId: "1:832482451249:web:1e6b0b787c81a89b419a10",
  measurementId: "G-Z5GT8M1BZ1"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ✅ Dark mode setup
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".toggle-btn");
    fetchNews();
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

// ✅ Time formatter (e.g., "3 hours ago")
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

// ✅ Fetch and render news
async function fetchNews() {
  const newsContainer = document.getElementById('newsContainer');
  const loader = document.getElementById('loader');
  const apiKey = 'ec0bfe89aba948ac8e2da75879b3348d';
  const url = `https://newsapi.org/v2/everything?q=agriculture&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

  loader.style.display = 'block';

  try {
    const response = await fetch(url);
    const data = await response.json();
    loader.style.display = 'none';

    if (data.articles && data.articles.length > 0) {
      newsContainer.innerHTML = data.articles.map(article => {
        const published = timeAgo(article.publishedAt);
        return `
          <div class="news-card">
            <img src="${article.urlToImage || 'https://via.placeholder.com/300x180?text=No+Image'}" alt="News Image" class="news-image">
            <div class="news-content">
              <h3>${article.title}</h3>
              <small class="published-time">🕒 ${published}</small>
              <p>${article.description || 'No description available.'}</p>
              <a href="${article.url}" target="_blank">Read more</a>
            </div>
          </div>
        `;
      }).join('');
    } else {
      newsContainer.innerHTML = `<p>No articles found.</p>`;
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    loader.style.display = 'none';
    newsContainer.innerHTML = `<p>Failed to load news. Please try again later.</p>`;
  }
}

// ✅ Init on page load
window.addEventListener('DOMContentLoaded', () => {
  setupDarkMode();

  onAuthStateChanged(auth, (user) => {
    renderProfile(user);
  });

  fetchNews();
});
