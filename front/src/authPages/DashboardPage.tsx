import React from 'react';
import DashboardForm from '../components/Auth/DashboardForm';
import './Dashboard.css';

const DashboardPage: React.FC = () => {
    return (
        <div className="dashboard-page">
            <DashboardForm />
        </div>
    );
};

export default DashboardPage;