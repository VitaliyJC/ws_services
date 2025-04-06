import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header";

const App = () => {
  const token = localStorage.getItem("token");
  return (
    <>
      <Header />
      <Routes>
        <Route path="/sign_in" element={<SignInPage />} />
        <Route path="/sign_up" element={<SignUpPage />} />
        <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/sign_in" />} />
        <Route path="*" element={<Navigate to="/sign_in" />} />
      </Routes>
    </>
  );
};

export default App;
