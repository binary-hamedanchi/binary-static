import React from 'react';

const Button = ({
    id,
    className,
    text,
    has_effect,
    is_disabled,
    onClick,
}) => {
    const classes = `btn${has_effect ? ' effect' : ''} ${className || 'primary green'}`;
    return (
        <button id={id} className={classes} onClick={onClick || undefined} disabled={is_disabled}>
            <span>{text}</span>
        </button>
    );
};

export default Button;
