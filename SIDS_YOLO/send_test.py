import requests

PI_IP = "192.168.123.33"

print("================================")
print(" Raspberry Pi 위험 신호 테스트")
print("================================")
print()

print("🍓 라즈베리파이에 위험 신호를 보내는 중...")

response = requests.post(
    f"http://{PI_IP}:5000/danger",
    json={
        "danger": True,
        "pose": "prone",
        "confidence": 0.77
    },
    timeout=5
)

print()
print("✅ 라즈베리파이 응답:")
print(response.json())