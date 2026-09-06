import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Camera.css";

function Camera() {
  const navigate = useNavigate();

  // =================================
  // 상태
  // =================================

  const [isDangerDetected, setIsDangerDetected] = useState(false);
  const [posture, setPosture] = useState("supine");
  const [confidence, setConfidence] = useState(0);

  const [serverConnected, setServerConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // =================================
  // 위험 이벤트 처리
  // =================================

  // 같은 danger=True에 대해
  // 화면/음성이 여러 번 실행되지 않도록 함
  const dangerHandledRef = useRef(false);

  // 음성 객체
  const alarmRef = useRef(null);


  // =================================
  // 알람 음성 준비
  // =================================

  useEffect(() => {
    alarmRef.current = new Audio("/sounds/alarm.mp3");

    alarmRef.current.volume = 0.8;
    alarmRef.current.preload = "auto";

    return () => {
      if (alarmRef.current) {
        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;
      }
    };
  }, []);


  // =================================
  // Flask 감지 결과 가져오기
  // =================================

  useEffect(() => {
    const fetchDetection = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/detection"
        );

        if (!response.ok) {
          throw new Error("서버 응답 오류");
        }

        const data = await response.json();

        console.log("📡 Flask 결과:", data);


        // =================================
        // 서버 연결 상태
        // =================================

        setServerConnected(true);


        // =================================
        // YOLO 결과
        // =================================

        setPosture(data.posture || "supine");

        setConfidence(
          typeof data.confidence === "number"
            ? data.confidence
            : 0
        );

        setLastUpdate(new Date());


        // =================================
        // ★ 핵심
        // Flask의 danger를 기준으로 판단
        // =================================

        if (data.danger === true) {

          setIsDangerDetected(true);


          // =================================
          // 위험 확정 이벤트
          // =================================

          if (!dangerHandledRef.current) {

            console.log(
              "🚨 위험 확정 신호 수신!"
            );

            console.log(
              "🚨 Emergency 화면으로 이동"
            );

            dangerHandledRef.current = true;


            // =================================
            // 🔊 알람 음성
            // =================================

            if (alarmRef.current) {

              try {

                alarmRef.current.currentTime = 0;

                alarmRef.current
                  .play()
                  .then(() => {
                    console.log(
                      "🔊 위험 알람 재생"
                    );
                  })
                  .catch((error) => {

                    console.warn(
                      "⚠️ 알람 재생 실패:",
                      error
                    );

                  });

              } catch (error) {

                console.error(
                  "❌ 음성 재생 오류:",
                  error
                );

              }
            }


            // =================================
            // Emergency 화면 이동
            // =================================

            sessionStorage.removeItem(
              "sidsEmergencySaved"
            );

            navigate("/emergency");
          }

        } else {

          // =================================
          // 안전 상태
          // =================================

          setIsDangerDetected(false);


          // 다음 위험 이벤트를 받을 수 있도록
          // 위험 처리 상태 초기화
          dangerHandledRef.current = false;
        }


      } catch (error) {

        console.error(
          "❌ Flask 서버 연결 실패:",
          error
        );

        setServerConnected(false);
      }
    };


    // 처음 실행
    fetchDetection();


    // 1초마다 Flask 확인
    const interval = setInterval(
      fetchDetection,
      1000
    );


    // 페이지 종료 시 정리
    return () => {
      clearInterval(interval);
    };

  }, [navigate]);


  // =================================
  // 자세 이름
  // =================================

  const getPostureText = () => {

    if (posture === "prone") {
      return "엎드린 자세";
    }

    if (posture === "side") {
      return "옆으로 누움";
    }

    return "바로 누움";
  };


  // =================================
  // 위험도 상태
  // =================================

  const getRiskLevel = () => {

    if (posture === "prone") {
      return "위험";
    }

    if (posture === "side") {
      return "주의";
    }

    return "안전";
  };


  // =================================
  // 마지막 업데이트
  // =================================

  const getLastUpdateText = () => {

    if (!lastUpdate) {
      return "확인 중";
    }

    return `${lastUpdate.getHours()
      .toString()
      .padStart(2, "0")}:${lastUpdate
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${lastUpdate
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;
  };


  // =================================
  // 화면
  // =================================

  return (
    <div className="camera-page">

      {/* ================================
          Header
      ================================= */}

      <header className="camera-header">

        <div className="camera-title">

          <div className="camera-title-icon">
            📷
          </div>

          <div>

            <h1>
              실시간 AI 감지
            </h1>

            <p>
              카메라 영상을 기반으로 아기의 자세를 실시간 분석합니다.
            </p>

          </div>

        </div>


        <div className="live-status">

          <span className="live-dot"></span>

          LIVE

        </div>

      </header>


      {/* ================================
          Camera Feed
      ================================= */}

      <section className="camera-feed-card">

        <div
          className={`camera-feed ${
            isDangerDetected
              ? "camera-feed-danger"
              : ""
          }`}
        >

          <div className="camera-video-container">

            <img
              src="http://192.168.137.95:8080/?action=stream"
              alt="실시간 카메라 영상"
              className="camera-video"
            />

          </div>


          {/* AI 상태 표시 */}

          <div className="ai-camera-badge">

            <span className="ai-pulse"></span>

            AI 분석 중

          </div>


          {/* Camera Overlay */}

          <div className="camera-overlay">

            <span>

              {isDangerDetected
                ? "⚠ 위험 자세 확정"
                : "● AI 실시간 감지"}

            </span>

            <span>
              640 × 480 · 30 FPS
            </span>

          </div>


          {/* 현재 자세 HUD */}

          <div className="camera-posture-hud">

            <span>
              현재 자세
            </span>

            <strong>
              {getPostureText()}
            </strong>

          </div>

        </div>

      </section>


      {/* ================================
          AI Analysis
      ================================= */}

      <section className="camera-section">

        <div className="camera-section-header">

          <h2>
            AI 분석 상태
          </h2>

          <span
            className={`analysis-running ${
              isDangerDetected
                ? "analysis-danger"
                : ""
            }`}
          >

            {isDangerDetected
              ? "🚨 위험 확정"
              : "● 정상 분석 중"}

          </span>

        </div>


        <div className="camera-analysis-grid">


          {/* Face */}

          <div className="camera-analysis-card">

            <div className="camera-analysis-icon">
              👶
            </div>

            <div>

              <span>
                감지 상태
              </span>

              <strong className="status-normal">

                {serverConnected
                  ? "정상 작동"
                  : "연결 확인 중"}

              </strong>

            </div>

          </div>


          {/* Posture */}

          <div
            className={`camera-analysis-card ${
              posture === "prone"
                ? "analysis-card-danger"
                : ""
            }`}
          >

            <div className="camera-analysis-icon">
              🛏️
            </div>

            <div>

              <span>
                자세 분석
              </span>

              <strong
                className={
                  posture === "prone"
                    ? "danger-text"
                    : posture === "side"
                      ? "warning-text"
                      : "status-normal"
                }
              >
                {getPostureText()}
              </strong>

            </div>

          </div>


          {/* Confidence */}

          <div
            className={`camera-analysis-card ${
              posture === "prone"
                ? "analysis-card-danger"
                : ""
            }`}
          >

            <div className="camera-analysis-icon">
              🤖
            </div>

            <div>

              <span>
                AI 감지 신뢰도
              </span>

              <strong
                className={
                  posture === "prone"
                    ? "danger-text"
                    : "risk-normal"
                }
              >

                {confidence.toFixed(1)}%

              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* ================================
          Current Status
      ================================= */}

      <section className="camera-section">

        <div className="camera-section-header">

          <h2>
            현재 안전 상태
          </h2>

        </div>


        <div
          className={`camera-current-status ${
            posture === "prone"
              ? "current-status-danger"
              : posture === "side"
                ? "current-status-warning"
                : ""
          }`}
        >

          <div className="current-status-icon">

            {posture === "prone"
              ? "🚨"
              : posture === "side"
                ? "⚠️"
                : "🛡️"}

          </div>


          <div className="current-status-text">

            <span>
              현재 감지 상태
            </span>


            <strong>

              {posture === "prone"
                ? "위험 자세가 감지되었습니다"
                : posture === "side"
                  ? "주의가 필요한 자세입니다"
                  : "안전한 자세가 감지되고 있습니다"}

            </strong>


            <p>

              {posture === "prone"
                ? isDangerDetected
                  ? "위험 자세가 확정되었습니다. 긴급 대응을 실행합니다."
                  : "위험 자세를 확인하고 있습니다."
                : "AI가 아기의 자세를 계속 확인하고 있습니다."}

            </p>

          </div>

        </div>

      </section>


      {/* ================================
          System Status
      ================================= */}

      <section className="camera-section">

        <div className="camera-section-header">

          <h2>
            시스템 상태
          </h2>

        </div>


        <div className="camera-system-card">

          <div className="camera-system-item">

            <span>
              📷 카메라
            </span>

            <strong className="status-normal">
              연결됨
            </strong>

          </div>


          <div className="camera-system-item">

            <span>
              🤖 AI 분석
            </span>

            <strong className="status-normal">
              작동 중
            </strong>

          </div>


          <div className="camera-system-item">

            <span>
              📡 서버
            </span>

            <strong
              className={
                serverConnected
                  ? "status-normal"
                  : "status-warning"
              }
            >

              {serverConnected
                ? "연결됨"
                : "연결 확인 중"}

            </strong>

          </div>

        </div>


        <div className="camera-last-update">

          마지막 분석 업데이트 · {getLastUpdateText()}

        </div>

      </section>


      {/* ================================
          Bottom Space
      ================================= */}

      <div className="camera-bottom-space"></div>

    </div>
  );
}

export default Camera;