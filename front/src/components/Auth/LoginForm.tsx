import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { login } from '../../services/beforeLogin.ts';

/**
 * 用户登录表单组件
 */
const LoginForm = () => {
    // 设置页面标题
    useEffect(() => {
        document.title = '用户登录 - 盲盒平台';
    }, []);

    // 表单数据状态
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    // 错误信息和加载状态
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 路由导航
    const navigate = useNavigate();

    /**
     * 处理输入框变化
     * @param e - 输入框变化事件
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * 处理表单提交
     * @param e - 表单提交事件
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 调用登录API
            await login(formData.username, formData.password);
            // 登录成功后跳转到首页
            navigate('/home');
        } catch (err) {
            // 处理登录错误
            setError(err instanceof Error ? err.message : '登录失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {/* 错误提示 */}
            {error && <Alert type="error" message={error} />}

            {/* 用户名输入框 */}
            <Input
                label="用户名"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
            />

            {/* 密码输入框 */}
            <Input
                label="密码"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            {/* 提交按钮 */}
            <Button type="submit" disabled={loading} fullWidth>
                {loading ? '登录中...' : '登录'}
            </Button>
        </form>
    );
};

export default LoginForm;