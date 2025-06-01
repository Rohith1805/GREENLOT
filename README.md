#GREENLOT
# 🌿 GREENLOT — Smart Agriculture & Irrigation System

**GREENLOT** is a full-stack smart agriculture system designed to empower farmers with intelligent field monitoring, real-time decision-making, and multilingual accessibility. By combining IoT sensors, Firebase integration, and a beautifully crafted web interface, GREENLOT makes modern farming more accessible, efficient, and automated.

> _To deploy this project locally or on a server:_https://greenlot.onrender.com/index.html
---

## 🔍 Project Overview

GREENLOT helps farmers manage their fields intelligently through:
- 🌾 **Crop recommendations** based on automatic **location & season detection** for new farmers.
- 📈 Real-time **sensor data monitoring**.
- 💧 Automatic and manual **irrigation control**.
- 🔥 Hazard detection (gas/fire) with **buzzer alerts**.
- 🌐 Multilingual web interface with **Telugu, English, Hindi** support.
- 📲 OTP-based secure login for farmers.
- 📰 Live agriculture **news updates** for awareness.

---

## 📸 Interface Highlights

> The HTML design of this project is carefully structured and visually enhanced for user-friendliness. Multiple web pages like `control`, `about`, `crop suggestion`, `readings`, and more have been beautifully styled using custom CSS for a smooth, professional farmer experience.

---

## ⚙️ System Architecture

```plaintext
ESP32 + Sensors ---> Firebase (Realtime DB) ---> Web App
         ^                                          |
         |------------------------------------------|
                Controls sent back to ESP32
```

### 🔧 Hardware Components Used
- 🌡️ **DHT22** (Temperature & Humidity)
- 🌱 **Soil Moisture Sensor**
- 💡 **LDR** (Light Dependent Resistor)
- 🧪 **MQ-5 Gas Sensor**
- 🔔 **Buzzer** (For alerts & pump indication)
- ⚙️ **Relay/Motor Driver** (Pump control)

---

## 🌐 Web Features

- **Dashboard** for real-time sensor values.
- **Control Panel** to toggle irrigation (Auto/Manual).
- **Crop Suggestion Page** using geolocation and seasonal data.
- **User Profile** with OTP authentication.
- **Multilingual Selector** (Telugu | English | Hindi).
- **Notifications and News** panel for alerts and updates.
- **Data History** view for:
  - Crop/Soil/Field size logs
  - Sensor reading history
  - Pump and alert notifications

---

## 🔐 Authentication

- OTP-based **secure login** for farmers.
- Simple, fast, and mobile-friendly login process.

---

## 📦 Tech Stack

| Layer         | Technology       |
|---------------|------------------|
| Frontend      | HTML, CSS, JavaScript |
| Realtime DB   | Firebase Realtime Database |
| Authentication| Firebase OTP Login |
| Hardware      | ESP32 with MicroPython |
| Cloud Storage | Firebase Storage (optional for images/data logs) |

---

## ☁️ Firebase Integration

Firebase is used for:
- Realtime sensor data updates
- Storing pump status (auto/manual)
- Notifications and alerts
- Historical sensor & crop data
- User authentication via OTP

---

## 🛠️ Installation & Setup

> _To deploy this project locally or on a server:_https://greenlot.onrender.com/index.html

1. Clone the repository:
   ```bash
   git clone https://github.com/Rohith1805/GREENLOT.git
   ```

2. Open the `html/` folder and launch `control.html` in your browser.

3. Setup Firebase:
   - Add your Firebase config in the JS files.
   - Ensure Firebase Realtime DB rules are correctly set.
   - Enable OTP-based authentication (via phone).

4. Deploy the ESP32 MicroPython code:
   - Connect the sensors to the ESP32.
   - Flash your ESP32 with MicroPython firmware.
   - Use `Thonny` or `uPyCraft` to upload and run the Python scripts.
   - Confirm data is syncing to Firebase.

---

## 🚀 Key Features Summary

-  Automatic & manual water pump control
-  Real-time sensor monitoring
-  Buzzer alerts for pump activation and gas hazard
-  Firebase cloud sync with control feedback loop
- OTP login with multilingual web UI
- Crop suggestions using location and weather
-  Historical data tracking for analysis
-  News and updates tailored for farmers

---

## 🤝 Contribution

We welcome contributions! Feel free to fork the repo, improve the UI, suggest new features, or optimize the IoT workflow.

---

## 📩 Contact

Have questions or suggestions? Reach out via:

- GitHub Issues
- siddagounirohith@gmail.com


---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

> **GREENLOT** — Cultivating smarter farming with the power of IoT and cloud.
