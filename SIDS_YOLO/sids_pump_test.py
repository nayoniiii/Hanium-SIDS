from ultralytics import YOLO
import requests
import time
import cv2


# ==========================================
# 설정
# ==========================================

MODEL_PATH = "best.pt"

# 현재 Arduino IP
ARDUINO_IP = "192.168.137.229"

PUMP_ON_URL = f"http://{ARDUINO_IP}/pump/on"
PUMP_OFF_URL = f"http://{ARDUINO_IP}/pump/off"


# 위험 자세
DANGER_POSTURES = ["prone"] #옆으로 누운자세도 위험으로 추가하려면 "side" 추가하기

# 위험 자세가 몇 초 지속되어야 하는지
DANGER_TIME = 3

# 펌프를 몇 초 작동할지
PUMP_TIME = 3


# ==========================================
# Arduino 펌프 제어
# ==========================================

def pump_on():

    try:
        response = requests.get(PUMP_ON_URL, timeout=2)

        if response.status_code == 200:
            print("💨 PUMP ON")
            return True

        print("⚠️ 펌프 ON 요청 실패")

    except requests.exceptions.RequestException as e:
        print("❌ Arduino 연결 실패:", e)

    return False


def pump_off():

    try:
        response = requests.get(PUMP_OFF_URL, timeout=2)

        if response.status_code == 200:
            print("🛑 PUMP OFF")
            return True

        print("⚠️ 펌프 OFF 요청 실패")

    except requests.exceptions.RequestException as e:
        print("❌ Arduino 연결 실패:", e)

    return False


# ==========================================
# YOLO 모델
# ==========================================

model = YOLO(MODEL_PATH)


# ==========================================
# 카메라
# ==========================================

cap = cv2.VideoCapture(0)


# ==========================================
# 위험 판단 변수
# ==========================================

danger_start_time = None
pump_running = False
pump_start_time = None


print("================================")
print("SIDS SAFE AI")
print("YOLO + Arduino Pump Controller")
print("================================")
print()
print("Arduino :", ARDUINO_IP)
print("카메라 시작")
print()


# ==========================================
# 메인 루프
# ==========================================

while True:

    ret, frame = cap.read()

    if not ret:
        print("카메라 프레임을 받을 수 없습니다.")
        break


    # ======================================
    # YOLO 추론
    # ======================================

    results = model(frame, verbose=False)


    detected_posture = None
    confidence = 0


    for result in results:

        if result.boxes is None:
            continue

        for box in result.boxes:

            cls = int(box.cls[0])
            conf = float(box.conf[0])

            posture = model.names[cls]

            if conf > confidence:

                confidence = conf
                detected_posture = posture


    # ======================================
    # 결과 출력
    # ======================================

    if detected_posture is not None:

        print(
            f"자세: {detected_posture} "
            f"| confidence: {confidence:.2f}"
        )

    else:

        print("자세 감지 안 됨")


    # ======================================
    # 위험 자세 판단
    # ======================================

    is_danger = (
        detected_posture in DANGER_POSTURES
        and confidence >= 0.70
    )


    # ======================================
    # 위험 자세가 발견됨
    # ======================================

    if is_danger:

        if danger_start_time is None:

            danger_start_time = time.time()

            print("⚠️ 위험 자세 감지 시작")


        danger_duration = time.time() - danger_start_time


        print(
            f"⚠️ 위험 지속시간: "
            f"{danger_duration:.1f}초"
        )


        # ==================================
        # 3초 이상 위험하면 펌프 ON
        # ==================================

        if danger_duration >= DANGER_TIME:

            if not pump_running:

                print()
                print("🚨🚨 위험 자세 확정 🚨🚨")
                print("💨 방석 팽창 시작")

                success = pump_on()

                if success:

                    pump_running = True
                    pump_start_time = time.time()


    # ======================================
    # 안전한 자세
    # ======================================

    else:

        if danger_start_time is not None:

            print("✅ 위험 자세 해제")

        danger_start_time = None


    # ======================================
    # 펌프 작동 시간 확인
    # ======================================

    if pump_running:

        pump_duration = time.time() - pump_start_time


        if pump_duration >= PUMP_TIME:

            print()
            print("🛑 방석 팽창 시간 종료")
            print("펌프 OFF")

            pump_off()

            pump_running = False
            pump_start_time = None


    # ======================================
    # 종료
    # ======================================

    cv2.imshow("SIDS SAFE AI", frame)


    key = cv2.waitKey(1) & 0xFF


    if key == ord("q"):

        print()
        print("프로그램 종료")

        pump_off()

        break


# ==========================================
# 종료 처리
# ==========================================

cap.release()
cv2.destroyAllWindows()

pump_off()

print("프로그램 종료 완료")