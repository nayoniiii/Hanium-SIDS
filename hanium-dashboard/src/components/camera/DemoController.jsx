import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaFlask,
  FaPlay,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBell,
  FaBed,
  FaSave
} from "react-icons/fa";

function DemoController({ onEmergency }) {

  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      icon: <FaCheckCircle />,
      title: "SAFE",
      desc: "AI is monitoring the baby."
    },
    {
      icon: <FaCheckCircle />,
      title: "Face Detected",
      desc: "Baby face detected successfully."
    },
    {
      icon: <FaCheckCircle />,
      title: "Monitoring",
      desc: "Tracking sleeping position..."
    },
    {
      icon: <FaExclamationTriangle />,
      title: "Risk Detected",
      desc: "Unsafe sleeping posture detected."
    },
    {
      icon: <FaBell />,
      title: "Guardian Notification",
      desc: "Emergency notification sent."
    },
    {
      icon: <FaBed />,
      title: "Smart Mat Activated",
      desc: "Active mattress has started."
    },
    {
      icon: <FaSave />,
      title: "History Saved",
      desc: "Event stored successfully."
    }
  ];

  useEffect(() => {

    if (!running) return;

    if (step >= steps.length) {

      setRunning(false);

      return;

    }

    const timer = setTimeout(() => {

      if (step === 3 && onEmergency) {

        onEmergency();

      }

      setStep(prev => prev + 1);

    }, 2500);

    return () => clearTimeout(timer);

  }, [running, step, onEmergency]);

  const startDemo = () => {

    setStep(0);

    setRunning(true);

  };

  return (

    <div className="demoCard">

      <div className="demoHeader">

        <FaFlask />

        <h3>Demo Mode</h3>

      </div>

      <p className="demoDescription">

        공모전 발표용 AI 시나리오를 자동으로 실행합니다.

      </p>

      <div className="demoStatus">

        {steps[Math.min(step, steps.length - 1)].icon}

        <div>

          <h4>

            {steps[Math.min(step, steps.length - 1)].title}

          </h4>

          <span>

            {steps[Math.min(step, steps.length - 1)].desc}

          </span>

        </div>

      </div>

      <button
        className="demoButton"
        disabled={running}
        onClick={startDemo}
      >

        <FaPlay />

        {running ? "Demo Running..." : "Start Demo"}

      </button>

    </div>

  );

}

export default DemoController;