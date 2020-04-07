import React from 'react';
import logo from './assets/tift.svg';

class Header extends React.Component {
    render() {
        return (
            <header>
                <div className="logo-container">
                    <img src={logo} className="logo" alt="logo" />
                </div>
                <div className="tran-container">
                    <span>TRAN'S INCREDIBLE FILTERING TOOL</span>
                </div>
            </header>
        );
    }
}

export default Header;
