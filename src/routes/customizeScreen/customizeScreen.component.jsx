import React from "react";
import Menu from "../../components/menu/menu.component";
import './customize.styles.css';
import Portrait from "../../components/portrait/portrait.component";
import html2canvas from 'html2canvas';

const CustomizeScreen = () => {
    const captureRef = React.useRef(null);

    const handleCaptureClick = () => {
        if (captureRef.current) {
          html2canvas(captureRef.current)
            .then((canvas) => {
              const base64image = canvas.toDataURL("image/png");
              const link = document.createElement('a');
              link.href = base64image;
              link.download = 'doople.png';
              link.click();
            })
            .catch(err => console.error('Something went wrong:', err));
        }
      };

    return (
      <>
        <div className="custom">
            <div className="menu-container">
                <Menu />
            </div>
            <div className="portrait-container">
                <Portrait ref={captureRef} />
            </div>
        </div>
        <button className="save-image" onClick={handleCaptureClick}>Save portrait</button>
        </>
    );
}

export default CustomizeScreen;