import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
    return (
        <div className="input-group">
            <label htmlFor={id} className="input-label">
                {label}
            </label>
            <input id={id} className="input-field" {...props} />
        </div>
    );
};

export default Input;