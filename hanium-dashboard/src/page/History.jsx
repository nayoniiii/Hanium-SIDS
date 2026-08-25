import React, { useEffect, useState } from "react";
import "../css/History.css";

function History() {
  const [historyList, setHistoryList] = useState([]);

  // ================================
  // 위험 감지 기록 불러오기
  // ================================

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("sidsHistory")) || [];

    setHistoryList(savedHistory);
  }, []);


  return (
    <div className="history-page">

      {/* ================================
          Header
      ================================= */}

      <header className="history-header">

        <div className="history-title">

          <div className="history-title-icon">
            📋
          </div>

          <div>
            <h1>
              감지 기록
            </h1>

            <p>
              AI 시스템에서 감지된 위험 상황을 확인합니다.
            </p>
          </div>

        </div>

      </header>


      {/* ================================
          Summary
      ================================= */}

      <section className="history-summary">

        <div className="history-summary-card">

          <span>
            전체 위험 감지
          </span>

          <strong>
            {historyList.length}건
          </strong>

        </div>


        <div className="history-summary-card">

          <span>
            최근 감지
          </span>

          <strong>
            {historyList.length > 0
              ? historyList[0].time
              : "-"}
          </strong>

        </div>

      </section>


      {/* ================================
          History List
      ================================= */}

      <section className="history-section">

        <div className="history-section-header">

          <h2>
            최근 감지 기록
          </h2>

          <span>
            {historyList.length}건
          </span>

        </div>


        {historyList.length === 0 ? (

          /* 기록이 없을 때 */

          <div className="history-empty">

            <div className="history-empty-icon">
              ✓
            </div>

            <strong>
              위험 감지 기록이 없습니다.
            </strong>

            <p>
              위험 상황이 감지되면 이곳에 자동으로 기록됩니다.
            </p>

          </div>

        ) : (

          /* 기록이 있을 때 */

          <div className="history-list">

            {historyList.map((item) => (

              <div
                className="history-item"
                key={item.id}
              >

                <div className="history-item-icon">
                  🚨
                </div>


                <div className="history-item-info">

                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {item.description}
                  </span>

                  <small>
                    위험도 {item.risk}%
                  </small>

                </div>


                <div className="history-item-time">

                  <strong>
                    {item.time}
                  </strong>

                  <span>
                    {item.date}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* ================================
          Information
      ================================= */}

      <section className="history-info">

        <div className="history-info-icon">
          ℹ️
        </div>

        <div>

          <strong>
            자동 기록 안내
          </strong>

          <p>
            AI가 위험 상황을 감지하면 해당 상황이 자동으로 기록됩니다.
          </p>

        </div>

      </section>


      <div className="history-bottom-space"></div>

    </div>
  );
}

export default History;