import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../blindBox/home.css';

interface HomeFormProps {
    onSearch: (searchTerm: string) => void;
}

const HomeForm: React.FC<HomeFormProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleCreateBox = () => {
        navigate('/createbox');
    };

    return (
        <div className="home-form">
            <input
                type="text"
                placeholder="搜索盲盒名称..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="home-search-input"
            />
            <button onClick={handleCreateBox} className="home-create-button">
                创建盲盒
            </button>
        </div>
    );
};

export default HomeForm;