import { Outlet } from 'react-router-dom';
import Head from './head';

const MainLayout = () => {
    return (
        <>
            <Head />
            <Outlet /> {/* 这里会渲染子路由 */}
        </>
    );
};

export default MainLayout;