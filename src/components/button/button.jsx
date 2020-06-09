import React from 'react';

export default function Button({ onClick, disabled, ...props }) {
    return (
        <button className="btn-upload" disabled={disabled} onClick={onClick}>{props.children}</button>
    );
};
