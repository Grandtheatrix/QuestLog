import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import scrollbarThumb from "../assets/scrollworkThumb.png"

export const CustomScrollBar =  (props) => {
    return (
    <Scrollbars
        autoHide
        autoHideTimeout={500}
        style={{ maxHeight: "80vh" }}
        renderTrackHorizontal={() =><div></div>}
        renderTrackVertical={({ style, ...props }) =>
        <div id="thisOne"{...props} style={{ ...style, width: 20, height: "100%" }} />
        }
        renderThumbVertical={({ style, ...props }) =>
        <img {...props} style={{ ...style }} src={scrollbarThumb} />
        }
    >
        {props.children}
    </Scrollbars>
    )
}