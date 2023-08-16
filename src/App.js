import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from "./components/Account";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Master from "./components/Master";
import { baseUrl } from "./utils/baseUrl";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${baseUrl}/logout`);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="">
      <React.Fragment>
        <header>
          <NavBar handleLogout={handleLogout} />
        </header>
        <main className="min-h-fit mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account-settings" element={<Account />} />
            <Route path="/project/:id" element={<Master />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            
          </Routes>
        </main>
        <ToastContainer className=" text-sm" />
      </React.Fragment>
    </div>
  );
}

export default App;
