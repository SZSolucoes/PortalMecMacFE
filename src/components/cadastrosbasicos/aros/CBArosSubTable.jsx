import React, { Component } from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { onMount, onUnmount } from 'react-keydown/es/event_handlers';
import { setBinding, /*Keys as KeyDownKeys*/ } from 'react-keydown';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import CSVReader from 'react-csv-reader';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ReactDropzone from "react-dropzone";
import _ from 'lodash';
import { toastr } from 'react-redux-toastr';
import Papa from 'papaparse';
import { change } from 'redux-form';

import { modifyModalTitle, modifyModalMessage, modifyExtraData } from '../../utils/UtilsActions';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import { store } from '../../..';

const NoDataIndication = () => (
    <div 
        style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '40vh', 
            backgroundColor: 'white' 
        }}
    >
        <div className="lds-facebook"><div></div><div></div><div></div></div>
    </div>
);

class CBArosSubTable extends Component {
    constructor(props) {
        super(props);

        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.onKeyUpOrDown = this.onKeyUpOrDown.bind(this);
        this.onClickRemover = this.onClickRemover.bind(this);
        this.onClickDropDownBtn = this.onClickDropDownBtn.bind(this);
        this.onDropCsv = this.onDropCsv.bind(this);
        this.renderDropDownButton = this.renderDropDownButton.bind(this);
        this.handleCsvFile = this.handleCsvFile.bind(this);
        this.handleCsvFileError = this.handleCsvFileError.bind(this);

        this.state = {
            selectRow: {
                mode: 'radio',
                clickToSelect: true,
                bgColor: '#007BFF',
                hideSelectColumn: true,
                style: { color: 'white' },
                onSelect: this.handleOnSelect,
                selected: [''],
                selectedRow: {}
            },
            dropdownBtnOpen: false
        }
    }

    componentDidMount() {
        onMount(this);
    }

    componentWillUnmount() {
        onUnmount(this);
    }

    componentDidUpdate(prevProps) {
        const { data, refreshTableArosSub, arosSubLoading } = this.props;
        const { selectedRow } = this.state.selectRow;
        const indexFounded = _.findIndex(data, dt => dt.id === selectedRow.id);

        let newSelectedRow = selectedRow;

        if (prevProps.arosSubLoading !== arosSubLoading) {
            this.setState({
                selectRow: {
                    mode: 'radio',
                    clickToSelect: true,
                    bgColor: '#007BFF',
                    hideSelectColumn: true,
                    style: { color: 'white' },
                    onSelect: this.handleOnSelect,
                    selected: [''],
                    selectedRow: {}
                },
                dropdownBtnOpen: false
            });
        }

        if (
            refreshTableArosSub && 
            indexFounded !== -1 &&
            !_.isEqual(data[indexFounded], prevProps.data[indexFounded])
        ) {
            newSelectedRow = { ...data[indexFounded] };
            store.dispatch({
                type: 'modify_refreshtablearossub_cbaros',
                payload: false
            });

            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [newSelectedRow.id], 
                    selectedRow: newSelectedRow
                } 
            });
        }
    }

    onKeyUpOrDown(event) {
        //console.log(event);
    }

    onClickModify() {
        if (this.state.selectRow.selected[0] && this.props.data.length) {
            const { selectedRow } = this.state.selectRow;

            store.dispatch(change('cbarossubmdfform', 'id', selectedRow.id));
            store.dispatch(change('cbarossubmdfform', 'idaro', selectedRow.idaro));
            store.dispatch(change('cbarossubmdfform', 'subcat', selectedRow.subcat));
            store.dispatch({
                type: 'modify_formvaluesarossub_cbaros',
                payload: selectedRow
            }); 

            this.cbArosSubMdfModalRef.click();
        }
    }

    onClickRemover() {
        if (this.state.selectRow.selected[0]) {
            this.props.modifyModalTitle('Remover');
            this.props.modifyModalMessage('Confirma a remoção da sub-categoria selecionada ?');
            this.props.modifyExtraData({ 
                item: { id: this.state.selectRow.selected[0], idaro: this.props.data[0].idaro }, 
                action: 'remove_cbarossubtable' 
            });
            
            this.cbarossubtableBtnConfirmModalRef.click();
        }
    }

    onClickDropDownBtn() {
        this.setState({
            dropdownBtnOpen: !this.state.dropdownBtnOpen
        });
    }

    onDropCsv(acceptedFiles, rejectedFiles) {
        if (!this.props.selectedAroRowId) {
            alert('Para efetuar a importação de sub-categoria é necessário selecionar um tipo de aro.');
            return;
        } 

        const numAcceptedFiles = acceptedFiles.length;

        if (numAcceptedFiles) {
            Promise.all(acceptedFiles.map(
                file =>
                    new Promise(
                        (resolve, reject) =>
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
                            if ('id|sub-categoria'.includes(element)) {
                                return false;
                            }
                        }

                        return true;
                    });

                    data = _.map(data, row => [this.props.selectedAroRowId,...row]);

                    const numData = data.length;

                    if (numData) {
                        this.props.modifyModalTitle('Confirmar');
                        this.props.modifyModalMessage(
                            `Confirma a inclusão de ${numData === 1 ? `${numData} linha ?` : `${numData} linhas ?`}`
                        );
                        this.props.modifyExtraData({ 
                            item: data, 
                            action: 'incluibatch_cbarossubtable' 
                        });
                        this.cbarossubtableBtnConfirmModalRef.click();
                    } else {
                        toastr.error('Erro', 'Falha na importação.');
                    }
                }
            )
            .catch(() => false);
        }
    }

    handleCsvFile(data, name) {
        if (!this.props.selectedAroRowId) {
            alert('Para efetuar a importação de sub-categoria é necessário selecionar um tipo de aro.');
            return;
        } 

        try {
            let newData = _.filter(data, row => {
                if (row.length !== 1) {
                    return false;
                }
    
                for (let index = 0; index < row.length; index++) {
                    const element = row[index].toLowerCase().trim();
                    if ('id|sub-categoria'.includes(element)) {
                        return false;
                    }
                }
    
                return true;
            });

            newData = _.map(newData, row => [this.props.selectedAroRowId,...row]);
    
            const numData = newData.length;
    
            if (numData) {
                this.props.modifyModalTitle('Confirmar');
                this.props.modifyModalMessage(
                    `Confirma a inclusão de ${numData === 1 ? `${numData} linha ?` : `${numData} linhas ?`}`
                );
                this.props.modifyExtraData({ 
                    item: newData, 
                    action: 'incluibatch_cbarossubtable' 
                });
                this.cbarossubtableBtnConfirmModalRef.click();
            } else {
                toastr.error('Erro', 'Falha na importação.');
            }
        } catch (e) {
            toastr.error('Erro', 'Falha na importação.');
        }
    }

    handleCsvFileError() {
        
    }

    
    renderDropDownButton(csvProps) {
        return (
            <ButtonDropdown 
                isOpen={this.state.dropdownBtnOpen} 
                toggle={this.onClickDropDownBtn}
                style={{
                    marginRight: 10,
                    marginTop: 5
                }}
            >
                <DropdownToggle caret>
                    Mais
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem
                        onClick={() => {
                            this.importCsvDivRef.firstChild.firstChild.accept = '.txt,.csv';
                            this.importCsvDivRef.firstChild.firstChild.value = '';
                            this.importCsvDivRef.firstChild.firstChild.click();
                        }}
                    >
                        Importar CSV
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                        onClick={() => this.exportCsvDivRef.firstChild.click()}
                    >
                        Exportar CSV
                    </DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        );
    }

    handleOnSelect(row, isSelect, rowIndex, e) {
        if (isSelect) {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [row.id], 
                    selectedRow: row
                } 
            });
        } else {
            this.setState({ 
                selectRow: { 
                    ...this.state.selectRow, 
                    selected: [''], 
                    selectedRow: {}
                } 
            });
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
                csvExport: false,
                hidden: true,
                /* filter: textFilter({
                    placeholder: ' ',
                    delay: 0
                }), */
            },
            {
                dataField: 'subcat',
                text: 'Sub-categoria',
                sort: true,
                filter: textFilter({
                    placeholder: 'Filtrar...',
                    delay: 0
                })
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
                                        fileName: 'arossubcategorias.csv',
                                        noAutoBOM: false,
                                        separator: ';'
                                    }}
                                    search
                                >
                                    {
                                        props => (
                                            <div>
                                                <div className='cbarostabletools'>
                                                    <div style={{ flex: 3 }}>
                                                        <button 
                                                            className="btn btn-danger"
                                                            onClick={() => this.onClickRemover()}
                                                            style={{ 
                                                                marginRight: 10,
                                                                marginTop: 5
                                                            }}
                                                        >
                                                            Remover
                                                        </button>
                                                        <button 
                                                            className="btn btn-dark"
                                                            onClick={() => this.onClickModify()}
                                                            style={{ 
                                                                marginRight: 10,
                                                                marginTop: 5
                                                            }}
                                                        >
                                                            Modificar
                                                        </button>
                                                        <button
                                                            ref={ref => (this.cbarossubtableBtnConfirmModalRef = ref)}
                                                            hidden
                                                            data-toggle="modal" data-target="#confirmmodal"
                                                            data-backdrop="static" data-keyboard="false"
                                                        />
                                                        <div 
                                                            ref={ref => (this.importCsvDivRef = ref)}
                                                            hidden
                                                        >
                                                            <CSVReader
                                                                inputId='importCsvArosSub'
                                                                onFileLoaded={this.handleCsvFile}
                                                                onError={this.handleCsvFileError}
                                                                parserOptions={{
                                                                    delimiter: ';',
                                                                    skipEmptyLines: true
                                                                }}
                                                            />
                                                        </div>
                                                        <div 
                                                            ref={ref => (this.exportCsvDivRef = ref)}
                                                            hidden
                                                        >
                                                            <CSVExport.ExportCSVButton { ...props.csvProps } hidden>
                                                                Exportar CSV
                                                            </CSVExport.ExportCSVButton>
                                                        </div>
                                                        {this.renderDropDownButton()}
                                                        <button
                                                            ref={ref => (this.cbArosSubMdfModalRef = ref)}
                                                            hidden
                                                            data-toggle="modal" data-target="#cbarossubmdf"
                                                            data-backdrop="static" data-keyboard="false"
                                                        />
                                                    </div>
                                                    <div 
                                                        style={{ 
                                                            flex: 1,
                                                            marginTop: 5
                                                        }}
                                                    >
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
                                                    wrapperClasses="cbarostable"
                                                    filter={filterFactory()}
                                                    exportCsv
                                                    bootstrap4
                                                    defaultSorted={
                                                        [{
                                                            dataField: 'id',
                                                            order: 'desc'
                                                        }]
                                                    }
                                                    noDataIndication={
                                                        this.props.arosSubLoading ? 
                                                        () => <NoDataIndication /> 
                                                        : 
                                                        null
                                                    }
                                                />
                                            </div>
                                        )
                                    }
                                </ToolkitProvider>
                            </div>
                        )
                    }}
            </ReactDropzone>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    arosSubLoading: state.CBArosReducer.arosSubLoading,
    refreshTableArosSub: state.CBArosReducer.refreshTableArosSub
});

setBinding({
    target: CBArosSubTable.prototype,
    fn: CBArosSubTable.prototype.onKeyUpOrDown,
    keys: [ /*KeyDownKeys.UP, KeyDownKeys.DOWN*/ ]
});

export default connect(mapStateToProps, {
    modifyModalTitle, 
    modifyModalMessage, 
    modifyExtraData
})(CBArosSubTable);

