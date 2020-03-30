import React from 'react';
import XLSX from 'xlsx';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import { CSVLink, CSVDownload } from 'react-csv';

class App extends React.Component {
    // create ref of instance of input data
    itemRef = React.createRef();
    state = {
        selectedFile: '',
        selectedToArray: [],
        results: '',
        tableHeaders: [],
        isItDisabled: true,
        queryValue: ''
    };

    // load xlsx for parsing
    chooseFile = event => {
        const selectFile = event.target.files[0];
        this.setState({ selectedFile: selectFile, isItDisabled: true }, function() {
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
        this.setState({ tableHeaders, isItDisabled: false }, function() {
            console.log(this.state.tableHeaders);
        });
    };

    // grab items enter and create array and filter inventory to find those items
    stringToArray = () => {
        const filterThis = this.state.selectedToArray;
        const items = this.itemRef.current.value;
        const filterOptions = items.split(',').map(item => item.trim());
        // console.log(filterOptions);
        const results = filterThis.filter(function(el) {
            return filterOptions.indexOf(el.prtnum) >= 0;
        });
        console.log(results);
        this.setState({ results }, this.createHeader);
    };
    // use state to manage input value: equal what user types
    handleInputChange = event => {
        this.setState({ queryValue: event.target.value });
    };
    // clears the input
    handleInputReset = () => {
        this.setState({ queryValue: '' });
    };

    render() {
        if (this.state.results) {
            return (
                <React.Fragment>
                    <header>
                        <h1>Tran's Incredible Filtering Tool</h1>
                    </header>
                    <div className="container">
                        <div className="left-wrapper">
                            <button className="upload-button">Select File</button>
                            <input type="file" name="file-upload" accept=".xls,.xlsx" onChange={this.chooseFile} />
                        </div>
                        <div className="right-wrapper">
                            <input
                                type="text"
                                name="qItems"
                                ref={this.itemRef}
                                value={this.state.queryValue}
                                onChange={this.handleInputChange}
                                placeholder="items..."
                                disabled={this.state.isItDisabled}
                            />
                            <button
                                className="query"
                                type="button"
                                onClick={this.stringToArray}
                                disabled={this.state.isItDisabled}
                            >
                                Query
                            </button>
                            <button
                                className="query"
                                type="button"
                                onClick={this.handleInputReset}
                                disabled={this.state.isItDisabled}
                            >
                                Clear
                            </button>
                        </div>
                        <div>
                            <ReactTable
                                data={this.state.results}
                                columns={this.state.tableHeaders}
                                style={{
                                    height: '400px'
                                }}
                                defaultPageSize={50}
                            />
                        </div>
                    </div>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <header>
                    <h1>Tran's Incredible Filtering Tool</h1>
                </header>
                <div className="container">
                    <div className="left-wrapper">
                        <button className="upload-button">Select File</button>
                        <input type="file" name="file-upload" accept=".xls,.xlsx" onChange={this.chooseFile} />
                    </div>
                    <div className="right-wrapper">
                        <input
                            type="text"
                            name="qItems"
                            ref={this.itemRef}
                            value={this.state.queryValue}
                            placeholder="items..."
                            onChange={this.handleInputChange}
                            disabled={this.state.isItDisabled}
                        />
                        <button
                            className="query"
                            type="button"
                            onClick={this.stringToArray}
                            disabled={this.state.isItDisabled}
                        >
                            Query
                        </button>
                        <button
                            className="query"
                            type="button"
                            onClick={this.handleInputReset}
                            disabled={this.state.isItDisabled}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default App;
