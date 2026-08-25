import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function FaceDetectionBox({

    detected = true,

    danger = false,

    left = "50%",

    top = "50%",

    width = 170,

    height = 200,

    confidence = 98.7

    // 헤일로 구동시 바꿀것 
// left={`${x}px`}
// top={`${y}px`}
// width={w}
// height={h}

}){

    return(

        <div
            className={`faceDetection ${
                danger ? "danger" : "safe"
            }`}
            style={{

                left,

                top,

                width:`${width}px`,

                height:`${height}px`

            }}
        >

            {/* 얼굴 인식 모서리 */}

            <span className="corner tl"></span>
            <span className="corner tr"></span>
            <span className="corner bl"></span>
            <span className="corner br"></span>

            {/* 스캔 라인 */}

            {detected &&

                <div className="scanLine"></div>

            }

            {/* 라벨 */}

            <div className="faceLabel">

                {danger ?

                    <>
                        <FaExclamationTriangle/>
                        Risk Detected
                    </>

                    :

                    <>
                        <FaCheckCircle/>
                        Face Detected
                    </>

                }

            </div>

            {/* Confidence */}

            <div className="confidenceLabel">

                {confidence}%

            </div>

        </div>

    );

}

export default FaceDetectionBox;