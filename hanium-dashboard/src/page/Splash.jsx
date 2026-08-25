import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../css/Splash.css";

import { FaShieldAlt } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";

function Splash() {

  const navigate = useNavigate();

 useEffect(() => {

    const timer = setTimeout(() => {

        navigate("/home");

    }, 2500);

    return () => clearTimeout(timer);

}, []);

  return (

    <div className="splash">

      {/* 배경 원 */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>

      {/* 로고 */}

      <div className="logoContainer">

        <div className="shield">

          <FaShieldAlt />

          <div className="heart">

            <MdFavorite />

          </div>

        </div>

      </div>

      {/* 제목 */}

      <h1 className="title">

        BabyGuard AI

      </h1>

      <h3 className="subtitle">

        AI-Based SIDS Prevention System

      </h3>

      <p className="slogan">

        Protecting Every Breath

      </p>

      {/* Loading */}

      <div className="loading">

        <span></span>
        <span></span>
        <span></span>

      </div>

      {/* Footer */}

      <div className="version">

        Version 1.0

      </div>

    </div>

  );

}

export default Splash;