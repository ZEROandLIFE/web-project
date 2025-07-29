import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeForm from '../components/BlindBox/HomeForm.tsx';
import { getAllBoxes } from '.././services/box';
import type { Box } from '.././services/box.ts';
import './home.css';

const Home: React.FC = () => {
    const [blindBoxes, setBlindBoxes] = useState<Box[]>([]);
    const [filteredBoxes, setFilteredBoxes] = useState<Box[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [adBox, setAdBox] = useState<Box | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = '盲盒商城';
        const fetchBoxes = async () => {
            try {
                const boxes = await getAllBoxes();
                setBlindBoxes(boxes);
                setFilteredBoxes(boxes);

                // 初始化广告
                if (boxes.length > 0) {
                    setAdBox(getRandomBox(boxes));
                }
            } catch (err) {
                console.error('获取盲盒失败:', err);
                setError('获取盲盒数据失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };
        fetchBoxes();
    }, []);

    // 随机获取一个盲盒
    const getRandomBox = (boxes: Box[]): Box => {
        const randomIndex = Math.floor(Math.random() * boxes.length);
        return boxes[randomIndex];
    };

    // 广告轮播效果
    useEffect(() => {
        if (blindBoxes.length === 0) return;

        const interval = setInterval(() => {
            setAdBox(getRandomBox(blindBoxes));
        }, 5000); // 每5秒切换一次广告

        return () => clearInterval(interval);
    }, [blindBoxes]);

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) {
            setFilteredBoxes(blindBoxes);
            return;
        }

        const filtered = blindBoxes.filter(box =>
            box.boxName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBoxes(filtered);
    };

    const handleBoxClick = (boxId: string) => {
        navigate(`/boxdetail/${boxId}`);
    };

    const handleAdClick = (boxId: string) => {
        navigate(`/boxdetail/${boxId}`);
    };

    if (loading) {
        return <div className="home-loading">加载中...</div>;
    }

    if (error) {
        return <div className="home-error">{error}</div>;
    }

    return (
        <div className="home-container">
            <h1 className="home-title">盲盒商城</h1>

            <HomeForm onSearch={handleSearch} />

            {/* 广告部分 */}
            {adBox && (
                <div
                    className="home-ad-container"
                    onClick={() => handleAdClick(adBox.boxId)}
                >
                    <div className="home-ad-content">
                        <h3>热门推荐</h3>
                        <div className="home-ad-box">
                            {adBox.boxAvatar ? (
                                <img
                                    src={adBox.boxAvatar}
                                    alt={adBox.boxName}
                                    className="home-ad-image"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/assets/no-image.png';
                                        (e.target as HTMLImageElement).alt = '暂无图片';
                                    }}
                                />
                            ) : (
                                <div className="home-ad-no-image">暂无图片</div>
                            )}
                            <div className="home-ad-info">
                                <h4 className="home-ad-name">{adBox.boxName}</h4>
                                <div className="home-ad-details">
                                    <span>剩余: {adBox.boxNum}</span>
                                    <span className="home-ad-price">¥{adBox.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="home-boxes-grid">
                {filteredBoxes.length > 0 ? (
                    filteredBoxes.map(box => (
                        <div
                            key={box.boxId}
                            className="home-box-item"
                            onClick={() => handleBoxClick(box.boxId)}
                        >
                            {box.boxAvatar ? (
                                <img
                                    src={box.boxAvatar}
                                    alt={box.boxName}
                                    className="home-box-image"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/assets/no-image.png';
                                        (e.target as HTMLImageElement).alt = '暂无图片';
                                    }}
                                />
                            ) : (
                                <div className="home-box-no-image">暂无图片</div>
                            )}
                            <h3 className="home-box-name">{box.boxName}</h3>
                            <div className="home-box-info">
                                <span className="home-box-num">数量: {box.boxNum}</span>
                                <span className="home-box-price">¥{box.price}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="home-no-results">没有找到匹配的盲盒</div>
                )}
            </div>
        </div>
    );
};

export default Home;