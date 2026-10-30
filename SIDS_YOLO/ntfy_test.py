import requests
import time

# sids_pump_test.py 의 NTFY_TOPIC 과 똑같이 적기
NTFY_TOPIC = "sids-safe-hy7k2m9q"

NTFY_URL = "https://ntfy.sh/"

# 보낼 알림 개수
# 1 = 첫 위험 알림만
# 3 = 첫 알림 + 반복 경고 2번 (실제 반복 알림 흐름 재현)
ALERT_COUNT = 3

# 반복 알림 간격 (초)
REPEAT_INTERVAL = 10

# 알림 문구에 들어갈 값
POSTURE = "엎드림"
CONFIDENCE = 0.92
DANGER_TIME = 3


def send_alert(count, elapsed):

    if count == 1:

        title = "🚨 SIDS SAFE 위험 감지"

        message = (
            f"아기가 위험 자세({POSTURE})로 "
            f"{DANGER_TIME}초 이상 유지되었습니다.\n"
            f"AI 신뢰도 {CONFIDENCE * 100:.0f}% · "
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

    response = requests.post(
        NTFY_URL,
        json={
            "topic": NTFY_TOPIC,
            "title": title,
            "message": message,
            "priority": 5,
            "tags": ["rotating_light", "baby"]
        },
        timeout=5
    )

    if response.status_code == 200:
        print(f"📱 알림 전송 성공 ({count}번째)")
    else:
        print(f"⚠️ 알림 전송 실패 ({count}번째):", response.text)


for i in range(1, ALERT_COUNT + 1):

    elapsed = DANGER_TIME + (i - 1) * REPEAT_INTERVAL

    send_alert(i, elapsed)

    if i < ALERT_COUNT:
        time.sleep(REPEAT_INTERVAL)

print("✅ 완료")