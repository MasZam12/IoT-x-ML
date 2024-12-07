#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

const char *wifiSSID = "AZREENA";
const char *wifiPassword = "azreena31";

const char *serverUrl = "http://192.168.1.13:5000/api/sensor";

const int sensorKelembapan = 33;
const int lightSensorPins = 32;

void koneksiWiFi();
void kirimData(float kelembapan, int cahaya);

void setup()
{
  Serial.begin(115200);

  pinMode(sensorKelembapan, INPUT);
  pinMode(lightSensorPins, INPUT);

  koneksiWiFi();
  Serial.println("Memulai pembacaan sensor");
}

void loop()
{
  float nilaiKelembapan = analogRead(sensorKelembapan); // Membaca data analog dari sensor kelembapan
  int nilaiCahaya = analogRead(lightSensorPins);        // Membaca data analog dari sensor cahaya

  nilaiKelembapan = map(nilaiKelembapan, 0, 4095, 0, 100);
  float kelembapanPersen = (nilaiKelembapan - 100) * -1;

  nilaiCahaya = 4095 - nilaiCahaya;
  int cahaya = map(nilaiCahaya, 0, 4095, 0, 1200);

  kirimData(kelembapanPersen, cahaya);

  delay(5000);
}

void koneksiWiFi()
{
  Serial.println("Menghubungkan ke jaringan WiFi...");
  WiFi.begin(wifiSSID, wifiPassword);

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nWiFi terhubung");
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void kirimData(float kelembapan, int cahaya)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Membuat payload JSON
    String payload = "{";
    payload += "\"humidity\": " + String(kelembapan, 2) + ","; // Menggunakan 'humidity' dan 'light'
    payload += "\"light\": " + String(cahaya);
    payload += "}";

    // Kirim request POST
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0)
    {
      Serial.println("Data berhasil dikirim!");
      Serial.print("Response code: ");
      Serial.println(httpResponseCode);
      Serial.print("Response body: ");
      Serial.println(http.getString());
    }
    else
    {
      Serial.print("Error saat mengirim data. Code: ");
      Serial.println(httpResponseCode);
    }

    http.end(); // Tutup koneksi HTTP
  }
  else
  {
    Serial.println("WiFi tidak terhubung. Data tidak dapat dikirim.");
    koneksiWiFi(); // Coba sambungkan ulang jika WiFi terputus
  }
}
