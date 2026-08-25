import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBaby, FaArrowRight } from "react-icons/fa";
import "../css/Login.css";

// 로그인 화면 아님 접속화면
function Login() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/home");
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">

        {/* SIDS 로고 */}
        <div className="home-brand-icon">
          <img src="../images/logo.png" alt="로고 아이콘" />
        </div>
        

        {/* 타이틀 */}
        <div className="loginTitle">
          <h1>SIDS 안심 케어</h1>
          <p>
            AI 기반 영아 돌연사 방지 시스템
            <br />
            우리 아기의 안전을 실시간으로 지켜줍니다.
          </p>
        </div>

        {/* 시작 카드 */}
        <div className="qrCard">

          {/* 아이콘 */}
          <div className="qrIcon">
            <img src="../images/baby.png" alt="아기 아이콘" />
          </div>

          {/* 카드 제목 */}
          <h2>보호자 관제 시스템</h2>

          <p>
            카메라와 AI 분석을 통해<br />
            아기의 상태를 실시간으로 확인합니다.
          </p>

          {/* 시스템 상태 */}
          <div className="startStatus">
            <span className="statusDot"></span>
            <span>시스템 준비 완료</span>
          </div>

          {/* 시작 버튼 */}
          <button className="qrButton" onClick={handleStart}>
            관제 시스템 시작
            <FaArrowRight />
          </button>

        </div>

        {/* 안내 문구 */}
        <div className="loginNotice">
          <FaShieldAlt />
          <span>
            AI가 아기의 위험 상황을 감지하면<br />
            보호자에게 즉시 알림을 제공합니다.
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;