import React from 'react';

const UL = ({ items, className }) =>  (
    <ul className={`list ${className || ''}`}>
        { items.map((item, idx) => (
            <li key={idx} className='list-item'>
                <span>{item.li}</span>
            </li>
        ))}
    </ul>
);

const OL = ({ items, className }) =>  (
    <ol className={`list ${className || ''}`}>
        { items.map((item, idx) => (
            <li key={idx} className='list-item'>
                <span>{item.li}</span>
            </li>
        ))}
    </ol>
);

module.exports = {
    UL,
    OL,
};
