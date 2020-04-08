import React from 'react';

class Filters extends React.Component {
    render() {
        return (
            <div className="right-grid">
                <div className="flag-container">
                    <label htmlFor="area" className="right-label">
                        Area:
                    </label>
                    <input type="text" id="area" name="area" className="right-input" />
                </div>
                <div className="flag-container">
                    <label htmlFor="wh-id" className="right-label">
                        Warehouse ID:
                    </label>
                    <input type="text" id="wh-id" name="wh-id" className="right-input" />
                </div>
                <div className="flag-container">
                    <label htmlFor="ohqr-min" className="right-label">
                        Minimum On Hand:
                    </label>
                    <input
                        type="number"
                        id="ohqr-min"
                        // ref={this.minRef}
                        name="ohqr-min"
                        min="0"
                        defaultValue="0"
                        onChange={this.props.handleMinChange}
                        placeholder="min..."
                        className="right-input"
                    />
                </div>
            </div>
        );
    }
}

export default Filters;
