import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomNav from "../components/BottomNav";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();

  // ==========================================
  // 기존 History
  // ==========================================

  const [historyList, setHistoryList] = useState([]);

  // ==========================================
  // 실제 AI 상태
  // ==========================================

  const [aiData, setAiData] = useState({
    posture: "supine",
    confidence: 0,
    danger: false,
    pump: false,
    timestamp: null,
  });

  const [serverConnected, setServerConnected] = useState(false);


  // ==========================================
  // History 기록 불러오기
  // ==========================================

  useEffect(() => {
    const loadHistory = () => {
      const savedHistory =
        JSON.parse(localStorage.getItem("sidsHistory")) || [];

      setHistoryList(savedHistory);
    };

    loadHistory();

    window.addEventListener("focus", loadHistory);

    return () => {
      window.removeEventListener("focus", loadHistory);
    };
  }, []);


  // ==========================================
  // Flask 서버에서 AI 상태 가져오기
  // ==========================================

  useEffect(() => {

    const fetchAIStatus = async () => {

      try {

        const response = await fetch(
          "http://127.0.0.1:5000/detection"
        );

        if (!response.ok) {
          throw new Error("서버 응답 오류");
        }

        const data = await response.json();

        setAiData(data);

        setServerConnected(true);

      } catch (error) {

        console.log("Flask 서버 연결 실패");

        setServerConnected(false);
      }
    };


    // 처음 바로 실행
    fetchAIStatus();


    // 1초마다 상태 확인
    const interval = setInterval(
      fetchAIStatus,
      1000
    );


    return () => {
      clearInterval(interval);
    };

  }, []);


  // ==========================================
  // 가장 최근 위험 기록
  // ==========================================

  const latestHistory =
    historyList.length > 0
      ? historyList[0]
      : null;


  // ==========================================
  // AI 데이터
  // ==========================================

  const posture = aiData.posture;

  const confidence =
    Math.round(
      Number(aiData.confidence || 0) * 100
    );


  const isDanger = aiData.danger;

  const isPumpRunning = aiData.pump;


  // ==========================================
  // 자세 한글 표시
  // ==========================================

  const getPostureText = () => {

    if (posture === "prone") {
      return "엎드림";
    }

    if (posture === "side") {
      return "옆으로 누움";
    }

    if (posture === "supine") {
      return "바로 누움";
    }

    return "감지되지 않음";
  };


  // ==========================================
  // 시스템 설명
  // ==========================================

  const systemDescription = isDanger
    ? "위험 자세가 감지되었습니다. 긴급 대응을 준비하고 있습니다."
    : "아기의 상태를 정상적으로 모니터링하고 있습니다.";


  return (

    <div
      className={`home-page ${isDanger ? "home-danger-mode" : ""
        }`}
    >

      {/* =================================
          Header
      ================================= */}

      <header className="home-header">

        <div className="home-brand">

          <div className="home-brand-icon">

            <img
              src="../images/logo.png"
              alt="로고 아이콘"
            />

          </div>


          <div>

            <h1>
              SIDS SAFE
            </h1>

            <p>
              AI 돌연사 방지 시스템
            </p>

          </div>

        </div>

      </header>


      {/* =================================
          Welcome
      ================================= */}

      <section className="home-welcome">

        <div className="welcome-text">

          <h2>
            안녕하세요 👋
          </h2>

          <p>
            오늘도 아기의 안전한 수면을 지켜보고 있어요.
          </p>

        </div>


        <div className="home-brand-icon">

          <img
            src="../images/baby.png"
            alt="아기 아이콘"
          />

        </div>

      </section>


      {/* =================================
          Today's Status
      ================================= */}

      <section className="home-status-card">

        <div className="home-status-info">

          <span className="home-status-label">
            현재 AI 상태
          </span>


          <h2
            className={
              isDanger
                ? "status-danger"
                : "status-normal"
            }
          >

            {isDanger
              ? "🔴 위험 자세 감지"
              : "🟢 정상 모니터링"}

          </h2>


          <p>
            {systemDescription}
          </p>


          {/* 현재 자세 */}

          <div className="home-ai-info">

            <div>

              <span>
                현재 자세
              </span>

              <strong>
                {getPostureText()}
              </strong>

            </div>


            <div>

              <span>
                AI 신뢰도
              </span>

              <strong>
                {confidence}%
              </strong>

            </div>

          </div>


          {/* 펌프 상태 */}

          <div className="home-pump-status">

            <span>
              방석 상태
            </span>

            <strong>

              {isPumpRunning
                ? "💨 안전장치 작동 중"
                : "대기 중"}

            </strong>

          </div>

        </div>


        {/* 상태 이미지 */}

        <div className="home-status-image">

          <div className="home-status-placeholder">

            {isDanger
              ? "🚨"
              : <img
                src="../images/baby.png"
                alt="아기 아이콘"
              />}

          </div>

        </div>

      </section>


      {/* =================================
          Main Grid
      ================================= */}

      <section className="home-main-grid">


        {/* =================================
            Real-time System
        ================================= */}

        <div className="home-panel">


          <div className="home-panel-header">

            <h2>
              실시간 시스템
            </h2>

            <span className="system-live">
              LIVE
            </span>

          </div>


          <div className="home-system-list">


            {/* Camera */}

            <div className="home-system-item">

              <div className="system-item-icon">
                📷
              </div>


              <div>

                <strong>
                  카메라
                </strong>

                <span>
                  실시간 연결
                </span>

              </div>


              <b className="system-ok">

                정상

              </b>

            </div>


            {/* AI */}

            <div className="home-system-item">

              <div className="system-item-icon">
                🤖
              </div>


              <div>

                <strong>
                  AI 분석
                </strong>

                <span>

                  {getPostureText()}
                  {" / "}
                  {confidence}%

                </span>

              </div>


              <b
                className={
                  isDanger
                    ? "system-danger"
                    : "system-ok"
                }
              >

                {isDanger
                  ? "위험"
                  : "작동 중"}

              </b>

            </div>


            {/* Server */}

            <div className="home-system-item">

              <div className="system-item-icon">
                📡
              </div>


              <div>

                <strong>
                  서버
                </strong>

                <span>
                  Flask AI 서버
                </span>

              </div>


              <b
                className={
                  serverConnected
                    ? "system-ok"
                    : "system-danger"
                }
              >

                {serverConnected
                  ? "연결됨"
                  : "연결 끊김"}

              </b>

            </div>


            {/* Pump */}

            <div className="home-system-item">

              <div className="system-item-icon">
                💨
              </div>


              <div>

                <strong>
                  안전 방석
                </strong>

                <span>

                  {isPumpRunning
                    ? "팽창 작동 중"
                    : "대기 상태"}

                </span>

              </div>


              <b
                className={
                  isPumpRunning
                    ? "system-danger"
                    : "system-ok"
                }
              >

                {isPumpRunning
                  ? "작동 중"
                  : "대기"}

              </b>

            </div>

          </div>


          {/* Camera 이동 */}

          <button
            className="home-camera-button"
            onClick={() => navigate("/camera")}
          >

            📷 실시간 카메라 보기

          </button>

        </div>


        {/* =================================
            Recent History
        ================================= */}

        <div className="home-panel">


          <div className="home-panel-header">

            <h2>
              최근 감지 기록
            </h2>


            <button
              className="home-history-link"
              onClick={() => navigate("/history")}
            >

              전체 보기

            </button>

          </div>


          {latestHistory ? (

            <div className="home-recent-history">

              <div className="recent-history-icon">
                🚨
              </div>


              <div className="recent-history-info">

                <strong>
                  {latestHistory.title}
                </strong>

                <span>
                  {latestHistory.description}
                </span>

                <small>
                  위험도 {latestHistory.risk}%
                </small>

              </div>


              <div className="recent-history-time">

                <strong>
                  {latestHistory.time}
                </strong>

                <span>
                  {latestHistory.date}
                </span>

              </div>

            </div>

          ) : (

            <div className="home-history-empty">

              <div className="history-empty-check">
                ✓
              </div>


              <strong>
                최근 위험 감지 없음
              </strong>


              <span>
                현재까지 정상적으로 모니터링 중입니다.
              </span>

            </div>

          )}

        </div>

      </section>


      {/* =================================
          System Message
      ================================= */}

      <section className="home-message">


        <span>

          {isDanger
            ? "🚨"
            : "🛡️"}

        </span>


        <div>

          <strong>

            {isDanger
              ? "위험 상황 감지"
              : "AI 실시간 보호 시스템"}

          </strong>


          <p>

            {isDanger
              ? "위험 자세가 감지되어 안전장치 상태를 확인하고 있습니다."
              : "위험 상황이 감지되면 자동으로 긴급 대응을 시작합니다."}

          </p>

        </div>

      </section>


      {/* =================================
          Bottom Navigation
      ================================= */}

      <BottomNav />

    </div>

  );
}

export default Home;