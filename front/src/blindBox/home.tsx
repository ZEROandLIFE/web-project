import React, { useState, useEffect } from 'react';
import HomeForm from '../components/BlindBox/HomeForm.tsx';
import './home.css';

interface BlindBox {
    id: string;
    name: string;
    imageUrl: string;
    remaining: number;
}

const Home: React.FC = () => {
    const [blindBoxes, setBlindBoxes] = useState<BlindBox[]>([]);
    const [filteredBoxes, setFilteredBoxes] = useState<BlindBox[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = '盲盒平台';
        // 模拟数据获取
        const mockData: BlindBox[] = [
            {
                id: '1',
                name: '神秘海洋盲盒',
                imageUrl: '/assets/box1.jpg',
                remaining: 42,
            },
            {
                id: '2',
                name: '星空系列盲盒',
                imageUrl: '/assets/box2.jpg',
                remaining: 15,
            },
            {
                id: '3',
                name: '动物森林盲盒',
                imageUrl: '/assets/box3.jpg',
                remaining: 28,
            },
            {
                id: '4',
                name: '复古玩具盲盒',
                imageUrl: '/assets/box4.jpg',
                remaining: 7,
            },
        ];

        setBlindBoxes(mockData);
        setFilteredBoxes(mockData);
        setLoading(false);
    }, []);

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) {
            setFilteredBoxes(blindBoxes);
            return;
        }

        const filtered = blindBoxes.filter(box =>
            box.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBoxes(filtered);
    };

    if (loading) {
        return <div className="home-loading">加载中...</div>;
    }

    return (
        <div className="home-container">
            <h1 className="home-title">盲盒商城</h1>

            <HomeForm onSearch={handleSearch} />

            <div className="home-boxes-grid">
                {filteredBoxes.length > 0 ? (
                    filteredBoxes.map(box => (
                        <div key={box.id} className="home-box-item">
                            <img
                                src={box.imageUrl}
                                alt={box.name}
                                className="home-box-image"
                            />
                            <h3 className="home-box-name">{box.name}</h3>
                            <p className="home-box-remaining">剩余: {box.remaining}个</p>
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