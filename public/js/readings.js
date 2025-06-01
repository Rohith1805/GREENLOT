import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// ✅ Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0N7Mur6QbhZ9cOeWJwSZ3PZ-mvK8dQP0",
  authDomain: "smart-irrigation-f767b.firebaseapp.com",
  projectId: "smart-irrigation-f767b",
  storageBucket: "smart-irrigation-f767b.firebasestorage.app",
  messagingSenderId: "832482451249",
  appId: "1:832482451249:web:1e6b0b787c81a89b419a10",
  measurementId: "G-Z5GT8M1BZ1"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Show user profile or Sign In button
onAuthStateChanged(auth, (user) => {
  const profileSection = document.getElementById("profileSection");
  if (!profileSection) return;

  if (user) {
    const displayName = user.displayName || "User";
    profileSection.innerHTML = `
      <div class="profile-dropdown">
        <button class="profile-name">${displayName} ⌄</button>
        <div class="dropdown-menu">
          <a href="#">Settings</a>
          <button onclick="toggleDarkMode()">Toggle Dark Mode</button>
          <button onclick="logout()">Logout</button>
        </div>
      </div>
    `;
  } else {
    profileSection.innerHTML = `
      <button class="signin-btn" onclick="window.location.href='signin.html'">Sign In</button>
    `;
  }
});

// ✅ Logout logic
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = 'signin.html';
  });
};

// ✅ Dark Mode toggle
window.toggleDarkMode = function () {
  document.body.classList.toggle("dark-mode");
};
