import React from 'react'

const ComponentWrapper = (props) => {
    return (
        <div className=" h-100 w-100">
            {props.children}
        </div>
    )
};
export default ComponentWrapper;
