

// Initialize Firebase (if not already done elsewhere in your project)
const firebaseConfig = {
  apiKey: "AIzaSyBSzBnOxpLTqKiNbNIxQRbZiYcGG0z6QcI",
  authDomain: "smart-irrigation-fbefa.firebaseapp.com",
  databaseURL: "https://smart-irrigation-fbefa-default-rtdb.firebaseio.com",
  projectId: "smart-irrigation-fbefa",
  storageBucket: "smart-irrigation-fbefa.appspot.com", 
  messagingSenderId: "936444362857",
  appId: "1:936444362857:web:8146a60a676223a258e2f8"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Reference path in the database
const historyRef = database.ref("history");



// // Run when page loads
// document.addEventListener("DOMContentLoaded", displayHistory);
function displayCombinedHistory() {
  const historyContainer = document.getElementById("historyContainer");
  historyContainer.innerHTML = "";

  const localData = JSON.parse(localStorage.getItem("history")) || [];

  // Display localStorage data
  localData.forEach((record, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>📅 ${record.timestamp}</h3>
      <p>🌾 Crop: ${record.crop}</p>
      <p>🏞️ Soil: ${record.soil}</p>
      <p>🌍 Field: ${record.field} acres</p>
      <div class="history-actions">
        <button class="edit-btn" onclick="editLocalRecord(${index})">✏️ Edit</button>
        <button class="delete-btn" onclick="deleteLocalRecord(${index})">🗑️ Delete</button>
      </div>
    `;
    historyContainer.appendChild(card);
  });

  // Now fetch Firebase data and append
  historyRef.once("value", (snapshot) => {
    const data = snapshot.val();
    if (!data && localData.length === 0) {
      historyContainer.innerHTML = "<p>No history found.</p>";
      return;
    }

    Object.entries(data || {}).forEach(([key, record]) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>📅 ${record.timestamp}</h3>
        <p>🌾 Crop: ${record.crop}</p>
        <p>🏞️ Soil: ${record.soil}</p>
        <p>🌍 Field: ${record.field} acres</p>
        <div class="history-actions">
          <button class="edit-btn" onclick="editFirebaseRecord('${key}')">✏️ Edit</button>
          <button class="delete-btn" onclick="deleteFirebaseRecord('${key}')">🗑️ Delete</button>
        </div>
      `;
      historyContainer.appendChild(card);
    });
  });
}
function promptAndSaveEntry() {
  const crop = prompt("Enter crop type:");
  const soil = prompt("Enter soil type:");
  const field = prompt("Enter field size (in acres):");

  if (crop && soil && field) {
    const timestamp = new Date().toLocaleString();
    const newRecord = { crop, soil, field, timestamp };

    // Save to Firebase
    historyRef.push(newRecord);

    // Save to localStorage too
    const localData = JSON.parse(localStorage.getItem("history")) || [];
    localData.push(newRecord);
    localStorage.setItem("history", JSON.stringify(localData));

    alert("Data added!");
    displayCombinedHistory();
  }
}

function editLocalRecord(index) {
  const localData = JSON.parse(localStorage.getItem("history")) || [];
  const data = localData[index];

  const newCrop = prompt("Edit crop type:", data.crop);
  const newSoil = prompt("Edit soil type:", data.soil);
  const newField = prompt("Edit field size:", data.field);

  if (newCrop && newSoil && newField) {
    localData[index] = {
      crop: newCrop,
      soil: newSoil,
      field: newField,
      timestamp: new Date().toLocaleString()
    };
    localStorage.setItem("history", JSON.stringify(localData));
    displayCombinedHistory();
  }
}

function deleteLocalRecord(index) {
  const localData = JSON.parse(localStorage.getItem("history")) || [];
  if (confirm("Are you sure you want to delete this record?")) {
    localData.splice(index, 1);
    localStorage.setItem("history", JSON.stringify(localData));
    displayCombinedHistory();
  }
}

function editFirebaseRecord(id) {
  historyRef.child(id).once("value", (snapshot) => {
    const data = snapshot.val();
    const newCrop = prompt("Edit crop type:", data.crop);
    const newSoil = prompt("Edit soil type:", data.soil);
    const newField = prompt("Edit field size:", data.field);

    if (newCrop && newSoil && newField) {
      historyRef.child(id).update({
        crop: newCrop,
        soil: newSoil,
        field: newField,
        timestamp: new Date().toLocaleString()
      }, (error) => {
        if (error) alert("Update failed");
        else displayCombinedHistory();
      });
    }
  });
}

function deleteFirebaseRecord(id) {
  if (confirm("Are you sure you want to delete this record?")) {
    historyRef.child(id).remove((error) => {
      if (error) alert("Delete failed");
      else displayCombinedHistory();
    });
  }
}
document.addEventListener("DOMContentLoaded", displayCombinedHistory);
