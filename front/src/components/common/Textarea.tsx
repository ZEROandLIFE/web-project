import React from 'react';
import './Input.css'; // 可以复用相同的样式

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, ...props }) => {
    return (
        <div className="input-group">
            <label htmlFor={id} className="input-label">
                {label}
            </label>
            <textarea id={id} className="input-field" {...props} />
        </div>
    );
};

export default Textarea;