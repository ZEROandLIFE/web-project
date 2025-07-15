import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import './not-found.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>页面未找到</h2>
                <p>您访问的页面不存在或已被移除</p>
                <Button
                    onClick={() => navigate('/')}
                    variant="primary"
                >
                    返回首页
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;