import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Alert from '../../common/Alert';
import { fetchCurrentUser } from '../../../services/api';
import Textarea from '../../common/Textarea';
import '../../../blindBox/Box/createbox.css';

// 定义盲盒物品项的接口类型
interface BoxItem {
    name: string;
    quantity: number;
}

// 定义组件props的类型
interface CreateBoxFormProps {
    onSubmit: (boxData: {
        boxName: string;
        boxDescription: string;
        boxNum: number;
        boxAvatar?: File;
        price: number;
        userId: string;
        items: BoxItem[];
    }) => void;
}

/**
 * 创建盲盒表单组件
 * @param props - 组件props，包含提交回调函数
 * @returns 返回盲盒创建表单的React组件
 */
const CreateBoxForm: React.FC<CreateBoxFormProps> = ({ onSubmit }) => {
    // 表单状态管理
    const [boxName, setBoxName] = useState('');
    const [boxDescription, setBoxDescription] = useState('');
    const [boxNum, setBoxNum] = useState(0);
    const [boxAvatarFile, setBoxAvatarFile] = useState<File | null>(null);
    const [boxAvatarPreview, setBoxAvatarPreview] = useState('');
    const [price, setPrice] = useState(0);
    const [items, setItems] = useState<BoxItem[]>([{ name: '', quantity: 0 }]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');

    // 副作用：初始化页面标题并获取当前用户信息
    useEffect(() => {
        document.title = '创建盲盒 - 盲盒平台';

        const fetchUser = async () => {
            try {
                const user = await fetchCurrentUser();
                setUserId(user.id);
            } catch (err) {
                console.error('获取用户信息失败:', err);
                setError('获取用户信息失败，请重新登录');
            }
        };

        fetchUser();
    }, []);

    /**
     * 处理盲盒封面图片上传
     * @param e - 文件输入变化事件
     */
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBoxAvatarFile(file);

            // 创建图片预览URL
            const previewUrl = URL.createObjectURL(file);
            setBoxAvatarPreview(previewUrl);
        }
    };

    /**
     * 处理物品项变化
     * @param index - 物品项在数组中的索引
     * @param field - 更新的字段名（name或quantity）
     * @param value - 新的值
     */
    const handleItemChange = (index: number, field: keyof BoxItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [field]: field === 'quantity' ? Number(value) : value
        };
        setItems(newItems);
    };

    /**
     * 添加新的物品项
     */
    const addItem = () => {
        setItems([...items, { name: '', quantity: 0 }]);
    };

    /**
     * 删除指定的物品项
     * @param index - 要删除的物品项索引
     */
    const removeItem = (index: number) => {
        if (items.length <= 1) return; // 至少保留一个物品项
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    /**
     * 处理表单提交
     * @param e - 表单提交事件
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 验证盲盒数量不超过物品数量总和
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        if (boxNum > totalItems) {
            setError('盲盒的数量不能大于包含物品中所有物品数量总和');
            return;
        }

        // 验证必填字段
        if (!boxName || items.some(item => !item.name || item.quantity <= 0)) {
            setError('请填写所有必填字段');
            return;
        }

        // 验证用户信息
        if (!userId) {
            setError('无法获取用户信息，请重新登录');
            return;
        }

        // 调用父组件提交回调
        onSubmit({
            boxName,
            boxDescription,
            boxNum,
            boxAvatar: boxAvatarFile || undefined,
            price,
            userId,
            items
        });
    };

    return (
        <form className="create-box-form" onSubmit={handleSubmit}>
            {/* 错误提示 */}
            {error && <Alert type="error" message={error} />}

            {/* 盲盒基本信息 */}
            <Input
                label="盲盒名称"
                id="boxName"
                value={boxName}
                onChange={(e) => setBoxName(e.target.value)}
                required
            />

            <Textarea
                label="盲盒描述"
                id="boxDescription"
                value={boxDescription}
                onChange={(e) => setBoxDescription(e.target.value)}
                rows={3}
            />

            <Input
                label="盲盒数量"
                id="boxNum"
                type="number"
                min="1"
                value={boxNum}
                onChange={(e) => setBoxNum(Number(e.target.value))}
                required
            />

            <Input
                label="盲盒价格"
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
            />

            {/* 盲盒封面上传 */}
            <div className="form-group">
                <label className="form-label">盲盒封面</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-file-input"
                />
                {boxAvatarPreview && (
                    <div className="image-preview">
                        <img src={boxAvatarPreview} alt="盲盒封面预览" />
                    </div>
                )}
            </div>

            {/* 包含物品管理 */}
            <div className="items-section">
                <h3 className="items-title">包含物品 (总数量: {items.reduce((sum, item) => sum + item.quantity, 0)})</h3>
                {items.map((item, index) => (
                    <div key={index} className="item-row">
                        <Input
                            label="物品名称"
                            id={`itemName-${index}`}
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            required
                        />
                        <Input
                            label="物品数量"
                            id={`itemQuantity-${index}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            required
                        />
                        <Button
                            type="button"
                            variant="text"
                            onClick={() => removeItem(index)}
                            disabled={items.length <= 1}
                        >
                            删除
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="secondary" onClick={addItem}>
                    添加物品
                </Button>
            </div>

            {/* 提交按钮 */}
            <Button type="submit" fullWidth>
                创建盲盒
            </Button>
        </form>
    );
};

export default CreateBoxForm;