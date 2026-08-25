import "../css/TransitionOverlay.css";

function TransitionOverlay({ show }) {

  if (!show) return null;

  return (
    <div className="transitionOverlay">

      <div className="flash"></div>

      <div className="overlayContent">

        <div className="warningCircle">

          ⚠

        </div>

        <h1>WARNING DETECTED</h1>

        <h2>Unsafe Sleeping Position</h2>

        <p>

          AI Emergency Protocol Activated

        </p>

        <div className="loadingBar">

          <div className="loadingFill"></div>

        </div>

      </div>

    </div>
  );
}

export default TransitionOverlay;