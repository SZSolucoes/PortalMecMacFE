import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { change } from 'redux-form';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { onMount, onUnmount } from 'react-keydown/es/event_handlers';
import { setBinding, /*Keys as KeyDownKeys*/ } from 'react-keydown';
//import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import CSVReader from 'react-csv-reader';
import ReactDropzone from "react-dropzone";
import Papa from 'papaparse';
import _ from 'lodash';

import ItemManutencaoTableModal from './ItemManutencaoTableModal';
import { store } from '../../../index';
import { doGetLastId } from './ItemManutencaoActions';
import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../../utils/UtilsActions';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

class ItemManutencaoTable extends Component {
    constructor(props) {
        super(props);

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.onDropCsv = this.onDropCsv.bind(this);
        this.onKeyUpOrDown = this.onKeyUpOrDown.bind(this);
        this.onClickIncluir = this.onClickIncluir.bind(this);
        this.onClickRemover = this.onClickRemover.bind(this);
        this.onClickImportCsv = this.onClickImportCsv.bind(this);
        this.handleCsvFile = this.handleCsvFile.bind(this);
        this.handleCsvFileError = this.handleCsvFileError.bind(this);

        //this.importCsvItemManut = React.createRef();

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
        }
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

    onDropCsv(acceptedFiles, rejectedFiles) {
        const numAcceptedFiles = acceptedFiles.length;

        if (numAcceptedFiles) {
            Promise.all(acceptedFiles.map(
                file =>
                    new Promise(
                        (resolve, reject)=>
                        Papa.parse(
                          file,
                          {
                            delimiter: ';',
                            skipEmptyLines: true,
                            complete: resolve,
                            error: reject
                          }
                        )
                    )
                )
            )
            .then(
                (results) => {
                    let data = results.map(rows => rows.data);
                    data = [].concat.apply([], data);
                
                    data = _.filter(data, row => {
                        if (row.length !== 1) {
                            return false;
                        }

                        for (let index = 0; index < row.length; index++) {
                            const element = row[index].toLowerCase().trim();
                            if ('id|item|'.includes(element)) {
                                return false;
                            }
                        }

                        return true;
                    })

                    const numData = data.length;

                    if (numData) {
                        this.props.modifyModalTitle('Confirmar');
                        this.props.modifyModalMessage(
                            `Confirma a inclusão de ${numData === 1 ? `${numData} linha ?` : `${numData} linhas ?`}`
                        );
                        this.props.modifyExtraData({ 
                            item: data, 
                            action: 'incluibatch_itemmanutencaotable' 
                        });
                        this.itemManutencaotableBtnConfirmModalRef.click();
                    } else {
                        toastr.error('Erro', 'Falha na importação.');
                    }
                }
            )
            .catch(() => false);
        }
    }

    onClickIncluir() {
        const asyncFunExec = async () => {
            try {
                const item = await doGetLastId();
                if (item && item.data && item.data.length > 0) {
                    store.dispatch(change('itemmanutencaotableform', 'id', item.data[0].id + 1));
                } else {
                    store.dispatch(change('itemmanutencaotableform', 'id', 0));
                }
            } catch(e) {
                console.log(e);
            }
        }
        
        asyncFunExec();
        this.itemManutencaotableBtnModalRef.click();
    }

    onClickRemover() {
        if (this.state.selectRow.selected[0]) {
            this.props.modifyModalTitle('Remover');
            this.props.modifyModalMessage('Confirma a remoção do registro selecionado ?');
            this.props.modifyExtraData({ 
                item: { id: this.state.selectRow.selected[0] }, 
                action: 'remove_itemmanutencaotable' 
            });
            this.itemManutencaotableBtnConfirmModalRef.click();
        }
    }

    onClickImportCsv() {
        this.importCsvItemManutRef.firstChild.firstChild.accept = '.txt,.csv';
        this.importCsvItemManutRef.firstChild.firstChild.value = '';
        this.importCsvItemManutRef.firstChild.firstChild.click();
    }

    handleCsvFile(data, name) {
        let newData = _.filter(data, row => {
            if (row.length !== 1) {
                return false;
            }

            for (let index = 0; index < row.length; index++) {
                const element = row[index].toLowerCase().trim();
                if ('id|item|'.includes(element)) {
                    return false;
                }
            }

            return true;
        })

        const numData = newData.length;

        if (numData) {
            this.props.modifyModalTitle('Confirmar');
            this.props.modifyModalMessage(
                `Confirma a inclusão de ${numData === 1 ? `${numData} linha ?` : `${numData} linhas ?`}`
            );
            this.props.modifyExtraData({ 
                item: newData, 
                action: 'incluibatch_itemmanutencaotable' 
            });
            this.itemManutencaotableBtnConfirmModalRef.click();
        } else {
            toastr.error('Erro', 'Falha na importação.');
        }
    }

    handleCsvFileError() {
        
    }

    handleOnSelect(row, isSelect, rowIndex, e) {
        if (isSelect) {
            this.setState({ selectRow: { ...this.state.selectRow, selected: [row.id] } });
        } else {
            this.setState({ selectRow: { ...this.state.selectRow, selected: [''] } });
        }
    }

    render() {
        const { columns, data } = this.props;
        const dataTable = data || [];
        const columnsTable = columns || [
            {
                dataField: 'id',
                text: 'ID',
                sort: true,
                csvExport: false
                /* filter: textFilter({
                    placeholder: ' ',
                    delay: 0
                }), */
            }, 
            {
                dataField: 'item',
                text: 'Item',
                sort: true
                /* filter: textFilter({
                    placeholder: ' ',
                    delay: 0
                }) */
            }
        ];
        return (
            <React.Fragment>
                <ReactDropzone
                    accept=".txt,.csv"
                    onDrop={(acceptedFiles, rejectedFiles) => this.onDropCsv(acceptedFiles, rejectedFiles)}
                >
                    {({getRootProps, getInputProps, isDragActive}) => {
                        const rootProps = getRootProps();
                        return (
                            <div
                                accept={rootProps.accept}
                                onDrop={rootProps.onDrop}
                            >
                               <ToolkitProvider
                                    keyField={'id'} 
                                    data={dataTable} 
                                    columns={columnsTable}
                                    exportCSV={ {
                                        fileName: 'itensdemanutencao.csv',
                                        noAutoBOM: false,
                                        separator: ';'
                                    }}
                                    search
                                >
                                    {
                                        props => (
                                            <div>
                                                <div className='itemmanutencaotabletools'>
                                                    <div style={{ flex: 3 }}>
                                                        <button 
                                                            className="btn btn-primary"
                                                            onClick={() => this.onClickIncluir()}
                                                            style={{ marginRight: 10, paddingLeft: 20, paddingRight: 20 }}
                                                        >
                                                            Incluir
                                                        </button>
                                                        <button
                                                            ref={ref => (this.itemManutencaotableBtnModalRef = ref)}
                                                            hidden
                                                            data-toggle="modal" data-target="#itemmanutencaotablemodal"
                                                            data-backdrop="static" data-keyboard="false"
                                                        />
                                                        <button 
                                                            className="btn btn-danger"
                                                            onClick={() => this.onClickRemover()}
                                                            style={{ marginRight: 10 }}
                                                        >
                                                            Remover
                                                        </button>
                                                        <button
                                                            ref={ref => (this.itemManutencaotableBtnConfirmModalRef = ref)}
                                                            hidden
                                                            data-toggle="modal" data-target="#confirmmodal"
                                                            data-backdrop="static" data-keyboard="false"
                                                        />
                                                        <button 
                                                            className="btn btn-success"
                                                            onClick={() => this.onClickImportCsv()}
                                                            style={{ marginRight: 10 }}
                                                        >
                                                            Importar CSV
                                                        </button>
                                                        <div
                                                            ref={ref => (this.importCsvItemManutRef = ref)}
                                                            hidden
                                                        >
                                                            <CSVReader
                                                                inputId='importCsvItemManut'
                                                                onFileLoaded={this.handleCsvFile}
                                                                onError={this.handleCsvFileError}
                                                                parserOptions={{
                                                                    delimiter: ';',
                                                                    skipEmptyLines: true
                                                                }}
                                                            />
                                                        </div>
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
                                                    wrapperClasses="itemmanutencaotable"
                                                    //filter={filterFactory()}
                                                    exportCsv
                                                    bootstrap4
                                                />
                                            </div>
                                        )
                                    }
                                </ToolkitProvider>
                            </div>
                        )
                    }}
                </ReactDropzone>
                <ItemManutencaoTableModal />
            </React.Fragment>
        );
    }
}

const mapStateToProps = () => ({
});

setBinding({
    target: ItemManutencaoTable.prototype,
    fn: ItemManutencaoTable.prototype.onKeyUpOrDown,
    keys: [ /*KeyDownKeys.UP, KeyDownKeys.DOWN*/ ]
});

export default connect(mapStateToProps, {
    modifyModalTitle, 
    modifyModalMessage, 
    modifyExtraData
})(ItemManutencaoTable);

