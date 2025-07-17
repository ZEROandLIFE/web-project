import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import '../../authPages/Dashboard.css';
import { fetchCurrentUser } from '../../services/api.ts'; // 导入API

interface UserData {
    username: string;
    address?: string;
    avatar?: string;
    phone: string;
}

const DashboardForm: React.FC = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState<string | null>(null);

    useEffect(() => {
        document.title = '个人信息 - 盲盒平台';
        const loadUserData = async () => {
            try {
                const data = await fetchCurrentUser();
                if (data) {
                    setUserData({
                        username: data.username,
                        address: data.address,
                        avatar: data.avatar || 'https://via.placeholder.com/150',
                        phone: data.phone
                    });
                } else {
                    // 如果获取失败，清除token并跳转登录
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (err) {
                console.error('获取用户信息出错:', err);
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        // 检查是否有token
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        loadUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return <div className="dashboard-container">加载中...</div>;
    }

    if (error) {
        return <div className="dashboard-container">{error}</div>;
    }

    if (!userData) {
        return <div className="dashboard-container">未找到用户数据</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <img
                    src={userData.avatar || 'https://via.placeholder.com/150'}
                    alt="用户头像"
                    className="dashboard-avatar"
                />
                <h2 className="dashboard-username">用户名：{userData.username}</h2>
                {userData.address && (
                    <p className="dashboard-address">地址：{userData.address}</p>
                )}
                <p className="dashboard-address">手机号：{userData.phone}</p>
            </div>

            <div className="dashboard-actions">
                <Button
                    onClick={handleLogout}
                    variant="secondary"
                    fullWidth
                >
                    退出登录
                </Button>
            </div>
        </div>
    );
};

export default DashboardForm;