import React from "react";

export const Button = ({ type, iconPosition, size, active, style }) => {
  return (
    <div className={`button ${type} ${size} ${iconPosition}`} style={style}>
      {iconPosition === "no-icon" && (
        <div className="edit-charts">
          {size === "small" && <>Edit charts</>}

          {size === "big" && <>Continue</>}
        </div>
      )}

      {iconPosition === "trail" && <div className="text-wrapper">Edit charts</div>}

      {active && <span>Active</span>}

      {type === "button-group" && (
        <>
          <div className="frame">
            <div className="last-months">Last 12 months</div>
          </div>
          <img
            className="line"
            alt="Line"
            src="https://anima-uploads.s3.amazonaws.com/projects/6461dc3d4b4599f8e9f432c4/releases/6461dc6bbb61d51c826284b2/img/line-26.svg"
          />
          <div className="div">
            <div className="element-aug-jul">1 Aug 2020-7 Jul</div>
          </div>
        </>
      )}

      {iconPosition === "lead" && <div className="edit-charts-2">Edit charts</div>}
    </div>
  );
};
