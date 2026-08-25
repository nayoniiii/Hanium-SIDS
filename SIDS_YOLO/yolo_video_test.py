from ultralytics import YOLO
from danger_detector import DangerDetector
import cv2


# ========================================
# 설정
# ========================================

MODEL_PATH = "best.pt"
VIDEO_PATH = "test_video2.mp4"

CONFIDENCE_THRESHOLD = 0.30


# ========================================
# YOLO 모델
# ========================================

model = YOLO(MODEL_PATH)


# ========================================
# 위험 판단기
# ========================================

detector = DangerDetector(
    danger_pose="prone",
    danger_seconds=3.0
)


# ========================================
# 영상 열기
# ========================================

cap = cv2.VideoCapture(VIDEO_PATH)

if not cap.isOpened():
    print("❌ 영상을 열 수 없습니다.")
    exit()


fps = cap.get(cv2.CAP_PROP_FPS)

if fps <= 0:
    fps = 30


print("================================")
print(" SIDS YOLO 영상 위험 판단 테스트")
print("================================")
print()

print(f"영상 FPS: {fps:.1f}")
print()

danger_triggered = False


# ========================================
# 프레임별 처리
# ========================================

while True:

    ret, frame = cap.read()

    if not ret:
        break


    # YOLO 실행
    results = model(frame, verbose=False)


    best_pose = None
    best_confidence = 0.0


    # ====================================
    # 가장 높은 신뢰도 결과 찾기
    # ====================================

    for result in results:

        if result.boxes is None:
            continue


        # for box in result.boxes:

        #     confidence = float(box.conf[0])

        #     if confidence > best_confidence:

        #         best_confidence = confidence

        #         class_id = int(box.cls[0])

        #         best_pose = model.names[class_id]
        for box in result.boxes:

            confidence = float(box.conf[0])

            class_id = int(box.cls[0])

            pose_name = model.names[class_id]

            print(
                f"감지: {pose_name} "
                f"{confidence * 100:.1f}%"
            )

            if confidence > best_confidence:

                best_confidence = confidence
                best_pose = pose_name


    # ====================================
    # 신뢰도 검사
    # ====================================

    if (
        best_pose is not None
        and best_confidence >= CONFIDENCE_THRESHOLD
    ):

        pose = best_pose

    else:

        pose = None


    # ====================================
    # 위험 판단
    # ====================================

    danger_result = detector.update(pose)


    # ====================================
    # 화면에 정보 표시
    # ====================================

    if pose is None:

        text = "NO DETECTION"

    else:

        text = (
            f"{pose} "
            f"{best_confidence * 100:.1f}%"
        )


    cv2.putText(
        frame,
        text,
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )


    # 경과시간 표시

    cv2.putText(
        frame,
        f"Danger Time: {danger_result['elapsed']:.1f}s",
        (20, 80),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 255, 255),
        2
    )


    # ====================================
    # 위험 발생
    # ====================================

    if danger_result["danger"]:

        cv2.putText(
            frame,
            "DANGER!",
            (20, 130),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 0, 255),
            3
        )


        if not danger_triggered:

            print()
            print("🚨🚨🚨 위험 자세 감지! 🚨🚨🚨")
            print("SCARA 안전 조치를 실행해야 합니다.")
            print()

            danger_triggered = True


    else:

        danger_triggered = False


    # ====================================
    # 영상 표시
    # ====================================

    cv2.imshow(
        "SIDS YOLO Test",
        frame
    )


    # ESC 누르면 종료

    key = cv2.waitKey(1) & 0xFF

    if key == 27:
        break


# ========================================
# 종료
# ========================================

cap.release()

cv2.destroyAllWindows()

print()
print("================================")
print("영상 테스트 종료")
print("================================")