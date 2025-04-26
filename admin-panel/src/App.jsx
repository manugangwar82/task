import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersManagement from "./components/UsersManagement";
import WithdrawalRequests from "./components/WithdrawalRequests";
import DepositRequests from "./components/DepositRequests";
import TaskManagement from "./components/TaskManagement"
import AdminLogin from "./components/AdminLogin";
import ReferralMonitoring from "./components/ReferralMonitoring";
import BroadcastMessage from "./components/BroadcastMessage";
import ClearTasksSection from "./components/ClearTasksSection";

function App() {
  const isAdminAuthenticated = () => {
    // Check if the admin token is present and valid
    const token = localStorage.getItem("adminToken");
    return token !== null; // Simplified, you can verify token with a backend request
  };
  return (
    <Router basename="/">
      <Routes>
         {/* Login Route */}
         <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={isAdminAuthenticated() ? <UsersManagement /> : <Navigate to="/login" />} /> 
        <Route path="/withdraw" element={isAdminAuthenticated() ? <WithdrawalRequests /> : <Navigate to="/login" />}  />
        <Route path="/deposit" element={isAdminAuthenticated() ? <DepositRequests /> : <Navigate to="/login" />}  />
        <Route path="/task" element={isAdminAuthenticated() ? <TaskManagement /> : <Navigate to="/login" />}  />
        <Route path="/refer" element={isAdminAuthenticated() ? <ReferralMonitoring /> : <Navigate to="/login" />}  />
        <Route path="/broadcast" element={isAdminAuthenticated() ? <BroadcastMessage /> : <Navigate to="/login" />}  />
        <Route path="/cleartaskssection" element={isAdminAuthenticated() ? <ClearTasksSection /> : <Navigate to="/login" />}  />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
