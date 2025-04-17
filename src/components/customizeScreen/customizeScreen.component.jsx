import React from "react";
import Menu from "../menu/menu.component";
import './customize.styles.css';
import Portrait from "../portrait/portrait.component";

const CustomizeScreen = () => {
    return (
        <div className="custom">
            <Menu className="menu"/>
            <Portrait className="selection"/>
        </div>
    );
}

export default CustomizeScreen;
