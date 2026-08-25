from ultralytics import YOLO
from danger_detector import DangerDetector
import time


# ========================================
# 1. YOLO 모델 불러오기
# ========================================

model = YOLO("best.pt")


# ========================================
# 2. 위험 판단기 만들기
# ========================================

detector = DangerDetector(
    danger_pose="prone",
    danger_seconds=3.0
)


# ========================================
# 3. 테스트 이미지
# ========================================

image_path = "test5.webp"


print("================================")
print(" SIDS YOLO 위험 판단 테스트")
print("================================")
print()


# ========================================
# 4. YOLO 실행
# ========================================

results = model(image_path)


# ========================================
# 5. YOLO 결과 확인
# ========================================

for result in results:

    if result.boxes is None or len(result.boxes) == 0:

        print("❌ 사람을 찾지 못했습니다.")

        detector.update(None)

        continue


    # 가장 신뢰도가 높은 결과 하나 선택
    best_box = None
    best_confidence = 0

    for box in result.boxes:

        confidence = float(box.conf[0])

        if confidence > best_confidence:
            best_confidence = confidence
            best_box = box


    # 클래스 번호
    class_id = int(best_box.cls[0])

    # 클래스 이름
    pose = model.names[class_id]


    print(f"YOLO 자세: {pose}")
    print(f"신뢰도: {best_confidence:.2f}")
    print(f"신뢰도(%): {best_confidence * 100:.1f}%")
    print()


    # ========================================
    # 6. 신뢰도 검사
    # ========================================

    CONFIDENCE_THRESHOLD = 0.70


    if best_confidence < CONFIDENCE_THRESHOLD:

        print("⚠️ 신뢰도가 낮아서 판단하지 않습니다.")

        detector.update(None)

        continue


    print("✅ 신뢰도 통과")
    print()


    # ========================================
    # 7. 위험 판단
    # ========================================

    print("3초 위험 판단을 시작합니다.")
    print()


    # 같은 자세가 계속 들어온다고 가정
    for i in range(8):

        danger_result = detector.update(pose)


        print(
            f"자세: {danger_result['pose']} | "
            f"경과시간: {danger_result['elapsed']:.1f}초 | "
            f"주의: {danger_result['warning']} | "
            f"위험: {danger_result['danger']}"
        )


        # 위험 발생
        if danger_result["danger"]:

            print()
            print("🚨🚨🚨 위험 자세 감지! 🚨🚨🚨")
            print("SCARA 안전 조치를 실행해야 합니다.")
            break


        time.sleep(0.5)


    print()
    print("================================")
    print("테스트 종료")
    print("================================")


    # 결과 이미지 저장
    result.save(filename="result.jpg")

    print()
    print("결과 이미지: result.jpg")