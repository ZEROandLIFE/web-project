import LoginForm from '../components/Auth/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">盲盒抽奖机 - 登录</h1>
                <LoginForm />
                <div className="auth-footer">
                    还没有账号？<a href="/register">立即注册</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;