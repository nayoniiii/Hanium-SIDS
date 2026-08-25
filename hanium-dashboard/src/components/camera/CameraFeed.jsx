import { FaVideo, FaExpand, FaCamera } from "react-icons/fa";
import FaceDetectionBox from "./FaceDetectionBox";

function CameraFeed({

    streamUrl = "",
    isConnected = false,
    confidence = 98.7,
    fps = 30,
    status = "SAFE"

}){

    return(

        <div className="cameraFeed">

            {/* 실제 영상 */}

            {isConnected ? (

                <img
                    src={streamUrl}
                    alt="Live Camera"
                    className="cameraStream"
                />

            ) : (

                <div className="cameraPlaceholder">

                    <FaVideo className="cameraPlaceholderIcon"/>

                    <h3>Camera Preview</h3>

                    <p>

                        카메라 가 연결되면
                        실시간 영상이 표시됩니다.

                    </p>

                </div>

            )}

            {/* 얼굴 인식 박스 */}

            <FaceDetectionBox />

            {/* AI Overlay */}

            <div className="cameraOverlay">

                <div className="overlayTop">

                    <div className="overlayBadge">

                        <FaCamera/>

                        BabyGuard AI

                    </div>

                    <button className="expandButton">

                        <FaExpand/>

                    </button>

                </div>

                <div className="overlayBottom">

                    <div>

                        <span>AI</span>

                        <strong>{confidence}%</strong>

                    </div>

                    <div>

                        <span>FPS</span>

                        <strong>{fps}</strong>

                    </div>

                    <div>

                        <span>Status</span>

                        <strong className={
                            status==="SAFE"
                            ?"safeText"
                            :"dangerText"
                        }>

                            {status}

                        </strong>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CameraFeed;