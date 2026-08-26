from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)

CORS(app)


# =================================
# 현재 AI 감지 결과 저장
# =================================

latest_detection = {
    "posture": "supine",
    "confidence": 0,
    "danger": False,
    "pump": False,
    "timestamp": None
}


# =================================
# 서버 상태 확인
# =================================

@app.route("/")
def home():

    return "SIDS Server is running!"


# =================================
# YOLO 감지 결과 받기
# =================================

@app.route("/detection", methods=["POST"])
def detection():

    global latest_detection

    data = request.get_json()

    posture = data.get("posture")
    confidence = data.get("confidence", 0)

    # 위험 여부
    danger = data.get("danger", False)

    # 펌프 작동 여부
    pump = data.get("pump", False)


    latest_detection = {

        "posture": posture,

        "confidence": confidence,

        "danger": danger,

        "pump": pump,

        "timestamp": datetime.now().isoformat()
    }


    print()
    print("================================")
    print("📷 YOLO 감지 결과")
    print("================================")

    print(f"자세       : {posture}")
    print(f"신뢰도     : {confidence}")

    if danger:
        print("위험 상태  : 🚨 위험")
    else:
        print("위험 상태  : ✅ 안전")

    if pump:
        print("방석 상태  : 💨 펌프 작동")
    else:
        print("방석 상태  : 대기")

    print("================================")
    print()


    return jsonify({

        "status": "success",

        "message": "Detection received",

        "data": latest_detection
    })


# =================================
# 현재 감지 결과 확인
# =================================

@app.route("/detection", methods=["GET"])
def get_detection():

    return jsonify(latest_detection)


# =================================
# 기존 위험 신호
# =================================

@app.route("/danger", methods=["POST"])
def danger():

    print("🚨 위험 감지 신호 받음!")


    return jsonify({

        "status": "success",

        "message": "Danger signal received"
    })


# =================================
# 서버 실행
# =================================

if __name__ == "__main__":

    print()
    print("================================")
    print("SIDS SAFE AI SERVER")
    print("================================")
    print("Flask Server 시작")
    print("Port : 5000")
    print("================================")
    print()


    app.run(

        host="0.0.0.0",

        port=5000,

        debug=False
    )