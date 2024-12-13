from flask import Flask, request, jsonify, render_template
import joblib
import os
import numpy as np
import pickle

app = Flask(__name__)

# Memuat model yang disimpan
model = pickle.load(open(r'D:\Code\IoT x ML\Backend\knn_model5kelompokfix.pkl', 'rb'))

# Menyimpan data sensor terbaru
latest_sensor_data = {
    "humidity": None,
    "light": None,
}

@app.route('/')
def index():
    return render_template('home.html', data=latest_sensor_data)

@app.route('/api/sensor', methods=['POST'])
def sensor_data():
    global latest_sensor_data

    # Mengambil data JSON dari request
    data = request.get_json()
    if not data:
        return jsonify({"error": "Tidak ada data yang diterima"}), 400

    # Memproses data dari ESP32
    humidity = data.get("humidity")
    light = data.get("light")

    # Validasi data
    if humidity is None or light is None:
        return jsonify({"error": "Data tidak lengkap atau kunci salah"}), 400

    # Menyimpan data terbaru
    latest_sensor_data["humidity"] = humidity
    latest_sensor_data["light"] = light

    # Menampilkan data di terminal untuk debugging
    print(f"Data diterima: {latest_sensor_data}")

    # Mengirim respons ke ESP32
    return jsonify({"status": "Berhasil", "data": latest_sensor_data}), 200

@app.route('/api/sensor/latest', methods=['GET'])
def get_latest_sensor_value():
    # Mengembalikan data sensor terbaru
    if all(value is not None for value in latest_sensor_data.values()):
        return jsonify({"latest_data": latest_sensor_data}), 200
    return jsonify({"error": "Tidak ada data sensor tersedia"}), 404

@app.route('/api/predict', methods=['POST'])
def predict():
    global latest_sensor_data

    # Pastikan semua data sensor tersedia sebelum prediksi
    if any(value is None for value in latest_sensor_data.values()):
        return jsonify({"error": "Data sensor tidak lengkap untuk prediksi"}), 400

    # Ambil data sensor terbaru
    humidity = float(latest_sensor_data["humidity"])
    light = float(latest_sensor_data["light"])

    # Format data menjadi array 2D untuk prediksi
    input_data = np.array([[humidity, light]])

    # Lakukan prediksi
    try:
        prediction = model.predict(input_data)

        prediction_value = prediction[0]

        return jsonify({"prediction": prediction_value}), 200
    except Exception as e:
        print(f"Error dalam prediksi: {str(e)}") 
        return jsonify({"error": "Terjadi kesalahan saat memproses prediksi", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
