import React from 'react';
import { useAvatar } from '../../contexts/avatarContext.contexts';
import './portrait.styles.css';

const Portrait = () => {
    const { avatar, randomizeAvatar } = useAvatar();

    return (
        <div className="portrait">
            {Object.entries(avatar).map(([key, value]) => (
                <h2 key={key}>{key}: {value}</h2>
            ))}
            <button onClick={randomizeAvatar}>Randomize</button>
        </div>
    );
}

export default Portrait;
