import React from 'react'
import './Navbar.css';

const Navbar = (props) => {
    return (
        <div className="topbar d-block align-items-center">
            <div className="navbar justify-content-between ">
            {props.children}
            </div>
        </div>
    )
}



export default Navbar;
