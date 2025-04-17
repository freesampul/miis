import React, { useState } from 'react';
import './menu.styles.css';
import MenuOption from './menuoption.component';
import options from '../../contexts/options';

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Face");

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (type) => {
        setSelectedOption(type);
    };

    return (
        <div className="menu-container">
            <div className="hamburger" onClick={toggleMenu}>
                ☰
            </div>
            <div className={`menu-options ${isOpen ? 'open' : ''}`}>
                {Object.keys(options).map((type) => (
                    <Option key={type} type={type} onClick={() => handleOptionClick(type)} />
                ))}
            </div>
            <div className="selectables-container">
                {options[selectedOption].map((item, index) => (
                    <MenuOption key={index} type={item} />
                ))}
            </div>
        </div>
    );
}

const Option = ({ type, onClick }) => {
    return (
        <div className="option-box" onClick={onClick}>
            {type}
        </div>
    );
}

export default Menu;
