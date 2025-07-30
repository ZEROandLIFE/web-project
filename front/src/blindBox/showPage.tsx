import React, { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { createShow, getAllShows, createComment, getComments } from '../services/show';
import type { Comment, Show } from '../services/show';
import { fetchCurrentUser } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import './showPage.css';

/**
 * 展示页面组件，用于显示用户分享的内容和评论
 */
const ShowPage: React.FC = () => {
    // 状态定义
    const [shows, setShows] = useState<Show[]>([]); // 所有分享内容列表
    const [comments, setComments] = useState<Record<number, Comment[]>>({}); // 评论数据，按showId分组
    const [newShow, setNewShow] = useState({
        description: '', // 新分享的描述
        image: null as File | null, // 上传的图片文件
        preview: '' // 图片预览URL
    });
    const [newComments, setNewComments] = useState<Record<number, string>>({}); // 新评论内容，按showId分组
    const [currentUser, setCurrentUser] = useState<{
        id: number;
        username: string;
        avatar?: string;
    } | null>(null); // 当前登录用户信息
    const [loading, setLoading] = useState(true); // 数据加载状态
    const fileInputRef = useRef<HTMLInputElement>(null); // 文件输入框的ref

    /**
     * 处理图片选择变化
     * @param e - 输入变化事件
     */
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                alert('请上传图片文件');
                return;
            }

            // 创建预览URL并更新状态
            const previewUrl = URL.createObjectURL(file);
            setNewShow({
                ...newShow,
                image: file,
                preview: previewUrl
            });
        }
    };

    // 组件卸载时释放预览URL内存
    useEffect(() => {
        return () => {
            if (newShow.preview) {
                URL.revokeObjectURL(newShow.preview);
            }
        };
    }, [newShow.preview]);

    /**
     * 初始化数据获取
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取当前用户信息
                const user = await fetchCurrentUser();
                setCurrentUser(user);

                // 获取所有分享内容
                const showsData = await getAllShows();
                setShows(showsData);

                // 获取所有评论
                const commentsMap: Record<number, Comment[]> = {};
                for (const show of showsData) {
                    const commentsData = await getComments(show.showId);
                    commentsMap[show.showId] = commentsData;
                }
                setComments(commentsMap);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /**
     * 创建新的分享内容
     */
    const handleCreateShow = async () => {
        if (!currentUser || !newShow.description) return;

        const formData = new FormData();
        formData.append('description', newShow.description);
        if (newShow.image) {
            formData.append('image', newShow.image);
        }

        try {
            // 调用API创建分享
            const createdShow = await createShow(formData);
            setShows([createdShow, ...shows]);
            // 重置表单
            setNewShow({ description: '', image: null, preview: '' });
        } catch (error) {
            console.error('Error creating show:', error);
        }
    };

    /**
     * 创建新的评论
     * @param showId - 目标分享内容的ID
     */
    const handleCreateComment = async (showId: number) => {
        if (!currentUser || !newComments[showId]) return;

        try {
            // 调用API创建评论
            const createdComment = await createComment({
                showId,
                content: newComments[showId]
            });

            // 更新评论列表
            setComments(prev => ({
                ...prev,
                [showId]: [...(prev[showId] || []), createdComment]
            }));

            // 清空当前评论输入框
            setNewComments(prev => ({ ...prev, [showId]: '' }));
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    // 加载状态显示
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="show-page">
            {/* 创建新分享的表单 */}
            {currentUser && (
                <div className="create-show">
                    <Textarea
                        label="分享你的想法"
                        value={newShow.description}
                        onChange={(e) => setNewShow({ ...newShow, description: e.target.value })}
                    />
                    <div className="image-upload">
                        {/* 隐藏的文件输入框 */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <Button onClick={() => fileInputRef.current?.click()}>
                            选择图片
                        </Button>
                        {/* 图片预览区域 */}
                        {newShow.preview && (
                            <div className="image-preview">
                                <img
                                    src={newShow.preview}
                                    alt="预览"
                                    onClick={() => fileInputRef.current?.click()}
                                />
                                <Button
                                    variant="text"
                                    onClick={() => setNewShow({ ...newShow, image: null, preview: '' })}
                                >
                                    删除
                                </Button>
                            </div>
                        )}
                    </div>
                    <Button onClick={handleCreateShow} className='submitbutton'>发布</Button>
                </div>
            )}

            {/* 分享内容列表 */}
            <div className="shows-list">
                {shows.map(show => (
                    <div key={show.showId} className="show-item">
                        {/* 分享头部信息 */}
                        <div className="show-header">
                            <img
                                src={show.userAvatar || 'default-avatar.png'}
                                alt={show.username}
                                className="avatar"
                            />
                            <div className="user-info">
                                <span className="username">{show.username}</span>
                                <span className="time">{new Date(show.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* 分享内容 */}
                        <div className="show-content">
                            <p>{show.description}</p>
                            {show.imageUrl && (
                                <img src={show.imageUrl} alt="分享图片" className="show-image" />
                            )}
                        </div>

                        {/* 评论区域 */}
                        <div className="comments-section">
                            {/* 评论列表 */}
                            <div className="comments-list">
                                {comments[show.showId]?.map(comment => (
                                    <div key={comment.commentId} className="comment">
                                        <div className="comment-header">
                                            <img
                                                src={comment.userAvatar || 'default-avatar.png'}
                                                alt={comment.username}
                                                className="avatar"
                                            />
                                            <div className="user-info">
                                                <span className="username">{comment.username}</span>
                                                <span className="time">{new Date(comment.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <p className="comment-content">{comment.content}</p>
                                    </div>
                                ))}
                            </div>

                            {/* 添加新评论 */}
                            {currentUser && (
                                <div className="add-comment">
                                    <Input
                                        label="评论"
                                        value={newComments[show.showId] || ''}
                                        onChange={(e) => setNewComments({
                                            ...newComments,
                                            [show.showId]: e.target.value
                                        })}
                                        placeholder="写下你的评论..."
                                    />
                                    <Button onClick={() => handleCreateComment(show.showId)} className='submitbutton'>评论</Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowPage;