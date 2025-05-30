// document.addEventListener('DOMContentLoaded', () => {
//   // Future Firebase notifications logic can go here
//   console.log("Notifications page loaded");

//   // Optional: Scroll to top on load (UI polish)
//   window.scrollTo({ top: 0, behavior: 'smooth' });

//   // You can preload user-specific alerts here later
// });
    // Initialize Firebase
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
   
  const db = firebase.database();
document.addEventListener("DOMContentLoaded", () => {
  const notifContainer = document.getElementById("notificationList");

  function showToast(message) {
    const toast = document.getElementById("popup-toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");
  
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hidden");
    }, 4000); // visible for 4 seconds
  }
  
function fetchNotifications() {
  const notifContainer = document.getElementById("notificationList");
  const dbRef = firebase.database().ref("notifications/history");

  notifContainer.innerHTML = ""; // Clear old entries initially

  // Listen to new notifications as they are added
  dbRef.limitToLast(5).on("child_added", snapshot => {
    const notification = snapshot.val();

    if (!notification || !notification.message) return;

    const div = document.createElement("div");
    div.classList.add("notification-box");

    const msg = notification.message.toLowerCase();
    if (msg.includes("pump")) {
      div.classList.add("blue-alert");
    } else if (msg.includes("led")) {
      div.classList.add("yellow-alert");
    } else if (msg.includes("fire")) {
      div.classList.add("red-alert");
    } else {
      div.classList.add("blue-alert");
    }

    div.innerHTML = `<i class="fa-solid fa-bell"></i> ${notification.message}`;

    // Prepend so newest are at the top
    notifContainer.prepend(div);

    // Show popup toast
    showToast(notification.message);
  });
}

  fetchNotifications(); // Fetch once when page loads
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
