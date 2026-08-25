import time


class DangerDetector:
    def __init__(self, danger_pose="prone", danger_seconds=3.0):
        self.danger_pose = danger_pose
        self.danger_seconds = danger_seconds
        self.danger_start_time = None

    def update(self, pose):
        # YOLO가 사람을 못 찾은 경우
        if pose is None:
            self.danger_start_time = None

            return {
                "pose": None,
                "danger": False,
                "warning": False,
                "elapsed": 0.0
            }

        # 위험 자세가 아닌 경우
        if pose != self.danger_pose:
            self.danger_start_time = None

            return {
                "pose": pose,
                "danger": False,
                "warning": False,
                "elapsed": 0.0
            }

        # 처음 위험 자세가 감지된 순간
        if self.danger_start_time is None:
            self.danger_start_time = time.time()

        elapsed = time.time() - self.danger_start_time

        # 3초 이상 지속
        if elapsed >= self.danger_seconds:
            return {
                "pose": pose,
                "danger": True,
                "warning": True,
                "elapsed": elapsed
            }

        # 아직 3초가 안 됨
        return {
            "pose": pose,
            "danger": False,
            "warning": True,
            "elapsed": elapsed
        }


# ==========================
# 테스트
# ==========================

if __name__ == "__main__":

    detector = DangerDetector(
        danger_pose="prone",
        danger_seconds=3.0
    )

    print("================================")
    print(" SIDS 위험 자세 판단 테스트")
    print("================================")
    print()

    print("prone 자세를 5초 동안 감지합니다.")
    print()

    for i in range(10):

        result = detector.update("prone")

        print(
            f"자세: {result['pose']} | "
            f"경과시간: {result['elapsed']:.1f}초 | "
            f"주의: {result['warning']} | "
            f"위험: {result['danger']}"
        )

        time.sleep(0.5)