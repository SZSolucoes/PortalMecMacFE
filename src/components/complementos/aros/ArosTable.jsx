import React, { Component } from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { onMount, onUnmount } from 'react-keydown/es/event_handlers';
import { setBinding, /*Keys as KeyDownKeys*/ } from 'react-keydown';
//import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';

import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../../utils/UtilsActions';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

class ManutencaoTable extends Component {
    constructor(props) {
        super(props);

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.onKeyUpOrDown = this.onKeyUpOrDown.bind(this);
        this.onClickRemover = this.onClickRemover.bind(this);

        this.state = {
            selectRow: {
                mode: 'radio',
                clickToSelect: true,
                bgColor: '#007BFF',
                hideSelectColumn: true,
                style: { color: 'white' },
                onSelect: this.handleOnSelect,
                selected: ['']
            }
        };
    }

    componentDidMount() {
        onMount(this);
    }

    componentWillUnmount() {
        onUnmount(this);
    }

    onKeyUpOrDown(event) {
        //console.log(event);
    }


    onClickRemover() {
        if (this.state.selectRow.selected[0]) {
            this.props.modifyModalTitle('Remover');
            this.props.modifyModalMessage('Confirma a remoção do registro selecionado ?');
            this.props.modifyExtraData({ 
                item: { id: this.state.selectRow.selected[0] }, 
                action: 'remove_comparostable' 
            });
            this.arostableBtnConfirmModalRef.click();
        }
    }

    handleOnSelect(row, isSelect, rowIndex, e) {
        if (isSelect) {
            this.setState({ selectRow: { ...this.state.selectRow, selected: [row.id] } });
        } else {
            this.setState({ selectRow: { ...this.state.selectRow, selected: [''] } });
        }
    }

    render() {
        const { columns, itemsAro } = this.props;
        const dataTable = itemsAro || [];
        const columnsTable = columns || [
            {
                dataField: 'id',
                text: 'id',
                sort: true,
                hidden: true,
                csvExport: false
            }, 
            {
                dataField: 'aro',
                text: 'Aro',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left' }
            }, 
            {
                dataField: 'subcat',
                text: 'Sub-categoria',
                sort: true,
                headerStyle: { textAlign: 'left' },
                style: { textAlign: 'left' }
            }
        ];
        return (
            <React.Fragment>
                <ToolkitProvider
                    keyField={'id'} 
                    data={dataTable} 
                    columns={columnsTable}
                    exportCSV={ {
                        fileName: 'complementosaros.csv',
                        noAutoBOM: false,
                        separator: ';'
                    }}
                    search
                >
                    {
                        props => (
                            <div>
                                <div className='arostabletools'>
                                    <div style={{ flex: 3 }}>
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => this.onClickRemover()}
                                            style={{ marginRight: 10 }}
                                        >
                                            Remover
                                        </button>
                                        <button
                                            ref={ref => (this.arostableBtnConfirmModalRef = ref)}
                                            hidden
                                            data-toggle="modal" data-target="#confirmmodal"
                                            data-backdrop="static" data-keyboard="false"
                                        />
                                        <CSVExport.ExportCSVButton { ...props.csvProps }>
                                            Exportar CSV
                                        </CSVExport.ExportCSVButton>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Search.SearchBar { ...props.searchProps } placeholder="Buscar..."/>
                                    </div>
                                </div>
                                <BootstrapTable
                                    
                                    { ...props.baseProps } 
                                    selectRow={this.state.selectRow}
                                    pagination={paginationFactory()}
                                    bordered={ false }
                                    striped
                                    condensed
                                    wrapperClasses="arostable"
                                    //filter={filterFactory()}
                                    exportCsv
                                    bootstrap4
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
            </React.Fragment>
        );
    }
}

const mapStateToProps = () => ({
});

setBinding({
    target: ManutencaoTable.prototype,
    fn: ManutencaoTable.prototype.onKeyUpOrDown,
    keys: [ /*KeyDownKeys.UP, KeyDownKeys.DOWN*/ ]
});

export default connect(mapStateToProps, {
    modifyModalTitle, 
    modifyModalMessage, 
    modifyExtraData
})(ManutencaoTable);

