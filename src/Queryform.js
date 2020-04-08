import React from 'react';
import { CSVLink } from 'react-csv';

class Queryform extends React.Component {
    itemRef = React.createRef();
    render() {
        return (
            <div className="left-grid">
                <div className="left-wrapper">
                    <button className="upload-button">Select File</button>
                    <input type="file" name="file-upload" accept=".xls,.xlsx" onChange={this.props.chooseFile} />
                    <span>
                        <strong>
                            <em>{this.props.selectedFile}</em>
                        </strong>
                    </span>
                </div>
                <div className="right-wrapper">
                    <label htmlFor="item-numbers">Item Number(s):</label>
                    <input
                        type="text"
                        id="item-numbers"
                        name="qItems"
                        ref={this.itemRef}
                        value={this.props.queryValue}
                        onChange={this.props.handleInputChange}
                        onKeyPress={this.props.handleKeyEnter}
                        placeholder="items..."
                        disabled={this.props.isItDisabled}
                    />
                    <button
                        className="query"
                        type="button"
                        onClick={this.props.searchQuery}
                        disabled={this.props.isItDisabled}
                    >
                        Search
                    </button>
                    <button
                        className="query"
                        type="button"
                        onClick={this.props.handleInputReset}
                        disabled={this.props.isItDisabled}
                    >
                        Clear
                    </button>
                    {this.props.handleRender && (
                        <CSVLink data={this.props.results} filename="data.csv" target="_blank">
                            Export CSV
                        </CSVLink>
                    )}
                </div>
            </div>
        );
    }
}

export default Queryform;
