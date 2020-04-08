import React from 'react';
import ReactTable from 'react-table-v6';

class Rtable extends React.Component {
    render() {
        return (
            <div className="query-results">
                <ReactTable
                    data={this.props.results}
                    columns={this.props.tableHeaders}
                    style={{
                        height: '60vh'
                    }}
                    defaultPageSize={50}
                />
            </div>
        );
    }
}

export default Rtable;
