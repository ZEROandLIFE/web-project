import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
import Textarea from '../common/Textarea';
import '../../authPages/Dashboard.css';
import { fetchCurrentUser, getBalance, rechargeMoney } from '../../services/api';

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
    const [balance, setBalance] = useState<number>(0);
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [newProfile, setNewProfile] = useState({
        username: '',
        address: ''
    });
    const [newPassword, setNewPassword] = useState({
        password: '',
        confirmPassword: ''
    });
    const [alert, setAlert] = useState<{
        type: 'error' | 'success' | 'warning' | 'info';
        message: string;
    } | null>(null);

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
                        phone: data.phone,
                    });

                    // 获取余额
                    const balanceData = await getBalance();
                    setBalance(balanceData.balance);
                } else {
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

    const handleRecharge = async () => {
        const amount = parseFloat(rechargeAmount);
        if (isNaN(amount) || amount <= 0) {
            setAlert({ type: 'error', message: '请输入有效的充值金额' });
            return;
        }

        try {
            const result = await rechargeMoney(amount);
            if (result.success) {
                setBalance(result.newBalance);
                setShowRechargeModal(false);
                setRechargeAmount('');
                setAlert({ type: 'success', message: `充值成功！当前余额: ${result.newBalance}` });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setAlert({ type: 'error', message: error.message });
            } else {
                setAlert({ type: 'error', message: 'An unknown error occurred' });
            }
        }
    };

    const handleUpdateProfile = () => {
        // 待实现
        setAlert({ type: 'info', message: '个人信息更新功能待实现' });
        setShowProfileModal(false);
    };

    const handleUpdatePassword = () => {
        // 待实现
        setAlert({ type: 'info', message: '密码修改功能待实现' });
        setShowPasswordModal(false);
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
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                    className="dashboard-alert"
                />
            )}

            <div className="dashboard-header">
                <div className="dashboard-avatar-container">
                    {userData.avatar ? (
                        <img
                            src={userData.avatar}
                            alt="用户头像"
                            className="dashboard-avatar"
                        />
                    ) : (
                        <span>暂无图片</span>
                    )}
                </div>
            </div>

            <div className="dashboard-info">
                <h2 className="dashboard-username">用户名：{userData.username}</h2>
                {userData.address && (
                    <p className="dashboard-address">地址：{userData.address}</p>
                )}
                <p className="dashboard-phone">手机号：{userData.phone}</p>
                <p className="dashboard-balance">账户余额：¥{balance}</p>

                {/* 充值按钮 */}
                <div className="dashboard-button-row">
                    <Button
                        onClick={() => setShowRechargeModal(true)}
                        variant="primary"
                    >
                        充值
                    </Button>
                </div>
            </div>

            {/* 修改信息按钮 */}
            <div className="dashboard-buttons">
                <div className="dashboard-button-row">
                    <Button
                        onClick={() => setShowProfileModal(true)}
                        variant="secondary"
                    >
                        修改个人信息
                    </Button>
                    <Button
                        onClick={() => setShowPasswordModal(true)}
                        variant="secondary"
                    >
                        修改密码
                    </Button>
                </div>
                <div className="dashboard-button-row">
                    <Button
                        onClick={handleLogout}
                        variant="text"
                    >
                        退出登录
                    </Button>
                </div>
            </div>

            {/* 充值模态框 */}
            {showRechargeModal && (
                <Modal
                    title="账户充值"
                    onClose={() => setShowRechargeModal(false)}
                >
                    <div className="dashboard-modal-content">
                        <Input
                            label="充值金额"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={rechargeAmount}
                            onChange={(e) => setRechargeAmount(e.target.value)}
                            placeholder="请输入充值金额"
                        />
                        <div className="dashboard-modal-actions">
                            <Button
                                onClick={() => setShowRechargeModal(false)}
                                variant="secondary"
                            >
                                取消
                            </Button>
                            <Button
                                onClick={handleRecharge}
                                variant="primary"
                            >
                                确认充值
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* 修改个人信息模态框 */}
            {showProfileModal && (
                <Modal
                    title="修改个人信息"
                    onClose={() => setShowProfileModal(false)}
                >
                    <div className="dashboard-modal-content">
                        <Input
                            label="用户名"
                            value={newProfile.username || userData.username}
                            onChange={(e) => setNewProfile({
                                ...newProfile,
                                username: e.target.value
                            })}
                        />
                        <Textarea
                            label="地址"
                            value={newProfile.address || userData.address || ''}
                            onChange={(e) => setNewProfile({
                                ...newProfile,
                                address: e.target.value
                            })}
                            rows={3}
                        />
                        <div className="dashboard-modal-actions">
                            <Button
                                onClick={() => setShowProfileModal(false)}
                                variant="secondary"
                            >
                                取消
                            </Button>
                            <Button
                                onClick={handleUpdateProfile}
                                variant="primary"
                            >
                                保存
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* 修改密码模态框 */}
            {showPasswordModal && (
                <Modal
                    title="修改密码"
                    onClose={() => setShowPasswordModal(false)}
                >
                    <div className="dashboard-modal-content">
                        <Input
                            label="新密码"
                            type="password"
                            value={newPassword.password}
                            onChange={(e) => setNewPassword({
                                ...newPassword,
                                password: e.target.value
                            })}
                        />
                        <Input
                            label="确认密码"
                            type="password"
                            value={newPassword.confirmPassword}
                            onChange={(e) => setNewPassword({
                                ...newPassword,
                                confirmPassword: e.target.value
                            })}
                        />
                        <div className="dashboard-modal-actions">
                            <Button
                                onClick={() => setShowPasswordModal(false)}
                                variant="secondary"
                            >
                                取消
                            </Button>
                            <Button
                                onClick={handleUpdatePassword}
                                variant="primary"
                            >
                                确认修改
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default DashboardForm;