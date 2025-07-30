import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeForm from '../components/BlindBox/HomeForm.tsx';
import { getAllBoxes } from '.././services/box';
import type { Box } from '.././services/box.ts';
import './home.css';

/**
 * 盲盒商城首页组件
 * 展示所有盲盒列表，提供搜索功能，并显示随机广告盲盒
 */
const Home: React.FC = () => {
    // 状态管理
    const [blindBoxes, setBlindBoxes] = useState<Box[]>([]); // 所有盲盒数据
    const [filteredBoxes, setFilteredBoxes] = useState<Box[]>([]); // 过滤后的盲盒数据
    const [loading, setLoading] = useState(true); // 加载状态
    const [error, setError] = useState(''); // 错误信息
    const [adBox, setAdBox] = useState<Box | null>(null); // 广告盲盒
    const navigate = useNavigate(); // 路由导航

    /**
     * 初始化数据获取
     * 页面加载时获取所有盲盒数据并设置广告
     */
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

    /**
     * 从盲盒数组中随机获取一个盲盒
     * @param boxes - 盲盒数组
     * @returns 随机盲盒对象
     */
    const getRandomBox = (boxes: Box[]): Box => {
        const randomIndex = Math.floor(Math.random() * boxes.length);
        return boxes[randomIndex];
    };

    /**
     * 广告轮播效果
     * 每5秒切换一次广告盲盒
     */
    useEffect(() => {
        if (blindBoxes.length === 0) return;

        const interval = setInterval(() => {
            setAdBox(getRandomBox(blindBoxes));
        }, 5000);

        return () => clearInterval(interval);
    }, [blindBoxes]);

    /**
     * 处理搜索功能
     * @param searchTerm - 搜索关键词
     */
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

    /**
     * 处理盲盒点击事件
     * 导航到盲盒详情页
     * @param boxId - 盲盒ID
     */
    const handleBoxClick = (boxId: string) => {
        navigate(`/boxdetail/${boxId}`);
    };

    /**
     * 处理广告盲盒点击事件
     * 导航到盲盒详情页
     * @param boxId - 盲盒ID
     */
    const handleAdClick = (boxId: string) => {
        navigate(`/boxdetail/${boxId}`);
    };

    // 加载状态显示
    if (loading) {
        return <div className="home-loading">加载中...</div>;
    }

    // 错误状态显示
    if (error) {
        return <div className="home-error">{error}</div>;
    }

    return (
        <div className="home-container">
            {/* 页面标题 */}
            <h1 className="home-title">盲盒商城</h1>

            {/* 搜索表单 */}
            <HomeForm onSearch={handleSearch} />

            {/* 广告区域 */}
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

            {/* 盲盒列表 */}
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