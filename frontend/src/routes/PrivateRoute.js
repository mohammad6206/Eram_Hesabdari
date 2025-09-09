import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const token = sessionStorage.getItem("accessToken"); // بجای localStorage

    // اگر توکن نیست → هدایت به لاگین
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
