from ultralytics import YOLO
import requests
import threading
import time
import cv2


# ==========================================
# 설정
# ==========================================

MODEL_PATH = "best.pt"


# ==========================================
# 라즈베리파이 카메라
# ==========================================

RASPBERRY_PI_IP = "192.168.137.95"

CAMERA_URL = (
    f"http://{RASPBERRY_PI_IP}:8080/?action=stream"
)


# ==========================================
# Flask 서버
# ==========================================

SERVER_URL = "http://127.0.0.1:5000/detection"


# ==========================================
# Arduino 펌프
# ==========================================

ARDUINO_IP = "192.168.137.78"

PUMP_ON_URL = (
    f"http://{ARDUINO_IP}/pump/on"
)

PUMP_OFF_URL = (
    f"http://{ARDUINO_IP}/pump/off"
)


# ==========================================
# 폰 푸시 알림 (ntfy)
# ==========================================

# 폰의 ntfy 앱에서 구독한 채널 이름과 똑같이 적기
# 다른 사람이 추측하지 못하게 길고 랜덤하게 정하기
NTFY_TOPIC = "sids-safe-hy7k2m9q"

NTFY_URL = "https://ntfy.sh/"

# 위험이 계속되는 동안 몇 초마다 알림을 다시 보낼지
PUSH_REPEAT_INTERVAL = 10.0


# ==========================================
# 위험 자세 설정
# ==========================================

DANGER_POSTURES = ["prone"]

# 옆으로 누운 자세까지 위험하게 하려면
# DANGER_POSTURES = ["prone", "side"]


# 위험 자세가 지속되어야 하는 시간
DANGER_TIME = 3.0

# YOLO가 잠깐 자세를 놓쳐도 유지할 시간
GRACE_TIME = 1.0

# YOLO 최소 신뢰도
CONFIDENCE_THRESHOLD = 0.70


# ==========================================
# Arduino 펌프 ON
# ==========================================

def pump_on():

    try:

        response = requests.get(
            PUMP_ON_URL,
            timeout=1
        )

        if response.status_code == 200:

            print("💨 PUMP ON")

            return True

        print(
            "⚠️ 펌프 ON 요청 실패:",
            response.status_code
        )

    except requests.exceptions.RequestException as e:

        print(
            "❌ Arduino 연결 실패:",
            e
        )

    return False


# ==========================================
# Arduino 펌프 OFF
# ==========================================

def pump_off():

    try:

        response = requests.get(
            PUMP_OFF_URL,
            timeout=1
        )

        if response.status_code == 200:

            print("🛑 PUMP OFF")

            return True

        print(
            "⚠️ 펌프 OFF 요청 실패:",
            response.status_code
        )

    except requests.exceptions.RequestException as e:

        print(
            "❌ Arduino 연결 실패:",
            e
        )

    return False


# ==========================================
# 폰 푸시 알림 보내기
# ==========================================

def _send_push(posture, confidence, count, elapsed):

    if count == 1:

        title = "🚨 SIDS SAFE 위험 감지"

        message = (
            f"아기가 위험 자세({posture})로 "
            f"{DANGER_TIME:.0f}초 이상 유지되었습니다.\n"
            f"AI 신뢰도 {confidence * 100:.0f}% · "
            f"방석 팽창을 시작했습니다.\n"
            f"지금 바로 아기를 확인해 주세요."
        )

    else:

        title = f"🚨🚨 [{count}번째 경고] 위험 상태 계속됨"

        message = (
            f"위험 자세가 {elapsed:.0f}초째 계속되고 있습니다!\n"
            f"아직 해결되지 않았습니다.\n"
            f"지금 즉시 아기를 확인해 주세요!"
        )

    try:

        response = requests.post(

            NTFY_URL,

            json={

                "topic": NTFY_TOPIC,

                "title": title,

                "message": message,

                # 5 = 최고 우선순위 (화면 꺼져도 팝업 + 긴 진동)
                "priority": 5,

                "tags": ["rotating_light", "baby"]

            },

            timeout=3

        )

        if response.status_code == 200:

            print(f"📱 폰 알림 전송 성공 ({count}번째)")

        else:

            print(
                "⚠️ 폰 알림 전송 실패:",
                response.status_code
            )

    except requests.exceptions.RequestException as e:

        print(
            "❌ 폰 알림 서버 연결 실패:",
            e
        )


def send_push_alert(posture, confidence, count, elapsed):

    # 알림 전송 때문에 YOLO 루프가 멈추지 않도록
    # 별도 스레드에서 보낸다
    threading.Thread(

        target=_send_push,

        args=(posture, confidence, count, elapsed),

        daemon=True

    ).start()


# ==========================================
# Flask 전송
# ==========================================

def send_detection(
    posture,
    confidence,
    danger,
    pump,
    warning=False,
    elapsed=0.0
):

    try:

        data = {

            "posture": posture,

            "confidence": confidence * 100,

            "danger": danger,

            "pump": pump,

            "warning": warning,

            "elapsed": round(elapsed, 1)

        }

        response = requests.post(
            SERVER_URL,
            json=data,
            timeout=1
        )

        if response.status_code == 200:

            print(
                f"📡 Flask 전송 성공 "
                f"| 자세={posture} "
                f"| danger={danger} "
                f"| pump={pump}"
            )

        else:

            print(
                "⚠️ Flask 서버 전송 실패:",
                response.status_code
            )

    except requests.exceptions.RequestException as e:

        print(
            "❌ Flask 서버 연결 실패:",
            e
        )


# ==========================================
# YOLO 모델
# ==========================================

print()
print("YOLO 모델을 불러오는 중...")

model = YOLO(MODEL_PATH)

print("✅ YOLO 모델 로딩 완료")


# ==========================================
# 카메라 연결
# ==========================================

print()
print("라즈베리파이 카메라 연결 중...")
print("Camera URL:", CAMERA_URL)

cap = cv2.VideoCapture(CAMERA_URL)


if not cap.isOpened():

    print()
    print("❌ 라즈베리파이 카메라 연결 실패")
    print()
    print("확인할 것:")
    print("1. 라즈베리파이 전원이 켜져 있는지")
    print("2. mjpg-streamer가 실행 중인지")
    print("3. 라즈베리파이 IP가 맞는지")
    print()

    exit()


print("✅ 라즈베리파이 카메라 연결 성공!")


# ==========================================
# 위험 상태 변수
# ==========================================

danger_start_time = None

last_danger_detection_time = None

danger_confirmed = False

pump_running = False

# 반복 알림용
last_push_time = None

push_count = 0


# ==========================================
# 시작 메시지
# ==========================================

print()
print("================================")
print("SIDS SAFE AI")
print("YOLO + Raspberry Pi Camera")
print("+ Flask Server")
print("+ Arduino Pump Controller")
print("================================")
print()

print("라즈베리파이 :", RASPBERRY_PI_IP)
print("Flask Server :", SERVER_URL)
print("Arduino :", ARDUINO_IP)

print()
print("🚀 SIDS SAFE AI 시작")
print()


# ==========================================
# 메인 루프
# ==========================================

while True:

    # ======================================
    # 카메라 프레임
    # ======================================

    ret, frame = cap.read()

    if not ret:

        print(
            "❌ 라즈베리파이 카메라 "
            "프레임을 받을 수 없습니다."
        )

        break


    # ======================================
    # YOLO 추론
    # ======================================

    results = model(
        frame,
        verbose=False
    )


    detected_posture = None

    confidence = 0


    # ======================================
    # YOLO 결과 확인
    # ======================================

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


    current_time = time.time()


    # ======================================
    # 현재 위험 자세인지 확인
    # ======================================

    is_danger = (

        detected_posture in DANGER_POSTURES

        and

        confidence >= CONFIDENCE_THRESHOLD

    )


    # ======================================
    # 위험 자세 감지
    # ======================================

    if is_danger:

        print(
            f"⚠️ 자세: {detected_posture} "
            f"| confidence: {confidence:.2f}"
        )


        # ----------------------------------
        # 위험 시작
        # ----------------------------------

        if danger_start_time is None:

            danger_start_time = current_time

            print()
            print("⚠️ 위험 자세 감지 시작")


        # 마지막으로 위험 자세를 본 시간
        last_danger_detection_time = current_time


        # ----------------------------------
        # 위험 지속 시간
        # ----------------------------------

        danger_duration = (

            current_time
            - danger_start_time

        )


        print(
            f"⚠️ 위험 지속시간: "
            f"{danger_duration:.1f}초"
        )


        # ==================================
        # 3초 이상 위험하면 위험 확정
        # ==================================

        if danger_duration >= DANGER_TIME:

            # 처음 위험 확정되는 순간
            if not danger_confirmed:

                print()
                print("🚨🚨 위험 자세 확정 🚨🚨")
                print("💨 방석 팽창 시작")

                danger_confirmed = True


                # 위험 확정 순간 첫 번째 폰 알림
                push_count = 1

                last_push_time = current_time

                send_push_alert(

                    detected_posture,

                    confidence,

                    push_count,

                    danger_duration

                )


            # ==================================
            # 위험이 계속되면 10초마다 반복 알림
            # ==================================

            elif (
                current_time - last_push_time
                >= PUSH_REPEAT_INTERVAL
            ):

                push_count += 1

                last_push_time = current_time

                send_push_alert(

                    detected_posture,

                    confidence,

                    push_count,

                    danger_duration

                )


            # ==================================
            # 위험 자세가 계속되는 동안
            # 펌프가 꺼져 있다면 ON
            # ==================================

            if not pump_running:

                success = pump_on()


                if success:

                    pump_running = True

                    print(
                        "💨 위험 자세 유지 중"
                    )

                    print(
                        "💨 펌프 계속 작동"
                    )


            # ==================================
            # Flask
            # ==================================

            send_detection(

                detected_posture,

                confidence,

                True,

                pump_running,

                warning=True,

                elapsed=danger_duration

            )


        # ==================================
        # 아직 3초 전
        # ==================================

        else:

            # 3초 전에는 "주의(warning)"만 보내고
            # danger는 False로 보낸다
            send_detection(

                detected_posture,

                confidence,

                False,

                False,

                warning=True,

                elapsed=danger_duration

            )


    # ======================================
    # 위험 자세가 아닌 경우
    # ======================================

    else:

        if detected_posture is not None:

            print(
                f"✅ 자세: {detected_posture} "
                f"| confidence: {confidence:.2f}"
            )

        else:

            print(
                "자세 감지 안 됨"
            )


        # ==================================
        # 위험 상태였던 경우
        # ==================================

        if danger_confirmed:

            # 마지막 위험 감지 이후 경과 시간
            if last_danger_detection_time is not None:

                missed_time = (

                    current_time
                    - last_danger_detection_time

                )


                print(
                    f"⏳ 위험 자세 확인 대기 "
                    f"| {missed_time:.1f}초"
                )


                # ----------------------------------
                # 1초 이상 위험 자세가 안 보이면
                # 안전 상태로 판단
                # ----------------------------------

                if missed_time >= GRACE_TIME:

                    print()
                    print("✅ 안전 상태 확인")
                    print("🛑 펌프 OFF")


                    # 펌프가 켜져 있다면 OFF
                    if pump_running:

                        pump_off()

                        pump_running = False


                    # 위험 상태 초기화
                    danger_start_time = None

                    last_danger_detection_time = None

                    danger_confirmed = False

                    # 반복 알림 초기화
                    last_push_time = None

                    push_count = 0


                    # Flask에 안전 상태 전달
                    send_detection(

                        detected_posture
                        if detected_posture is not None
                        else "unknown",

                        confidence,

                        False,

                        False

                    )


        else:

            # 아직 위험 확정 전이면
            # 안전 상태로 전송

            send_detection(

                detected_posture
                if detected_posture is not None
                else "unknown",

                confidence,

                False,

                False

            )


# ==========================================
# 종료 처리
# ==========================================

cap.release()


if pump_running:

    pump_off()


print()
print("================================")
print("SIDS SAFE AI 종료 완료")
print("================================")