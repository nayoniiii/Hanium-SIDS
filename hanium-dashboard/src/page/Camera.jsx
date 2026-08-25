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

  // 위험 자세 3초 타이머
  const dangerTimerRef = useRef(null);

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

        console.log("Flask 결과:", data);

        // 서버 연결 상태
        setServerConnected(true);

        // YOLO 결과
        setPosture(data.posture || "supine");
        setConfidence(
          typeof data.confidence === "number"
            ? data.confidence
            : 0
        );

        setLastUpdate(new Date());

        // =================================
        // 위험 자세 확인
        // =================================

        if (data.posture === "prone") {
          // 아직 위험 타이머가 없다면 시작
          if (!dangerTimerRef.current) {
            console.log("⚠️ 위험 자세 시작");

            setIsDangerDetected(true);

            dangerTimerRef.current = setTimeout(() => {
              console.log("🚨 위험 자세 3초 지속!");

              sessionStorage.removeItem(
                "sidsEmergencySaved"
              );

              navigate("/emergency");
            }, 3000);
          }
        } else {
          // =================================
          // 정상 자세로 돌아옴
          // =================================

          if (dangerTimerRef.current) {
            console.log("✅ 위험 자세 해제");

            clearTimeout(dangerTimerRef.current);

            dangerTimerRef.current = null;
          }

          setIsDangerDetected(false);
        }
      } catch (error) {
        console.error(
          "Flask 서버 연결 실패:",
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

      if (dangerTimerRef.current) {
        clearTimeout(dangerTimerRef.current);
        dangerTimerRef.current = null;
      }
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
              src="http://192.168.137.95:5001/video"
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
                ? "⚠ 위험 자세 확인 중"
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
              ? "⚠ 위험 확인 중"
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


          {/* Risk */}

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
                ? "3초 이상 지속될 경우 긴급 알림이 발생합니다."
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