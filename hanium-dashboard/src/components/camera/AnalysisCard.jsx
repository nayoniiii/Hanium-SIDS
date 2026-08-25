import {
  FaBrain,
  FaCheckCircle,
  FaBed,
  FaCamera,
  FaMicrochip,
  FaClock,
  FaBullseye,
  FaSignal
} from "react-icons/fa";

function AnalysisCard({

  faceDetected = true,
  confidence = 98.7,
  tracking = true,
  aiModel = "Hailo-8",
  smartMat = "READY",
  camera = "CONNECTED",
  latency = "28 ms"

}) {

  return (

    <div className="analysisCard">

      <div className="analysisHeader">

        <FaBrain />

        <h3>AI Analysis Dashboard</h3>

      </div>

      <div className="analysisList">

        <div className="analysisItem">

          <div className="itemLeft">

            <FaCheckCircle />

            Face Detection

          </div>

          <div className={`itemValue ${faceDetected ? "success" : "danger"}`}>

            {faceDetected ? "ACTIVE" : "NOT FOUND"}

          </div>

        </div>

        <div className="analysisItem">

          <div className="itemLeft">

            <FaBullseye />

            Confidence

          </div>

          <div className="itemValue">

            {confidence}%

          </div>

        </div>

        <div className="analysisItem">

          <div className="itemLeft">

            <FaSignal />

            Tracking

          </div>

          <div className={`itemValue ${tracking ? "success" : "danger"}`}>

            {tracking ? "ON" : "OFF"}

          </div>

        </div>

        <div className="analysisItem">

          <div className="itemLeft">

            <FaMicrochip />

            AI Model

          </div>

          <div className="itemValue">

            {aiModel}

          </div>

        </div>

        <div className="analysisItem">

          <div className="itemLeft">

            <FaBed />

            Smart Mat

          </div>

          <div className="itemValue success">

            {smartMat}

          </div>

        </div>

        <div className="analysisItem">

          <div className="itemLeft">

            <FaCamera />

            Camera

          </div>

          <div className="itemValue success">

            {camera}

          </div>

        </div>

        <div className="analysisItem">

          <div className="itemLeft">

            <FaClock />

            AI Latency

          </div>

          <div className="itemValue">

            {latency}

          </div>

        </div>

      </div>

      <div className="systemStatus">

        <span className="statusDot"></span>

        System Status

        <strong>NORMAL</strong>

      </div>

    </div>

  );

}

export default AnalysisCard;