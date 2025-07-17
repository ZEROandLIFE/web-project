import React, { useState, useEffect} from 'react';
import type { ChangeEvent } from 'react';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Alert from '../../common/Alert';
import { uploadBoxImage } from '../../../services/box';
import { fetchCurrentUser } from '../../../services/api';
import Textarea from '../../common/Textarea';
import '../../../blindBox/Box/createbox.css';

interface BoxItem {
    name: string;
    quantity: number;
}

interface CreateBoxFormProps {
    onSubmit: (boxData: {
        boxName: string;
        boxDescription: string;
        boxNum: number;
        boxAvatar: string;
        price: number;
        userId: string;
        items: BoxItem[];
    }) => void;
}

const CreateBoxForm: React.FC<CreateBoxFormProps> = ({ onSubmit }) => {
    const [boxName, setBoxName] = useState('');
    const [boxDescription, setBoxDescription] = useState(''); // 新增描述状态
    const [boxNum, setBoxNum] = useState(0);
    const [boxAvatar, setBoxAvatar] = useState('');
    const [price, setPrice] = useState(0);
    const [items, setItems] = useState<BoxItem[]>([{ name: '', quantity: 0 }]);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [userId, setUserId] = useState(''); // 从API获取用户ID

    // 组件加载时获取用户信息
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

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        setIsUploading(true);
        try {
            const file = e.target.files[0];
            const { url } = await uploadBoxImage(file);
            setBoxAvatar(url);
            setError('');
        } catch (err) {
            console.log(err);
            setError('图片上传失败');
        } finally {
            setIsUploading(false);
        }
    };

    const handleItemChange = (index: number, field: keyof BoxItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [field]: field === 'quantity' ? Number(value) : value
        };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: '', quantity: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length <= 1) return;
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 验证盲盒数量不超过物品数量总和
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        if (boxNum > totalItems) {
            setError('盲盒的数量不能大于包含物品中所有物品数量总和');
            return;
        }

        if (!boxName  || items.some(item => !item.name || item.quantity <= 0)) {//|| !boxAvatar
            setError('请填写所有必填字段');
            return;
        }

        if (!userId) {
            setError('无法获取用户信息，请重新登录');
            return;
        }

        onSubmit({
            boxName,
            boxDescription,
            boxNum,
            boxAvatar,
            price,
            userId,
            items
        });
    };

    return (
        <form className="create-box-form" onSubmit={handleSubmit}>
            {error && <Alert type="error" message={error} />}

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

            <div className="form-group">
                <label className="form-label">盲盒封面</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-file-input"
                    // required
                />
                {isUploading && <div className="upload-status">上传中...</div>}
                {boxAvatar && (
                    <div className="image-preview">
                        <img src={boxAvatar} alt="盲盒封面预览" />
                    </div>
                )}
            </div>

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

            <Button type="submit" fullWidth>
                创建盲盒
            </Button>
        </form>
    );
};

export default CreateBoxForm;