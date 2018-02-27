import React from 'react';

const UL = ({ className, children }) =>  (
    <ul className={`list ${className || ''}`}>
        {children}
    </ul>
);

const OL = ({ className, children }) =>  (
    <ol className={`list ${className || ''}`}>
        {children}
    </ol>
);

const LI = ({children}) => (
   <li className='list-item'>
        <span>{children}</span>
    </li>
);

module.exports = {
    UL,
    OL,
    LI,
};
