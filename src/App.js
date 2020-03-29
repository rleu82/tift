import React from 'react';
import XLSX from 'xlsx';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';

class App extends React.Component {
    // create ref of instance of input data
    itemRef = React.createRef();
    state = {
        selectedFile: '',
        selectedToArray: [],
        results: '',
        tableHeaders: []
    };

    // load xlsx for parsing
    chooseFile = event => {
        const selectFile = event.target.files[0];
        this.setState({ selectedFile: selectFile }, function() {
            console.log(this.state.selectedFile.name);
        });
    };

    // parsing data to array of json objects
    convert = () => {
        if (this.state.selectedFile) {
            console.log('hi');
            var fileReader = new FileReader();
            fileReader.onload = event => {
                var data = event.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary'
                    // cellDates: true
                });
                // after data is parsed
                var first_sheet_name = workbook.SheetNames[0];
                // get worksheet and parse to json: defval: '' include empty columns
                var worksheet = workbook.Sheets[first_sheet_name];
                // const selectToArray = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: '' });
                const selectToArray = XLSX.utils.sheet_to_json(worksheet, {
                    // raw: true,
                    dateNF: 'YYYY-MM-DD',
                    defval: ''
                });

                this.setState({ selectedToArray: selectToArray }, function() {
                    console.log(this.state.selectedToArray);
                    console.log(this.state.selectedToArray[1].prtnum);
                });
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
        this.setState({ tableHeaders }, function() {
            console.log(this.state.tableHeaders);
        });
    };

    // grab items enter and create array and filter inventory to find those items
    stringToArray = () => {
        const filterThis = this.state.selectedToArray;
        const items = this.itemRef.current.value;
        const filterOptions = items.split(',');
        // console.log(filterOptions);
        const results = filterThis.filter(function(el) {
            return filterOptions.indexOf(el.prtnum) >= 0;
        });
        console.log(results);
        this.setState({ results }, this.createHeader);
    };

    render() {
        if (this.state.results) {
            return (
                <div>
                    <input type="file" name="fileUpload" accept=".xls,.xlsx" onChange={this.chooseFile} />
                    <br />
                    <button type="button" name="uploadExcel" onClick={this.convert}>
                        Convert
                    </button>

                    <input type="text" name="qItems" ref={this.itemRef} placeholder="items..." />
                    <button type="button" onClick={this.stringToArray}>
                        query
                    </button>
                    <pre id="jsonData"></pre>
                    <ReactTable data={this.state.results} columns={this.state.tableHeaders} />
                </div>
            );
        }
        return (
            <div>
                <input type="file" name="fileUpload" accept=".xls,.xlsx" onChange={this.chooseFile} />
                <br />
                <button type="button" name="uploadExcel" onClick={this.convert}>
                    Convert
                </button>

                <input type="text" name="qItems" ref={this.itemRef} placeholder="items..." />
                <button type="button" onClick={this.stringToArray}>
                    query
                </button>
                <pre id="jsonData"></pre>
            </div>
        );
    }
}

export default App;
