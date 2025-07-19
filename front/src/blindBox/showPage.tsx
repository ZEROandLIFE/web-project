import React, { useState, useEffect, useRef, }from 'react';
import type{ChangeEvent} from 'react';
import { createShow, getAllShows, createComment, getComments } from '../services/show';
import type{Comment,Show} from '../services/show';
import { fetchCurrentUser } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import './showPage.css';

const ShowPage: React.FC = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [newShow, setNewShow] = useState({
        description: '',
        image: null as File | null,
        preview: '' // 新增预览URL状态
    });
    const [newComments, setNewComments] = useState<Record<number, string>>({});
    const [currentUser, setCurrentUser] = useState<{
        id: number;
        username: string;
        avatar?: string; // 改为支持File类型
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // 处理图片选择
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 检查文件类型
            if (!file.type.startsWith('image/')) {
                alert('请上传图片文件');
                return;
            }

            // 创建预览URL
            const previewUrl = URL.createObjectURL(file);
            setNewShow({
                ...newShow,
                image: file,
                preview: previewUrl
            });
        }
    };
    // 组件卸载时释放预览URL
    useEffect(() => {
        return () => {
            if (newShow.preview) {
                URL.revokeObjectURL(newShow.preview);
            }
        };
    }, [newShow.preview]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await fetchCurrentUser();
                setCurrentUser(user);

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

    const handleCreateShow = async () => {
        if (!currentUser || !newShow.description) return;

        const formData = new FormData();
        formData.append('description', newShow.description);
        if (newShow.image) {
            formData.append('image', newShow.image);
        }
        // 添加用户头像
        if (currentUser.avatar) {
            formData.append('userAvatar', currentUser.avatar);
        }

        try {
            const createdShow = await createShow(formData);
            setShows([createdShow, ...shows]);
            setNewShow({ description: '', image: null, preview: '' });
        } catch (error) {
            console.error('Error creating show:', error);
        }
    };

    const handleCreateComment = async (showId: number) => {
        if (!currentUser || !newComments[showId]) return;

        try {
            const createdComment = await createComment({
                showId,
                content: newComments[showId]
            });

            setComments(prev => ({
                ...prev,
                [showId]: [...(prev[showId] || []), createdComment]
            }));

            setNewComments(prev => ({ ...prev, [showId]: '' }));
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="show-page">
            {currentUser && (
                <div className="create-show">
                    <Textarea
                        label="分享你的想法"
                        value={newShow.description}
                        onChange={(e) => setNewShow({ ...newShow, description: e.target.value })}
                    />
                    <div className="image-upload">
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
                        {newShow.preview && (
                            <div className="image-preview">
                                <img
                                    src={newShow.preview}
                                    alt="预览"
                                    onClick={() => fileInputRef.current?.click()}
                                />
                                <Button
                                    variant="text"
                                    onClick={() => setNewShow({...newShow, image: null, preview: ''})}
                                >
                                    删除
                                </Button>
                            </div>
                        )}
                    </div>
                    <Button onClick={handleCreateShow} className='submitbutton'>发布</Button>
                </div>
            )}

            <div className="shows-list">
                {shows.map(show => (
                    <div key={show.showId} className="show-item">
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

                        <div className="show-content">
                            <p>{show.description}</p>
                            {show.imageUrl && (
                                <img src={show.imageUrl} alt="分享图片" className="show-image" />
                            )}
                        </div>

                        <div className="comments-section">
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