import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import scrollbarThumb from "../assets/scrollworkThumb.png"

export const CustomScrollBar =  (props) => {
    return (
    <Scrollbars
        autoHide
        autoHideTimeout={500}
        style={{ maxHeight: "80vh" }}
        renderView={props => (
            <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />
        )}
        renderTrackHorizontal={() =><div></div>}
        renderTrackVertical={({ style, ...props }) =>
        <div id="thisOne"{...props} style={{ ...style, width: 20, height: "100%" }} />
        }
        renderThumbVertical={({ style, ...props }) =>
        <img {...props} style={{ ...style, height:125}} src={scrollbarThumb} />
        }
        // renderView={props => <div {...props} className="view" style={{borderTop:"solid black 2px"}}/>}
    >
        {props.children}
    </Scrollbars>
    )
}