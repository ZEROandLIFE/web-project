import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Head.css';
import { logout } from '../services/beforeLogin.ts';

const Head: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="head-container">
            <div className="head-left">
                <h1 className="head-title" onClick={() => navigate('/dashboard')}>盲盒抽盒机</h1>
            </div>
            <nav className="head-nav">
                <ul className="head-nav-list">
                    <li className="head-nav-item" onClick={() => navigate('/home')}>首页</li>
                    <li className="head-nav-item" onClick={() => navigate('/warehouse')}>我的仓库</li>
                    <li className="head-nav-item" onClick={() => navigate('/order')}>订单记录</li>
                    <li className="head-nav-item" onClick={() => navigate('/dashboard')}>玩家秀</li>
                    <li className="head-nav-item" onClick={() => navigate('/dashboard')}>个人主页</li>
                    <li className="head-nav-item" onClick={handleLogout}>退出</li>
                </ul>
            </nav>
        </header>
    );
};

export default Head;