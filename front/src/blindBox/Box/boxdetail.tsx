import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';

import {  useNavigate } from 'react-router-dom';
import { getBoxById } from '../../services/box';
import { deleteBox } from '../../services/box';
import type{Box} from "../../services/box";
import { fetchCurrentUser } from '../../services/api';
import Button from '../../components/common/Button';
// import Alert from '../../common/Alert';
import './boxdetail.css';

const BoxDetail: React.FC = () => {
    const { boxId } = useParams<{ boxId: string }>();
    const [box, setBox] = useState<Box | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取盲盒详情
                const boxData = await getBoxById(boxId!);
                setBox(boxData);

                // 获取当前用户ID
                const user = await fetchCurrentUser();
                setCurrentUserId(user.id);
            } catch (err) {
                console.error('获取数据失败:', err);
                setError('获取盲盒详情失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [boxId]);

    const handleTakeDown = async () => {
        if (!boxId) return;
        try {
            await deleteBox(boxId);
            alert('盲盒已成功下架');
            navigate('/home');

        } catch (error) {
            console.error('下架盲盒失败:', error);
            alert('下架盲盒失败，请稍后重试');
        }
    };

    const handlePurchase = () => {
        // TODO: 实现购买逻辑
        alert('购买功能待实现');
    };

    if (loading) {
        return <div className="boxdetail-loading">加载中...</div>;
    }

    if (error) {
        return <div className="boxdetail-error">{error}</div>;
    }

    if (!box) {
        return <div className="boxdetail-not-found">盲盒不存在</div>;
    }

    return (
        <div className="boxdetail-container">
            <div className="boxdetail-header">
                <h1 className="boxdetail-title">{box.boxName}</h1>
                <div className="boxdetail-actions">
                    {currentUserId === box.userId ? (
                        <Button variant="secondary" onClick={handleTakeDown}>
                            下架盲盒
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handlePurchase}>
                            购买盲盒
                        </Button>
                    )}
                </div>
            </div>

            <div className="boxdetail-content">
                <div className="boxdetail-image-section">
                    {box.boxAvatar ? (
                        <img
                            src={box.boxAvatar}
                            alt={box.boxName}
                            className="boxdetail-image"
                        />
                    ) : (
                        <div className="boxdetail-no-image">暂无图片</div>
                    )}
                </div>

                <div className="boxdetail-info-section">
                    <div className="boxdetail-meta">
                        <div className="boxdetail-meta-item">
                            <span className="boxdetail-meta-label">数量:</span>
                            <span className="boxdetail-meta-value">{box.boxNum}</span>
                        </div>
                        <div className="boxdetail-meta-item">
                            <span className="boxdetail-meta-label">价格:</span>
                            <span className="boxdetail-meta-value">¥{box.price}</span>
                        </div>
                    </div>

                    {box.description && (
                        <div className="boxdetail-description">
                            <h3>盲盒描述</h3>
                            <p>{box.description}</p>
                        </div>
                    )}

                    <div className="boxdetail-items">
                        <h3>包含物品</h3>
                        <ul className="boxdetail-items-list">
                            {box.items.map((item, index) => (
                                <li key={index} className="boxdetail-item">
                                    <span className="boxdetail-item-name">{item.name}</span>
                                    <span className="boxdetail-item-quantity">x{item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoxDetail;