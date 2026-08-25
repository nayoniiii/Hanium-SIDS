import React, { useState } from "react";
import "../css/Settings.css";

function Settings() {
  // 알림 설정
  const [emergencyAlert, setEmergencyAlert] = useState(true);

  // 자동 대응
  const [autoResponse, setAutoResponse] = useState(true);

  // AI 감지
  const [aiDetection, setAiDetection] = useState(true);

  // 알람음
  const [alarmSound, setAlarmSound] = useState(true);

  return (
    <div className="settings-page">

      {/* ================================
          Header
      ================================= */}

      <header className="settings-header">
        <div>
          <h1>설정</h1>

          <p>
            시스템과 알림 설정을 관리할 수 있습니다.
          </p>
        </div>
      </header>

      {/* ================================
          Device Information
      ================================= */}

      <section className="settings-section">

        <div className="settings-section-title">
          <h2>기기 정보</h2>

          <span>연결됨</span>
        </div>

        <div className="device-card">

          <div className="device-icon">
            <img src="../images/logo.png" alt="로고 아이콘" />
          </div>

          <div className="device-info">
            <strong>
              SIDS SAFE
            </strong>

            <span>
              보호자 연결 기기
            </span>
          </div>

          <div className="device-status">
            <span className="device-status-dot"></span>
            정상 연결
          </div>

        </div>

      </section>

      {/* ================================
          Alert Settings
      ================================= */}

      <section className="settings-section">

        <div className="settings-section-title">
          <h2>알림 설정</h2>
        </div>

        {/* 긴급 알림 */}
        <div className="setting-item">

          <div className="setting-icon">
            🚨
          </div>

          <div className="setting-info">

            <strong>
              긴급 상황 알림
            </strong>

            <span>
              위험 상황이 감지되면 보호자에게 알립니다.
            </span>

          </div>

          <button
            className={`toggle-button ${
              emergencyAlert ? "on" : ""
            }`}
            onClick={() =>
              setEmergencyAlert(!emergencyAlert)
            }
          >
            <span></span>
          </button>

        </div>

        {/* 알람음 */}
        <div className="setting-item">

          <div className="setting-icon">
            🔊
          </div>

          <div className="setting-info">

            <strong>
              긴급 알람음
            </strong>

            <span>
              위험 상황 발생 시 긴급 알람음을 재생합니다.
            </span>

          </div>

          <button
            className={`toggle-button ${
              alarmSound ? "on" : ""
            }`}
            onClick={() =>
              setAlarmSound(!alarmSound)
            }
          >
            <span></span>
          </button>

        </div>

      </section>

      {/* ================================
          AI Settings
      ================================= */}

      <section className="settings-section">

        <div className="settings-section-title">
          <h2>AI 및 자동 대응</h2>
        </div>

        {/* AI 감지 */}
        <div className="setting-item">

          <div className="setting-icon">
            🤖
          </div>

          <div className="setting-info">

            <strong>
              AI 상태 감지
            </strong>

            <span>
              카메라를 이용해 아기의 상태를 실시간으로 분석합니다.
            </span>

          </div>

          <button
            className={`toggle-button ${
              aiDetection ? "on" : ""
            }`}
            onClick={() =>
              setAiDetection(!aiDetection)
            }
          >
            <span></span>
          </button>

        </div>

        {/* 자동 대응 */}
        <div className="setting-item">

          <div className="setting-icon">
            🦾
          </div>

          <div className="setting-info">

            <strong>
              자동 대응
            </strong>

            <span>
              위험 상황 감지 시 SCARA 로봇과 매트가 자동으로 작동합니다.
            </span>

          </div>

          <button
            className={`toggle-button ${
              autoResponse ? "on" : ""
            }`}
            onClick={() =>
              setAutoResponse(!autoResponse)
            }
          >
            <span></span>
          </button>

        </div>

      </section>

      {/* ================================
          System Status
      ================================= */}

      <section className="settings-section">

        <div className="settings-section-title">
          <h2>시스템 상태</h2>
        </div>

        <div className="system-status-list">

          <div className="system-status-item">

            <span>
              카메라
            </span>

            <strong className="status-ok">
              정상
            </strong>

          </div>

          <div className="system-status-item">

            <span>
              AI 분석 시스템
            </span>

            <strong className="status-ok">
              정상
            </strong>

          </div>

          <div className="system-status-item">

            <span>
              SCARA 로봇
            </span>

            <strong className="status-ok">
              연결됨
            </strong>

          </div>

          <div className="system-status-item">

            <span>
              능동형 매트
            </span>

            <strong className="status-ok">
              연결됨
            </strong>

          </div>

        </div>

      </section>

      {/* ================================
          App Information
      ================================= */}

      <section className="settings-section app-info-section">

        <div className="app-info">

          <div className="app-logo">
            <img src="../images/logo.png" alt="로고 아이콘" />
          </div>

          <div>
            <strong>
              SIDS SAFE
            </strong>

            <span>
              AI 영아 돌연사 예방 시스템
            </span>

            <small>
              Version 1.0.0
            </small>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Settings;