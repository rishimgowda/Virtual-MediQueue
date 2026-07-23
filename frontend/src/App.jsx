import { Routes, Route } from "react-router-dom";

import { Layout } from "./components/layout/Layout.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AllDoctors from "./pages/AllDoctors.jsx";
import DoctorDetails from "./pages/DoctorDetails.jsx";
import DoctorRegister from "./pages/DoctorRegister.jsx";
import MyAppointments from "./pages/MyAppointments.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/doctors" element={<AllDoctors />} />
                <Route path="/doctors/:doctorId" element={<DoctorDetails />} />
                <Route
                    path="/register/doctor"
                    element={
                        <ProtectedRoute>
                            <DoctorRegister />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/appointments"
                    element={
                        <ProtectedRoute>
                            <MyAppointments />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
