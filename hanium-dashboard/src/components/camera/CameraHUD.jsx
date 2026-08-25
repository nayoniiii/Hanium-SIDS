import {
  FaBatteryFull,
  FaCircle
} from "react-icons/fa";

function CameraHUD() {

  return (

    <>
      {/* =========================
          Top HUD
      ========================== */}

      <div className="cameraHUD">

        <div className="liveIndicator">

          <FaCircle />

          <span>LIVE</span>

        </div>

        <div className="battery">

          <FaBatteryFull />

          <span>100%</span>

        </div>

      </div>

      {/* =========================
          Bottom HUD
      ========================== */}

      <div className="cameraFooterHUD">

        <div className="hudInfo">

          <span>AI</span>

          <strong>98.7%</strong>

        </div>

        <div className="hudInfo">

          <span>FPS</span>

          <strong>30</strong>

        </div>

        <div className="hudInfo success">

          <span>Status</span>

          <strong>SAFE</strong>

        </div>

      </div>

    </>

  );

}

export default CameraHUD;