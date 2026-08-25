import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./page/Login";
import Home from "./page/Home";
import Camera from "./page/Camera";
import Emergency from "./page/Emergency";
import History from "./page/History";
import Settings from "./page/Settings";

import BottomNav from "./components/BottomNav";

function App() {
  const location = useLocation();

  // BottomNav를 보여줄 페이지
  const showBottomNav = [
    "/home",
    "/camera",
    "/history",
    "/settings",
  ].includes(location.pathname);

  return (
    <>
      <Routes>

        {/* 첫 화면 - 보호자 QR 연결 */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* 메인 화면 */}
        <Route
          path="/home"
          element={<Home />}
        />

        {/* 카메라 */}
        <Route
          path="/camera"
          element={<Camera />}
        />

        {/* 위험 감지 */}
        <Route
          path="/emergency"
          element={<Emergency />}
        />

        {/* 기록 */}
        <Route
          path="/history"
          element={<History />}
        />

        {/* 설정 */}
        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* 존재하지 않는 주소 */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

      {/* 일반 페이지에서만 BottomNav 표시 */}
      {showBottomNav && <BottomNav />}
    </>
  );
}

export default App;