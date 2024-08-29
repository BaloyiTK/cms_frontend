import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Project from "./pages/Project";
import Account from "./pages/Account";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Master from "./components/Master";
import { baseUrl } from "./utils/baseUrl";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Footer from "./components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { dropdownActions } from "./store";
import Documentation from "./pages/Documentation";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDropdownOpen = useSelector((state) => state.dropdown.isOpen);

  const handleLogout = async () => {
    try {
      await axios.get(`${baseUrl}/logout`);
      navigate("/");
      localStorage.removeItem(`cachedUser`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAppClick = () => {
    if (isDropdownOpen) {
      dispatch(dropdownActions.closeDropdown());
    }
  };

  return (
    <div onClick={handleAppClick} className="min-h-screen">
      <React.Fragment>
        <header>
          <NavBar handleLogout={handleLogout} />
        </header>
        <main className="min-h-screen mx-auto  bg-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account-settings" element={<Account />} />
            <Route path="/project" element={<Project />} />
            <Route path="/project/:id" element={<Master />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/documentation" element={<Documentation/>} />
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>
        <ToastContainer className="text-sm" />
      </React.Fragment>
    </div>
  );
}

export default App;
