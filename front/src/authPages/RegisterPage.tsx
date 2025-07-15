import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-page">
            <div className="register-container">
                <button
                    className="back-to-login"
                    onClick={() => navigate('/login')}
                >
                    &larr; 返回登录
                </button>
                <h1 className="auth-title">注册</h1>
                    <RegisterForm />

            </div>
        </div>
    );
};

export default RegisterPage;