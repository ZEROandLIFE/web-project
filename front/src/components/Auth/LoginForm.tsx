import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { login } from '../../services/auth';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        // 测试账号直接通过
        if (formData.username === '1' && formData.password === '1') {
            localStorage.setItem('token', 'test-token');
            navigate('/dashboard');
            return;
        }


        try {
            await login(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : '登录失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <Alert type="error" message={error} />}
            <Input
                label="用户名"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <Input
                label="密码"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <Button type="submit" disabled={loading} fullWidth>
                {loading ? '登录中...' : '登录'}
            </Button>
        </form>
    );
};

export default LoginForm;