import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
import Textarea from '../common/Textarea';
import '../../authPages/Dashboard.css';
import { fetchCurrentUser, getBalance, rechargeMoney, updateProfile, changePassword, setAdminRole } from '../../services/api';

// 定义用户数据接口
interface UserData {
    username: string;
    address?: string;
    avatar?: string;
    phone: string;
    role: 'user' | 'admin';
    id: number;
}

/**
 * 用户仪表盘组件
 * 显示用户信息、余额、并提供充值、修改信息等功能
 */
const DashboardForm: React.FC = () => {
    const navigate = useNavigate();

    // 用户数据状态
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState<string | null>(null);

    // 余额状态
    const [balance, setBalance] = useState<number>(0);

    // 模态框显示状态
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    // 表单数据状态
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [newProfile, setNewProfile] = useState({
        username: '',
        address: ''
    });
    const [newPassword, setNewPassword] = useState({
        password: '',
        confirmPassword: ''
    });

    // 提示信息状态
    const [alert, setAlert] = useState<{
        type: 'error' | 'success' | 'warning' | 'info';
        message: string;
    } | null>(null);

    // 加载用户数据
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
                        role: data.role,
                        id: data.id
                    });

                    // 获取用户余额
                    const balanceData = await getBalance();
                    setBalance(balanceData.balance);
                } else {
                    // 用户数据无效，重定向到登录页
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

        // 检查登录状态
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        loadUserData();
    }, [navigate]);

    /**
     * 处理用户登出
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    /**
     * 处理账户充值
     */
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

    /**
     * 处理个人信息更新
     */
    const handleUpdateProfile = async () => {
        try {
            const result = await updateProfile({
                username: newProfile.username || undefined,
                address: newProfile.address || undefined
            });

            if (result.success) {
                setUserData({
                    ...userData!,
                    username: result.user.username,
                    address: result.user.address
                });
                setAlert({ type: 'success', message: '个人信息更新成功' });
                setShowProfileModal(false);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setAlert({ type: 'error', message: error.message });
            } else {
                setAlert({ type: 'error', message: 'An unknown error occurred' });
            }
        }
    };

    /**
     * 处理管理员邀请码提交
     */
    const handleInviteCodeSubmit = async () => {
        if (inviteCode.trim() === '114514') {
            try {
                const result = await setAdminRole(userData!.id);
                if (result.success) {
                    setAlert({ type: 'success', message: '您已成为管理员！' });
                    // 刷新页面获取最新数据
                    window.location.reload();
                }
            } catch (error) {
                setAlert({ type: 'error', message: '设置管理员权限失败' });
            }
        } else {
            setAlert({ type: 'error', message: '邀请码错误' });
            setInviteCode('');
            // 2秒后自动刷新
            setTimeout(() => window.location.reload(), 2000);
        }
        setShowInviteModal(false);
    };

    /**
     * 处理密码修改
     */
    const handleUpdatePassword = async () => {
        try {
            // 验证密码一致性
            if (newPassword.password !== newPassword.confirmPassword) {
                setAlert({ type: 'error', message: '两次输入的密码不一致' });
                return;
            }

            const result = await changePassword({
                newPassword: newPassword.password,
                confirmPassword: newPassword.confirmPassword
            });

            if (result.success) {
                setAlert({ type: 'success', message: result.message });
                setShowPasswordModal(false);

                // 修改成功后跳转到登录页
                setTimeout(() => {
                    setAlert(null);
                    localStorage.removeItem('token');
                    navigate('/login');
                }, 2000);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setAlert({ type: 'error', message: error.message });
            } else {
                setAlert({ type: 'error', message: 'An unknown error occurred' });
            }
        }
    };

    // 加载状态显示
    if (loading) {
        return <div className="dashboard-container">加载中...</div>;
    }

    // 错误状态显示
    if (error) {
        return <div className="dashboard-container">{error}</div>;
    }

    // 用户数据未加载完成
    if (!userData) {
        return <div className="dashboard-container">未找到用户数据</div>;
    }

    return (
        <div className="dashboard-container">
            {/* 全局提示组件 */}
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                    className="dashboard-alert"
                />
            )}

            {/* 用户头像区域 */}
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

            {/* 用户信息区域 */}
            <div className="dashboard-info">
                <h2 className="dashboard-username">用户名：{userData.username}</h2>
                {userData.address && (
                    <p className="dashboard-address">地址：{userData.address}</p>
                )}
                <p className="dashboard-phone">手机号：{userData.phone}</p>
                <p className="dashboard-balance">账户余额：¥{balance}</p>
                <p className="dashboard-balance">用户角色：{userData.role === 'admin' ? '管理员' : '普通用户'}</p>

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

            {/* 普通用户显示邀请码输入按钮 */}
            {userData.role === 'user' && (
                <div className="dashboard-button-row">
                    <Button
                        onClick={() => setShowInviteModal(true)}
                        variant="secondary"
                    >
                        输入管理员邀请码
                    </Button>
                </div>
            )}

            {/* 操作按钮区域 */}
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

                    {/* 管理员特有功能 */}
                    {userData.role === 'admin' && (
                        <div className="dashboard-button-row">
                            <Button
                                onClick={()=>navigate('/adminorder')}
                                variant="danger"
                            >
                                管理员订单管理系统
                            </Button>
                        </div>
                    )}
                </div>

                {/* 登出按钮 */}
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

            {/* 邀请码模态框 */}
            {showInviteModal && (
                <Modal
                    title="输入管理员邀请码"
                    onClose={() => setShowInviteModal(false)}
                >
                    <div className="dashboard-modal-content">
                        <Input
                            label="邀请码"
                            type="password"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            placeholder="请输入管理员邀请码"
                        />
                        <div className="dashboard-modal-actions">
                            <Button
                                onClick={() => setShowInviteModal(false)}
                                variant="secondary"
                            >
                                取消
                            </Button>
                            <Button
                                onClick={handleInviteCodeSubmit}
                                variant="primary"
                            >
                                确认
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