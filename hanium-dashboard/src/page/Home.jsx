import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomNav from "../components/BottomNav";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState([]);

  // ================================
  // History 기록 불러오기
  // ================================

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

  // 가장 최근 위험 기록
  const latestHistory =
    historyList.length > 0
      ? historyList[0]
      : null;

  // ================================
  // 시스템 상태
  // ================================

  const systemDescription = latestHistory
    ? "최근 위험 상황이 감지되었습니다."
    : "아기의 상태를 정상적으로 모니터링하고 있습니다.";

  return (
    <div className="home-page">

      {/* ================================
          Header
      ================================= */}

      <header className="home-header">

        <div className="home-brand">

          <div className="home-brand-icon">
            <img src="../images/logo.png" alt="로고 아이콘" />
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


      {/* ================================
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
          <img src="../images/baby.png" alt="아기 아이콘" />
        </div>

      </section>


      {/* ================================
          Today's Status
      ================================= */}

      <section className="home-status-card">

        <div className="home-status-info">

          <span className="home-status-label">
            오늘 상태
          </span>

          <h2
            className={
              latestHistory
                ? "status-danger"
                : "status-normal"
            }
          >
            {latestHistory
              ? "🔴 위험 감지 기록 있음"
              : "🟢 정상"}
          </h2>

          <p>
            {systemDescription}
          </p>

        </div>


        {/* 상태 이미지 */}

        <div className="home-status-image">

          <div className="home-status-placeholder">
            {latestHistory ? "🚨" : "👶"}
          </div>

        </div>

      </section>


      {/* ================================
          Main Grid
      ================================= */}

      <section className="home-main-grid">

        {/* ================================
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
                  상태 분석 중
                </span>
              </div>

              <b className="system-ok">
                작동 중
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
                  시스템 연결
                </span>
              </div>

              <b className="system-ok">
                연결됨
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


        {/* ================================
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


      {/* ================================
          System Message
      ================================= */}

      <section className="home-message">

        <span>
          🛡️
        </span>

        <div>

          <strong>
            AI 실시간 보호 시스템
          </strong>

          <p>
            위험 상황이 감지되면 자동으로 긴급 대응을 시작합니다.
          </p>

        </div>

      </section>


      {/* ================================
          Bottom Navigation
      ================================= */}

      <BottomNav />

    </div>
  );
}

export default Home;