import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Emergency.css";

function Emergency() {
  const navigate = useNavigate();

  // =================================
  // 대응 단계
  // 0 = 3초 감지
  // 1 = 대응 시작
  // 2 = SCARA 로봇
  // 3 = 능동형 매트
  // 4 = 보호자 알림
  // 5 = 대응 완료
  // =================================

  const [responseStep, setResponseStep] = useState(0);

  const [riskScore] = useState(92);

  // =================================
  // 알람 상태
  // =================================

  const [isAlarmPlaying, setIsAlarmPlaying] = useState(true);

  const alarmRef = useRef(null);


  // =================================
  // 위험 감지 기록 저장
  // =================================

  useEffect(() => {

    const savedHistory =
      JSON.parse(localStorage.getItem("sidsHistory")) || [];

    const emergencySession =
      sessionStorage.getItem("sidsEmergencySaved");

    if (emergencySession === "true") {
      return;
    }

    const now = new Date();

    const date = now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const time = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newHistory = {
      id: Date.now(),
      title: "위험 자세 감지",
      description: "아기의 위험 자세가 감지되었습니다.",
      risk: riskScore,
      date: date,
      time: time,
    };

    const updatedHistory = [
      newHistory,
      ...savedHistory,
    ];

    localStorage.setItem(
      "sidsHistory",
      JSON.stringify(updatedHistory.slice(0, 20))
    );

    sessionStorage.setItem(
      "sidsEmergencySaved",
      "true"
    );

  }, [riskScore]);


  // =================================
  // 🚨 알람 시작
  // =================================

  useEffect(() => {

    const alarm = new Audio("/sounds/alarm.mp3");

    alarm.loop = true;
    alarm.volume = 0.8;

    alarmRef.current = alarm;

    alarm.play()
      .then(() => {

        console.log("🚨 긴급 알람 재생 시작");

        setIsAlarmPlaying(true);

      })
      .catch((error) => {

        console.log(
          "⚠️ 알람 자동재생이 차단되었습니다.",
          error
        );

        setIsAlarmPlaying(false);

      });


    return () => {

      alarm.pause();

      alarm.currentTime = 0;

      alarmRef.current = null;

    };

  }, []);


  // =================================
  // 🔇 보호자 확인 / 알람 종료
  // =================================

  const handleStopAlarm = () => {

    if (alarmRef.current) {

      alarmRef.current.pause();

      alarmRef.current.currentTime = 0;

    }

    setIsAlarmPlaying(false);

    console.log("✓ 보호자 확인 완료");

  };


  // =================================
  // 자동 대응 진행
  // =================================

  useEffect(() => {

    setResponseStep(0);

    const timer1 = setTimeout(() => {
      setResponseStep(1);
    }, 1000);

    const timer2 = setTimeout(() => {
      setResponseStep(2);
    }, 2000);

    const timer3 = setTimeout(() => {
      setResponseStep(3);
    }, 3000);

    const timer4 = setTimeout(() => {
      setResponseStep(4);
    }, 4000);

    const timer5 = setTimeout(() => {
      setResponseStep(5);
    }, 5000);

    return () => {

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);

    };

  }, []);


  // =================================
  // 정상 상태 복귀
  // =================================

  const handleRecovery = () => {

    if (alarmRef.current) {

      alarmRef.current.pause();

      alarmRef.current.currentTime = 0;

    }

    navigate("/home");

  };


  // =================================
  // 진행 단계 상태
  // =================================

  const getStepStatus = (step) => {

    if (responseStep > step) {
      return "complete";
    }

    if (responseStep === step) {
      return "active";
    }

    return "waiting";

  };


  return (
    <div className="emergency-page">

      {/* =================================
          Header
      ================================= */}

      <header className="emergency-header">

        <div className="emergency-logo">
          🚨
        </div>

        <div>

          <h1>
            위험 상황 감지
          </h1>

          <p>
            SIDS SAFE AI 긴급 대응 시스템
          </p>

        </div>

      </header>


      {/* =================================
          Main Alert
      ================================= */}

      <section className="emergency-alert-card">

        <div className="alert-icon">
          !
        </div>

        <div className="alert-content">

          <span className="alert-label">
            AI 위험 감지
          </span>

          <h2>
            아기의 위험 자세가 감지되었습니다.
          </h2>

          <p>
            위험 자세가 지속되어 자동 대응 시스템이 작동합니다.
          </p>

        </div>

        <div className="risk-score">

          <span>
            위험도
          </span>

          <strong>
            {riskScore}%
          </strong>

        </div>

      </section>


      {/* =================================
          보호자 알림
      ================================= */}

      <section
        className={
          isAlarmPlaying
            ? "emergency-alarm-card alarm-active"
            : "emergency-alarm-card alarm-confirmed"
        }
      >

        {isAlarmPlaying ? (

          <>
            <div className="alarm-status">

              <div className="alarm-sound-icon">
                🔊
              </div>

              <div className="alarm-info">

                <strong>
                  긴급 알림음 재생 중
                </strong>

                <span>
                  위험 상황이 감지되었습니다.
                  보호자가 상황을 확인해주세요.
                </span>

              </div>

            </div>


            <button
              className="alarm-stop-button"
              onClick={handleStopAlarm}
            >
              🔇 보호자 확인 · 알람 종료
            </button>
          </>

        ) : (

          <div className="alarm-confirmed-content">

            <div className="alarm-confirmed-icon">
              ✓
            </div>

            <div className="alarm-info">

              <strong>
                보호자 확인 완료
              </strong>

              <span>
                긴급 알림이 종료되었습니다.
              </span>

            </div>

          </div>

        )}

      </section>


      {/* =================================
          AI 분석 결과
      ================================= */}

      <section className="emergency-section">

        <div className="emergency-section-title">

          <h2>
            AI 분석 결과
          </h2>

          <span className="analysis-complete">
            분석 완료
          </span>

        </div>


        <div className="analysis-grid">

          <div className="analysis-card">

            <div className="analysis-icon">
              👶
            </div>

            <div>

              <span>
                얼굴 상태
              </span>

              <strong className="danger-text">
                위험
              </strong>

            </div>

          </div>


          <div className="analysis-card">

            <div className="analysis-icon">
              ↔️
            </div>

            <div>

              <span>
                자세 상태
              </span>

              <strong className="danger-text">
                위험 자세
              </strong>

            </div>

          </div>


          <div className="analysis-card">

            <div className="analysis-icon">
              🤖
            </div>

            <div>

              <span>
                AI 감지
              </span>

              <strong className="normal-text">
                정상 작동
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* =================================
          AI 대응 진행
      ================================= */}

      <section className="emergency-section">

        <div className="emergency-section-title">

          <h2>
            AI 대응 진행
          </h2>

          <span
            className={
              responseStep >= 5
                ? "response-complete"
                : "response-active"
            }
          >
            {responseStep >= 5
              ? "대응 완료"
              : "자동 대응 중"}
          </span>

        </div>


        <div className="response-progress-card">

          <div className="progress-line">

            <div
              className="progress-line-fill"
              style={{
                width: `${Math.min(
                  (responseStep / 5) * 100,
                  100
                )}%`,
              }}
            />

          </div>


          {/* 3초 감지 */}

          <div
            className={`progress-step ${getStepStatus(0)}`}
          >

            <div className="progress-icon">

              {responseStep > 0
                ? "✓"
                : "⏱️"}

            </div>

            <strong>
              3초 감지
            </strong>

            <span>

              {responseStep > 0
                ? "확인 완료"
                : "위험 자세 확인"}

            </span>

          </div>


          {/* 대응 시작 */}

          <div
            className={`progress-step ${getStepStatus(1)}`}
          >

            <div className="progress-icon">

              {responseStep > 1
                ? "✓"
                : responseStep === 1
                  ? "⚡"
                  : "○"}

            </div>

            <strong>
              대응 시작
            </strong>

            <span>

              {responseStep >= 1
                ? "자동 대응 시작"
                : "대기 중"}

            </span>

          </div>


          {/* SCARA */}

          <div
            className={`progress-step ${getStepStatus(2)}`}
          >

            <div className="progress-icon">

              {responseStep > 2
                ? "✓"
                : responseStep === 2
                  ? "🦾"
                  : "○"}

            </div>

            <strong>
              SCARA
            </strong>

            <span>

              {responseStep > 2
                ? "동작 완료"
                : responseStep === 2
                  ? "작동 중"
                  : "대기 중"}

            </span>

          </div>


          {/* 능동형 매트 */}

          <div
            className={`progress-step ${getStepStatus(3)}`}
          >

            <div className="progress-icon">

              {responseStep > 3
                ? "✓"
                : responseStep === 3
                  ? "🛏️"
                  : "○"}

            </div>

            <strong>
              능동형 매트
            </strong>

            <span>

              {responseStep > 3
                ? "작동 완료"
                : responseStep === 3
                  ? "작동 중"
                  : "대기 중"}

            </span>

          </div>


          {/* 보호자 알림 */}

          <div
            className={`progress-step ${getStepStatus(4)}`}
          >

            <div className="progress-icon">

              {responseStep >= 5
                ? "✓"
                : responseStep === 4
                  ? "🔊"
                  : "○"}

            </div>

            <strong>
              보호자 알림
            </strong>

            <span>

              {responseStep >= 5
                ? "전송 완료"
                : responseStep === 4
                  ? "알림 전송 중"
                  : "대기 중"}

            </span>

          </div>

        </div>

      </section>


      {/* =================================
          자동 대응 상태
      ================================= */}

      <section className="emergency-section">

        <div className="emergency-section-title">

          <h2>
            자동 대응 상태
          </h2>

        </div>


        <div className="response-card">

          {/* SCARA */}

          <div className="response-item">

            <div className="response-icon">
              🦾
            </div>

            <div className="response-info">

              <strong>
                SCARA 로봇
              </strong>

              <span>

                {responseStep >= 3
                  ? "위험 대응 동작 완료"
                  : responseStep >= 2
                    ? "위험 대응 동작 실행 중"
                    : "대기 중"}

              </span>

            </div>

            <div
              className={
                responseStep >= 3
                  ? "response-status complete"
                  : responseStep === 2
                    ? "response-status active"
                    : "response-status waiting"
              }
            >

              {responseStep >= 3
                ? "완료 ✓"
                : responseStep === 2
                  ? "작동 중"
                  : "대기"}

            </div>

          </div>


          {/* 능동형 매트 */}

          <div className="response-item">

            <div className="response-icon">
              🛏️
            </div>

            <div className="response-info">

              <strong>
                능동형 매트
              </strong>

              <span>

                {responseStep >= 4
                  ? "안전 공간 확보 완료"
                  : responseStep === 3
                    ? "안전 공간 확보 중"
                    : "대기 중"}

              </span>

            </div>

            <div
              className={
                responseStep >= 4
                  ? "response-status complete"
                  : responseStep === 3
                    ? "response-status active"
                    : "response-status waiting"
              }
            >

              {responseStep >= 4
                ? "완료 ✓"
                : responseStep === 3
                  ? "작동 중"
                  : "대기"}

            </div>

          </div>


          {/* 보호자 알림 */}

          <div className="response-item">

            <div className="response-icon">
              🔊
            </div>

            <div className="response-info">

              <strong>
                보호자 알림
              </strong>

              <span>

                {responseStep >= 5
                  ? "긴급 알림이 전송되었습니다."
                  : responseStep === 4
                    ? "보호자에게 긴급 알림 전송 중"
                    : "대기 중"}

              </span>

            </div>

            <div
              className={
                responseStep >= 5
                  ? "response-status complete"
                  : responseStep === 4
                    ? "response-status active"
                    : "response-status waiting"
              }
            >

              {responseStep >= 5
                ? "전송 완료 ✓"
                : responseStep === 4
                  ? "전송 중"
                  : "대기"}

            </div>

          </div>

        </div>

      </section>


      {/* =================================
          대응 완료
      ================================= */}

      {responseStep >= 5 && (

        <section className="recovery-card">

          <div className="recovery-icon">
            ✓
          </div>

          <div className="recovery-info">

            <strong>
              위험 대응이 완료되었습니다.
            </strong>

            <span>
              SCARA 로봇과 능동형 매트의 대응이 완료되었습니다.
            </span>

          </div>

          <button
            className="recovery-button"
            onClick={handleRecovery}
          >
            🏠 정상 상태로 돌아가기
          </button>

        </section>

      )}


      {/* =================================
          Footer
      ================================= */}

      <div className="emergency-footer">

        <span>
          SIDS SAFE AI · 위험 상황 자동 대응 시스템
        </span>

      </div>

    </div>
  );
}

export default Emergency;