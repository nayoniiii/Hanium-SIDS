from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime


app = Flask(__name__)

CORS(app)


# ==========================================
# 현재 시스템 상태
# ==========================================

latest_detection = {

    "posture": "supine",

    "confidence": 0,

    "danger": False,

    "pump": False,

    "timestamp": None
}


# ==========================================
# 서버 상태 확인
# ==========================================

@app.route("/")
def home():

    return "SIDS Server is running!"


# ==========================================
# Raspberry Pi → PC
# YOLO 감지 결과 받기
# ==========================================

@app.route("/detection", methods=["POST"])
def detection():

    global latest_detection

    data = request.get_json()

    if data is None:

        return jsonify({
            "status": "error",
            "message": "No JSON data"
        }), 400


    posture = data.get(
        "posture",
        "unknown"
    )


    confidence = float(
        data.get(
            "confidence",
            0
        )
    )


    danger = bool(
        data.get(
            "danger",
            False
        )
    )


    pump = bool(
        data.get(
            "pump",
            False
        )
    )


    # ======================================
    # 최신 상태 저장
    # ======================================

    latest_detection = {

        "posture": posture,

        "confidence": confidence,

        "danger": danger,

        "pump": pump,

        "timestamp": datetime.now().isoformat()
    }


    # ======================================
    # 터미널 출력
    # ======================================

    print(
        f"📷 자세: {posture} "
        f"| 신뢰도: {confidence:.1f}% "
        f"| 위험: {' 위험' if danger else ' 정상'} "
        f"| 펌프: {' ON' if pump else 'OFF'}"
    )


    return jsonify({

        "status": "success",

        "data": latest_detection
    })


# ==========================================
# React → 현재 상태 확인
# ==========================================

@app.route("/detection", methods=["GET"])
def get_detection():

    return jsonify(latest_detection)


# ==========================================
# 서버 실행
# ==========================================

if __name__ == "__main__":

    print("================================")
    print("SIDS SAFE AI SERVER")
    print("================================")
    print("Flask Server 시작")
    print("Port : 5000")
    print("================================")


    app.run(

        host="0.0.0.0",

        port=5000,

        debug=False
    )