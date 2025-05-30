import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0N7Mur6QbhZ9cOeWJwSZ3PZ-mvK8dQP0",
  authDomain: "smart-irrigation-f767b.firebaseapp.com",
  projectId: "smart-irrigation-f767b",
  storageBucket: "smart-irrigation-f767b.appspot.com",
  messagingSenderId: "832482451249",
  appId: "1:832482451249:web:1e6b0b787c81a89b419a10",
  measurementId: "G-Z5GT8M1BZ1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchWeather(lat, lon) {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`);
    const data = await response.json();
    console.log("📡 Weather API response:", data);

    const temp = data.current.temperature_2m;
    const humidity = data.current.relative_humidity_2m;

    let weather = "moderate";
    if (temp >= 30 && humidity >= 60) weather = "hot";
    else if (temp < 20 && humidity < 50) weather = "cool";
    else if (humidity > 70) weather = "humid";

    return weather;
  } catch (error) {
    console.error("❌ Failed to fetch weather:", error);
    return null;
  }
}

async function suggestCrops() {
  const suggestionsContainer = document.getElementById("crop-suggestions");
  const debugContainer = document.getElementById("debug-info");
  suggestionsContainer.innerHTML = "<p>Loading suggestions...</p>";

  let location = "Unknown";
  let weatherCondition = "Unknown";

  try {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      location = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
      weatherCondition = await fetchWeather(lat, lon);

      console.log("📍 Location:", location);
      console.log("🌤️ Weather condition:", weatherCondition);

      const querySnapshot = await getDocs(collection(db, "crops"));
      const crops = [];
      querySnapshot.forEach((doc) => {
        crops.push(doc.data());
      });

      const matchingCrops = crops.filter(crop =>
        crop.weather?.includes(weatherCondition)
      );

      if (matchingCrops.length > 0) {
        suggestionsContainer.innerHTML = `<div class="crop-list">` + matchingCrops.map(crop =>
          `<div class="crop-card">
              <img src="${crop.image}" alt="${crop.name}" />
              <p id="cropName">${crop.name}</p>
              <p id="cropSeason">${crop.season || ''}</p>
          </div>`
        ).join("") + `</div>`;
      } else {
        suggestionsContainer.innerHTML = `
          <p>No crop suggestions found for:</p>
          <ul>
            <li><strong>Location:</strong> ${location}</li>
            <li><strong>Weather:</strong> ${weatherCondition}</li>
          </ul>
        `;
      }

      debugContainer.innerHTML = `
        <div style="color:#aaa; font-size: 0.9rem; margin-top:1rem">
          🔍 Debug Info:<br>
          📍 Location: ${location}<br>
          🌤️ Weather: ${weatherCondition}
        </div>
      `;
    }, (error) => {
      suggestionsContainer.innerHTML = `<p>⚠️ Location permission denied. Unable to fetch suggestions.</p>`;
      console.error("Geolocation error:", error);
    });
  } catch (err) {
    console.error("🔥 Firestore error:", err);
    suggestionsContainer.innerHTML = "<p>Error fetching crop data.</p>";
  }
}

document.addEventListener("DOMContentLoaded", suggestCrops);
const nextBtn = document.getElementById("nextBtn");
nextBtn.classList.remove("hidden"); // Show the button
nextBtn.addEventListener("click", () => {
  window.location.href = "crop.html";
});

