import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import '../../authPages/Dashboard.css';

interface UserData {
    username: string;
    address: string;
    avatar: string;
    phone: string;
}

const DashboardForm: React.FC = () => {
    const navigate = useNavigate();

    // 模拟用户数据
    const userData: UserData = {
        username: '测试用户',
        address: '北京市海淀区',
        avatar: 'https://via.placeholder.com/150',
        phone: '0123456789',
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <img src={userData.avatar} alt="用户头像" className="dashboard-avatar" />
                <h2 className="dashboard-username">用户名：{userData.username}</h2>
                <p className="dashboard-address">地址：{userData.address}</p>
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