import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBox } from '../../services/box';
import Alert from '../../components/common/Alert';
import CreateBoxForm from '../../components/BlindBox/Box/CreateBoxForm';
import './createbox.css';

const CreateBox: React.FC = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (boxData: {
        boxName: string;
        boxDescription: string;
        boxNum: number;
        boxAvatar: string;
        price: number;
        userId: string;
        items: { name: string; quantity: number }[];
    }) => {
        try {
            await createBox(boxData);
            setSuccess(true);
            setError('');
            setTimeout(() => navigate('/home'), 2000);
        } catch (err) {
            console.error(err);
            setError('创建盲盒失败，请重试');
            setSuccess(false);
        }
    };

    return (
        <div className="create-box-container">
            <h1 className="create-box-title">创建新盲盒</h1>

            {success && (
                <Alert
                    type="success"
                    message="盲盒创建成功，即将跳转到首页..."
                />
            )}

            {error && <Alert type="error" message={error} />}

            <CreateBoxForm onSubmit={handleSubmit} />
        </div>
    );
};

export default CreateBox;