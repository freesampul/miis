import React from 'react';
import './menuoption.styles.css';

const MenuOption = ({ type }) => {
    return (
        <div className="pickable-option">
            {type}
        </div>
    );
}

export default MenuOption;
