import React from 'react';
import XLSX from 'xlsx';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import { CSVLink } from 'react-csv';
import logo from './assets/tift.svg';

class App extends React.Component {
    // create ref of instance of input data
    itemRef = React.createRef();
    minRef = React.createRef();

    state = {
        selectedFile: 'No File Selected',
        selectedToArray: [],
        results: [],
        tableHeaders: [],
        isItDisabled: true,
        queryValue: '',
        handleRender: false
    };

    // load xlsx for parsing
    chooseFile = event => {
        const selectFile = event.target.files[0];
        if (!selectFile) {
            return null;
        }
        return this.setState({ selectedFile: selectFile, isItDisabled: true }, function() {
            console.log(this.state.selectedFile.name);
            this.convert();
        });
    };

    // parsing data to array of json objects
    convert = () => {
        if (this.state.selectedFile) {
            const fileReader = new FileReader();
            fileReader.onload = event => {
                this.setState({ isItDisabled: true });
                const data = event.target.result;
                const workbook = XLSX.read(data, {
                    type: 'binary'
                    // cellDates: true
                });
                // after data is parsed
                const first_sheet_name = workbook.SheetNames[0];
                // get worksheet and parse to json: defval: '' option includes empty columns
                const worksheet = workbook.Sheets[first_sheet_name];
                // const selectToArray = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: '' });
                const selectToArray = XLSX.utils.sheet_to_json(worksheet, {
                    // raw: true,
                    dateNF: 'YYYY-MM-DD',
                    defval: ''
                });
                console.log(selectToArray);
                // create Table headers after sheet data is generated
                this.setState({ selectedToArray: selectToArray }, this.createHeader);
            };
            fileReader.readAsBinaryString(this.state.selectedFile);
        }
    };

    // create headers for table
    createHeader = () => {
        const headers = Object.keys(this.state.selectedToArray[0]);
        const tableHeaders = headers.map(column => {
            return {
                id: column,
                Header: column,
                accessor: column.toString()
            };
        });
        const onHandQuantity = {
            id: 'OnHandQuantity',
            Header: 'OnHandQuantity',
            accessor: 'OnHandQuantity'
        };
        tableHeaders.push(onHandQuantity);
        this.setState({ tableHeaders, isItDisabled: false }, function() {
            console.log(this.state.tableHeaders);
        });
    };

    // grab items enter and create array and filter inventory to find those items
    searchQuery = () => {
        const filterThis = this.state.selectedToArray;
        const items = this.itemRef.current.value;
        const filterOptions = items.split(',').map(item => item.trim());
        // console.log(filterOptions);
        const results = filterThis.filter(function(el) {
            return filterOptions.indexOf(el.prtnum) >= 0;
        });
        // calculate availabilty on hand
        const calcResults = results.map(resItem => ({ ...resItem, OnHandQuantity: resItem.untqty - resItem.comqty }));
        console.log(results);
        const minNum = this.minRef.current.value;
        let filterMinMax = calcResults;
        // filter range of onHandQuantity
        if (minNum > 0) {
            filterMinMax = calcResults.filter(rangeItem => rangeItem.OnHandQuantity >= minNum);
            this.setState({ results: filterMinMax, handleRender: true }, this.createHeader);
        } else {
            this.setState({ results: calcResults, handleRender: true }, this.createHeader);
        }
    };
    // use state to manage input value: equal what user types
    handleInputChange = event => {
        this.setState({ queryValue: event.target.value });
    };
    // clears the input
    handleInputReset = () => {
        this.setState({ queryValue: '' });
    };

    // check for 'Enter' to submit query
    handleKeyEnter = event => {
        if (event.key === 'Enter') {
            this.searchQuery();
        }
    };

    render() {
        let { handleRender } = this.state;

        return (
            <React.Fragment>
                <header>
                    <div className="logo-container">
                        <img src={logo} className="logo" alt="logo" />
                    </div>
                    <div className="tran-container">
                        <span>TRAN'S INCREDIBLE FILTERING TOOL</span>
                    </div>
                </header>
                <div className="container">
                    <div className="left-grid">
                        <div className="left-wrapper">
                            <button className="upload-button">Select File</button>
                            <input type="file" name="file-upload" accept=".xls,.xlsx" onChange={this.chooseFile} />
                            <span>
                                <strong>
                                    <em>{this.state.selectedFile.name}</em>
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
                                value={this.state.queryValue}
                                onChange={this.handleInputChange}
                                onKeyPress={this.handleKeyEnter}
                                placeholder="items..."
                                disabled={this.state.isItDisabled}
                            />
                            <button
                                className="query"
                                type="button"
                                onClick={this.searchQuery}
                                disabled={this.state.isItDisabled}
                            >
                                Search
                            </button>
                            <button
                                className="query"
                                type="button"
                                onClick={this.handleInputReset}
                                disabled={this.state.isItDisabled}
                            >
                                Clear
                            </button>
                            {handleRender && (
                                <CSVLink data={this.state.results} filename="data.csv" target="_blank">
                                    Export CSV
                                </CSVLink>
                            )}
                        </div>
                    </div>
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
                                ref={this.minRef}
                                name="ohqr-min"
                                min="0"
                                defaultValue="0"
                                placeholder="min..."
                                className="right-input"
                            />
                        </div>
                    </div>
                </div>
                {handleRender && (
                    <div className="query-results">
                        <ReactTable
                            data={this.state.results}
                            columns={this.state.tableHeaders}
                            style={{
                                height: '60vh'
                            }}
                            defaultPageSize={50}
                        />
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default App;
