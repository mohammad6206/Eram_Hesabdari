import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/account/login/`, {
                username,
                password,
            });

            // ذخیره Access Token طولانی مدت (24 ساعت) در localStorage
            localStorage.setItem("accessToken", response.data.access);

            // هدایت به داشبورد
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.detail || "خطا در ورود");
        }
    };

    return (
        <div className="login-bg d-flex justify-content-center align-items-center vh-100">
            <div className="login-panel p-5 shadow-lg rounded">
                <h3 className="text-center mb-4">ورود به حساب کاربری</h3>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3 text-end">
                        <label className="form-label">نام کاربری</label>
                        <input
                            type="text"
                            className="form-control text-center"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 text-end">
                        <label className="form-label">رمز عبور</label>
                        <input
                            type="password"
                            className="form-control text-center"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-gradient w-100">ورود</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
