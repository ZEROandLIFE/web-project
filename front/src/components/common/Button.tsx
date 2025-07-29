import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary' | 'text'| 'danger'|"success";
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           fullWidth = false,
                                           variant = 'primary',
                                           className = '',
                                           ...props
                                       }) => {
    return (
        <button
            className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;