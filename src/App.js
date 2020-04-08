import React from 'react';
import Header from './Header';
import Queryform from './Queryform';
import Filters from './Filters';
import Rtable from './Rtable';
import XLSX from 'xlsx';
import 'react-table-v6/react-table.css';

class App extends React.Component {
    state = {
        selectedFile: 'No File Selected',
        selectedToArray: [],
        results: [],
        tableHeaders: [],
        isItDisabled: true,
        queryValue: '',
        minValue: 0,
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
                    type: 'binary',
                    cellDates: true
                });
                // after data is parsed
                const first_sheet_name = workbook.SheetNames[0];
                // get worksheet and parse to json: defval: '' option includes empty columns
                const worksheet = workbook.Sheets[first_sheet_name];
                // const selectToArray = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: '' });
                const selectToArray = XLSX.utils.sheet_to_json(worksheet, {
                    raw: false,
                    dateNF: 'dd-mm-yyyy',
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
        const items = this.state.queryValue;
        const filterOptions = items.split(',').map(item => item.trim());
        // console.log(filterOptions);
        const results = filterThis.filter(function(el) {
            return filterOptions.indexOf(el.prtnum) >= 0;
        });
        // calculate availabilty on hand
        const calcResults = results.map(resItem => ({ ...resItem, OnHandQuantity: resItem.untqty - resItem.comqty }));
        console.log(results);
        const minNum = this.state.minValue;
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
    // manage minimun on hand quantity for search
    handleMinChange = event => {
        this.setState({ minValue: event.target.value });
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
                <Header />
                <div className="container">
                    <Queryform
                        chooseFile={this.chooseFile}
                        selectedFile={this.state.selectedFile.name}
                        queryValue={this.state.queryValue}
                        handleInputChange={this.handleInputChange}
                        handleKeyEnter={this.handleKeyEnter}
                        isItDisabled={this.state.isItDisabled}
                        searchQuery={this.searchQuery}
                        handleInputReset={this.handleInputReset}
                        handleRender={this.state.handleRender}
                        results={this.state.results}
                    />
                    <Filters handleMinChange={this.handleMinChange} />
                </div>
                {handleRender && <Rtable results={this.state.results} tableHeaders={this.state.tableHeaders} />}
            </React.Fragment>
        );
    }
}

export default App;
