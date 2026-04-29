import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WorkloadPage from './pages/WorkloadPage';
import ChangeRequestsPage from './pages/ChangeRequestsPage';
import MemberPage from './pages/MemberPage';

function App() {
    const { user, isTeamLeader } = useAuth();

    const isAdmin  = user?.role === 'Admin';
    const isLeader = isTeamLeader();
    const isMember = user && !isLeader && !isAdmin;

    return (
        <Routes>
            <Route path="/login" element={
                !user ? <LoginPage /> : <Navigate to={isAdmin || isLeader ? "/workload" : "/my-tasks"} />
            } />
            <Route path="/workload" element={
                user && (isLeader || isAdmin) ? <WorkloadPage /> : <Navigate to={user ? "/my-tasks" : "/login"} />
            } />
            <Route path="/dashboard" element={
                user && (isLeader || isAdmin) ? <DashboardPage /> : <Navigate to={user ? "/my-tasks" : "/login"} />
            } />
            <Route path="/change-requests" element={
                user && (isLeader || isAdmin) ? <ChangeRequestsPage /> : <Navigate to={user ? "/my-tasks" : "/login"} />
            } />
            <Route path="/my-tasks" element={
                user && isMember ? <MemberPage /> : <Navigate to={user ? "/workload" : "/login"} />
            } />
            <Route path="*" element={
                <Navigate to={!user ? "/login" : isAdmin || isLeader ? "/workload" : "/my-tasks"} />
            } />
        </Routes>
    );
}

export default App;