import React, { useState, useRef, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { register } from '../../services/auth';

interface FormData {
    username: string;
    phone: string;
    address: string;
    password: string;
    confirmPassword: string;
    avatar: File | null;
    avatarPreview: string | null;
}

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<FormData>({
        username: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        avatar: null,
        avatarPreview: null,
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // 手机号特殊处理 - 只允许数字
        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: numericValue,
            }));
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 检查文件类型
            if (!file.type.match('image.*')) {
                setError('请上传图片文件');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    avatar: file,
                    avatarPreview: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        setFormData({
            username: '',
            phone: '',
            address: '',
            password: '',
            confirmPassword: '',
            avatar: null,
            avatarPreview: null,
        });
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // 验证逻辑
        if (formData.password !== formData.confirmPassword) {
            setError('两次输入的密码不一致');
            setLoading(false);
            return;
        }

        if (formData.phone.length !== 11) {
            setError('手机号必须是11位');
            setLoading(false);
            return;
        }

        try {
            // 创建FormData对象用于文件上传
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('password', formData.password);
            if (formData.avatar) {
                formDataToSend.append('avatar', formData.avatar);
            }

            await register(formDataToSend);
            setSuccess('注册成功！即将跳转到登录页面...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : '注册失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            <Input
                label="用户名"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
            />

            <Input
                label="手机号"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={11}
                required
            />

            <Input
                label="地址"
                type="text"
                name="address"
                value={formData.address}
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

            <Input
                label="确认密码"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />

            <div className="input-group">
                <label className="input-label">头像</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    ref={fileInputRef}
                    className="input-field"
                />
                {formData.avatarPreview && (
                    <div className="avatar-preview">
                        <img
                            src={formData.avatarPreview}
                            alt="头像预览"
                            className="avatar-image"
                        />
                    </div>
                )}
            </div>

            <div className="form-actions">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    disabled={loading}
                >
                    重置
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? '注册中...' : '注册'}
                </Button>
            </div>
        </form>
    );
};

export default RegisterForm;