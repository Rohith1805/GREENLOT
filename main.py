import ujson as json  # Use ujson instead of json for MicroPython
import network
import urequests
import utime as time
import dht
from machine import Pin, ADC, PWM
from machine import I2C
import ssd1306


#from ssd1306 import SSD1306_I2C  # Import OLED library
#import framebuf  # Required for graphics

# Wi-Fi Credentials
SSID = "Iqoo.."
PASSWORD = "Rohith2006"

# Load Firebase Credentials Securely
# Load Firebase Credentials Securely
# Firebase Credentials (Direct Method)
FIREBASE_URL = "https://smart-irrigation-fbefa-default-rtdb.firebaseio.com/"
FIREBASE_SECRET = "fhH2fUgCNWSNHodscvaruea2aRMR2KCVL8ftZYo3"



# WiFi Connection with Timeout
wifi = network.WLAN(network.STA_IF)
wifi.active(True)
wifi.connect(SSID, PASSWORD)

timeout = 15  # Timeout in seconds
start_time = time.time()

while not wifi.isconnected():
    if time.time() - start_time > timeout:
        print("❌ Wi-Fi Connection Failed! Check credentials or signal strength.")
        break
    time.sleep(1)

if wifi.isconnected():
    print("✅ Connected to Wi-Fi:", wifi.ifconfig())


# Sensor & Actuator Setup
soil_moisture = ADC(Pin(34))
soil_moisture.atten(ADC.ATTN_11DB)

# Soil Moisture Sensor
ldr = ADC(Pin(35))  # Light Sensor
ldr.atten(ADC.ATTN_11DB)#Set attenuation for full range (0-3.3V)
gas_sensor = ADC(Pin(36))  # Gas Sensor
gas_sensor.atten(ADC.ATTN_11DB)
chemical_sensor = ADC(Pin(39))  # Chemical Sensor
dht_sensor = dht.DHT22(Pin(4))  # DHT22 Temperature & Humidity Sensor
time.sleep(2)

try:
    dht_sensor.measure()
    temp = dht_sensor.temperature()
    humidity = dht_sensor.humidity()
    print("Temp:", temp, "Humidity:", humidity)
except OSError as e:
    print("DHT Sensor Error:", e)
relay_pump = Pin(26, Pin.OUT)  # Water Pump
led = Pin(2, Pin.OUT)  # Status LED
buzzer = Pin(25, Pin.OUT)  # Buzzer Alarm
fan_pwm = PWM(Pin(27), freq=1000)  # Fan Speed Control
stepper_motor = Pin(32, Pin.OUT)  # Stepper Motor Control
sprinkler_servo = PWM(Pin(14), freq=50)
# I2C OLED Display (Optional)
#i2c = I2C(0, scl=Pin(22), sda=Pin(21))
#i2c = I2C(0)  # Automatically detects default I²C pins
#oled = SSD1306_I2C(128, 64, i2c)

i2c = I2C(0, scl=Pin(22), sda=Pin(21))  # Use correct GPIO for your board
oled = ssd1306.SSD1306_I2C(128, 64, i2c) 


# Thresholds
MOISTURE_THRESHOLD = 3000  # Adjust for dry/wet soil
LIGHT_THRESHOLD = 600  # Adjust for light detection
GAS_THRESHOLD = 3500  # Gas Leak Detection
CHEMICAL_THRESHOLD = 500  # Chemical Detection Level
PUMP_MODE = "auto"
PUMP_MANUAL_STATE = "OFF"
# Function to Send Data to Firebase
def send_data_to_firebase(temperature, humidity, moisture, light, gas):
    data = {
        "temperature": temperature,
        "humidity": humidity,
        "soilMoisture": moisture,
        "ldr": light,
        "gasLevel": gas
    }
    json_data = json.dumps(data)

    if FIREBASE_URL and FIREBASE_SECRET:
        url = f"{FIREBASE_URL}/sensorData.json?auth={FIREBASE_SECRET}"
        print(f"🔗 Sending data to Firebase: {url}")  # Debugging
        print(f"📡 Data: {json_data}")  # Debugging
        
        try:
            response = urequests.put(url, data=json_data)
            print(f"✅ Firebase Response Code: {response.status_code}")  # Debugging
            print(f"📩 Response: {response.text}")  # Debugging
            response.close()
            if response.status_code == 200:
                print("✅ Data successfully sent to Firebase!")
            else:
                print("❌ Firebase Error:", response.text)
            response.close()
        except Exception as e:
            print("🔥 Firebase Send Error:", e)
def send_notification_to_firebase(message):
    notif_data = {
        "message": message,
        "timestamp": time.time()  # Optional: if you want time sorting later
    }
    try:
        notif_url = f"{FIREBASE_URL}/notifications/history.json?auth={FIREBASE_SECRET}"
        response = urequests.post(notif_url, data=json.dumps(notif_data))
        print("✅ Notification sent:", message)
        response.close()
    except Exception as e:
        print("🔥 Notification Send Error:", e)


def set_sprinkler_angle(angle):
    duty = int((angle / 180) * 65535)  # Convert to 16-bit range
    sprinkler_servo.duty_u16(duty)
    print(f"Sprinkler set to {angle}°")
def update_oled(temp, humidity, soil, light, gas):
    oled.fill(0)  # Clear screen
    oled.text("Smart Irrigation", 10, 0)  # Title
    
    oled.text(f"Temp: {temp} C" if temp != -1 else "Temp: N/A", 0, 16)
    oled.text(f"Hum: {humidity} %" if humidity != -1 else "Hum: N/A", 0, 26)
    oled.text(f"Soil: {soil}" if soil != -1 else "Soil: N/A", 0, 36)
    oled.text(f"Light: {light}" if light != -1 else "Light: N/A", 0, 46)
    oled.text(f"Gas: {gas}" if gas != -1 else "Gas: N/A", 0, 56)

    oled.show()  # Update OLED screen


def get_actuator_commands():
    global PUMP_MODE, PUMP_MANUAL_STATE

    if not FIREBASE_URL or not FIREBASE_SECRET:
        print("Firebase credentials not available.")
        return

    url = f"{FIREBASE_URL}/actuators.json?auth={FIREBASE_SECRET}"
    try:
        response = urequests.get(url)
        if response.status_code == 200 and response.text:
            actuators = response.json()
            response.close()

            # Save values for use in main loop
            PUMP_MODE = actuators.get("mode", "auto")  # default: auto
            PUMP_MANUAL_STATE = actuators.get("pump", "OFF")

            # LED Control
            led.value(1 if actuators.get("led") == "ON" else 0)

            # Buzzer Control
            buzzer.value(1 if actuators.get("buzzer") == "ON" else 0)

            # Fan Speed Control
            fan_speed = actuators.get("fan_speed", 0)
            if isinstance(fan_speed, int) and 0 <= fan_speed <= 1023:
                fan_pwm.duty(fan_speed)

            # Stepper Motor Control
            stepper_motor.value(1 if actuators.get("stepper_motor") == "ON" else 0)

        else:
            print("Failed to fetch actuator data.")
        response.close()
    except Exception as e:
        print("Firebase get error:", e)

pump_on = False
# Main Loop
while True:
    try:
        get_actuator_commands()
        print("📡 Firebase Mode:", PUMP_MODE)
        print("📡 Firebase Pump:", PUMP_MANUAL_STATE)

        # Read Sensor Data
        # Read Sensor Data with Disconnection Handling
        soil_value = soil_moisture.read()
       # soil_value = soil_value if soil_value < 4090 else -1  # -1 means sensor disconnected

        light_value = ldr.read()
        light_value = light_value if light_value < 4090 else -1

        gas_value = gas_sensor.read()
        gas_value = gas_value if gas_value < 4090 else -1

        chemical_value = chemical_sensor.read()
        chemical_value = chemical_value if chemical_value < 4090 else -1

        try:
            dht_sensor.measure()
            temp = dht_sensor.temperature()
            humidity = dht_sensor.humidity()
        except OSError as e:
            print("❌ DHT Sensor Error:", e)
            temp, humidity = -1, -1  # Assign -1 to indicate failure
        time.sleep(3)

        print("Temperature:", temp, "°C")
        print("Humidity:", humidity, "%")
        print("Soil Moisture:", soil_value)
        print("Light Level:", light_value)
        print("Gas Level:", gas_value)
        update_oled(temp, humidity, soil_value, light_value, gas_value)

        #  Automatic Pump Control (Add This Section)
        #auto_pump = False  # Flag to track if pump was turned ON automatically

        if PUMP_MODE == "manual":
            if PUMP_MANUAL_STATE == "ON":
                relay_pump.value(1)
                send_notification_to_firebase("Pump turned ON Automatically (Soil Dry)")
                print("🖐️ Manual Mode: Pump ON via Firebase")
            else:
                relay_pump.value(0)
                send_notification_to_firebase("Pump turned OFF Automatically (Soil Wet)")
                send_notification_to_firebase("Pump turned OFF")
                print("🖐️ Manual Mode: Pump OFF via Firebase")

        elif PUMP_MODE == "auto":
            if soil_value > MOISTURE_THRESHOLD:
                if not pump_on:
                    relay_pump.value(1)  # Turn Off pump
                    send_notification_to_firebase("Pump turned ON Automatically (Soil Dry)")
            		#set_sprinkler_angle(180)  # Fully open sprinkler
                    buzzer.value(1)
                    time.sleep(3) # Keep ON for 3s
                    buzzer.value(0)
                    pump_on = True
            	#auto_pump = True
                    print("Pump & Sprinkler ON automatically (low moisture)")
            else:
                if pump_on:
                    relay_pump.value(0)  # Turn On pump
                    send_notification_to_firebase("Pump turned OFF Automatically (Soil Wet)")
            		#set_sprinkler_angle(0)  # Fully close sprinkler
                    buzzer.value(1)
                    time.sleep(1)
                    buzzer.value(0)
                    pump_on = False
                    print("Pump & Sprinkler OFF (moisture normal)")

        #  Automatic Buzzer Activation for Gas Detection
        if gas_value > GAS_THRESHOLD:  
            buzzer.value(1)  # Turn ON the buzzer
            send_notification_to_firebase("⚠️ Fire or Gas Leak Detected! Buzzer ON")
            print(" Gas Detected! Buzzer Activated!")
            time.sleep(15)  # Keep buzzer ON for 5 seconds
        else:
            buzzer.value(0)  # Turn OFF buzzer if gas is normal

        # Define Light Threshold for Night


        # Automatic Light Control (Turn ON LED if it's dark)
        if light_value < LIGHT_THRESHOLD:
            led.value(1)  # Turn ON light
            print("Lights ON (It's dark)")
            send_notification_to_firebase("LED Lights turned ON (Darkness Detected)")
        else:
            led.value(0)  # Turn OFF light
            print("Lights OFF (Sufficient light)")
            send_notification_to_firebase("LED Lights turned OFF (Enough Light)")

        # Send Data to Firebase
        send_data_to_firebase(temp, humidity, soil_value, light_value, gas_value)

        # Read Actuator Commands from Firebase
        #get_actuator_commands()

        #  Ensure Pump OFF if No Auto Mode (Only Firebase Control)
      #  if not auto_pump:  
        #    relay_pump.value(0)
          #  print("Pump turned OFF (manual control or normal conditions)")

        time.sleep(5)  # Update every 5 seconds


    except Exception as e:
        print("Firebase get error:",e)

