from flask import Flask, request, jsonify, render_template
import os
import pandas as pd
import pickle
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)

model_path = os.path.join(os.getcwd(), 'plant_health_model.pkl')
model = pickle.load(open(model_path, 'rb'))

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

    data = request.get_json()
    if not data:
        return jsonify({"error": "Tidak ada data yang diterima"}), 400

    humidity = data.get("humidity")
    light = data.get("light")

    if humidity is None or light is None:
        return jsonify({"error": "Data tidak lengkap atau kunci salah"}), 400

    if not isinstance(humidity, (int, float)) or not isinstance(light, (int, float)):
        return jsonify({"error": "Data sensor harus berupa angka"}), 400

    latest_sensor_data["humidity"] = humidity
    latest_sensor_data["light"] = light
    logging.info(f"Data diterima: {latest_sensor_data}")

    return jsonify({"status": "Berhasil", "data": latest_sensor_data}), 200

@app.route('/api/sensor/latest', methods=['GET'])
def get_latest_sensor_value():
    if all(value is not None for value in latest_sensor_data.values()):
        return jsonify({"latest_data": latest_sensor_data}), 200
    return jsonify({"error": "Tidak ada data sensor tersedia"}), 404

@app.route('/api/predict', methods=['POST'])
def predict():
    if any(value is None for value in latest_sensor_data.values()):
        logging.error("Data sensor tidak lengkap untuk prediksi")
        return jsonify({"error": "Data sensor tidak lengkap untuk prediksi"}), 400

    try:
        humidity = float(latest_sensor_data["humidity"])
        light = float(latest_sensor_data["light"])
        input_data = pd.DataFrame([[humidity, light]], columns=["humidity", "light"])

        prediction_label = model.predict(input_data)[0]
        logging.info(f"Prediction successful: {prediction_label}")

        return jsonify({"prediction": prediction_label}), 200
    except Exception as e:
        logging.error(f"Error dalam prediksi: {str(e)}")
        return jsonify({"error": "Terjadi kesalahan saat memproses prediksi", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')