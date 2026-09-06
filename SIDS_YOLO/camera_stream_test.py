import cv2

url = "http://192.168.137.95:8080/?action=stream"

cap = cv2.VideoCapture(url)

if not cap.isOpened():
    print("❌ 라즈베리파이 카메라 연결 실패")
    exit()

print("✅ 라즈베리파이 카메라 연결 성공!")

while True:

    ret, frame = cap.read()

    if not ret:
        print("❌ 영상 프레임을 받을 수 없습니다.")
        break

    cv2.imshow("Raspberry Pi Camera", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()