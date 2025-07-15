import React from 'react';
import './Alert.css';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
    type: AlertType;
    message: string;
    className?: string;
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, className = '', onClose }) => {
    const alertClasses = `alert alert-${type} ${className}`;

    return (
        <div className={alertClasses}>
            <div className="alert-message">{message}</div>
            {onClose && (
                <button className="alert-close" onClick={onClose}>
                    &times;
                </button>
            )}
        </div>
    );
};

export default Alert;