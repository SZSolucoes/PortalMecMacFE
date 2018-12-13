import React from 'react'
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
//import _ from 'lodash';
//import Main from '../../templates/Main';
import 'react-tabs/style/react-tabs.css';

//import { store } from '../../../index';
//import { socket } from '../../main/App';

import './CPManual.css';
import CPManualTable from './CPManualTable';

class CPManual extends React.Component {

    constructor(props) {
        super(props);

        this.renderBody = this.renderBody.bind(this);
    }

    renderBody() {
        const fipemesanoFldValue = this.props.item.fipeperiodoref || '';
        const FldValue = this.props.item.marca || '';
        const modeloFldValue = this.props.item.modelo || '';
        const anoFldValue = this.props.item.ano || '';
        const combustivelFldValue = this.props.item.combustivel || '';

        return (
            <div id='cpmanualmain'>
                <div className='row'>
                    <div className='col-12 col-md-3 col-lg-2'>
                        <div className='form-group'>
                            <label htmlFor='fipemesano'>Fipe Mês/Ano</label>
                            <input
                                type='text'
                                className='form-control' 
                                name='fipemesano'
                                disabled
                                value={fipemesanoFldValue}
                            />
                        </div>
                    </div>
                    <div className='col-12 col-md-3 col-lg-2'>
                        <div className='form-group'>
                            <label htmlFor='marca'>Marca</label>
                            <input
                                type='text'
                                className='form-control' 
                                name='marca'
                                disabled
                                value={FldValue}
                            />
                        </div>
                    </div>
                    <div className='col-12 col-md-6 col-lg-4'>
                        <div className='form-group'>
                            <label htmlFor='modelo'>Modelo</label>
                            <input
                                type='text' 
                                className='form-control' 
                                name='modelo'
                                disabled
                                value={modeloFldValue}
                            />
                        </div>
                    </div>
                    <div className='col-12 col-md-4 col-lg-2'>
                        <div className='form-group'>
                            <label htmlFor='ano'>Ano</label>
                            <input
                                type='text' 
                                className='form-control' 
                                name='ano'
                                disabled
                                value={anoFldValue}
                            />
                        </div>
                    </div>
                    <div className='col-12 col-md-4 col-lg-2'>
                        <div className='form-group'>
                            <label htmlFor='combustivel'>Combustível</label>
                            <input 
                                type='text' 
                                className='form-control' 
                                name='combustivel'
                                disabled
                                value={combustivelFldValue}
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <CPManualTable ref={ref => (this.CPManualTableRef = ref)} item={this.props.item} />
                <div className="row">
                    <div className="col-12 modal-footer d-flex justify-content-end">
                        <button 
                            className="btn btn-primary"
                            type="button"
                            onClick={() => 
                                this.CPManualTableRef.getWrappedInstance().onClickConfirm()
                            }
                        >
                            Confirmar
                        </button>
                        <button
                            ref={ref => (this.buttonFecharRef = ref)} 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => 
                                this.CPManualTableRef.getWrappedInstance().onClickFechar()
                            }
                            data-dismiss="modal">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div 
                    className="modal fade" 
                    id="cpmanual" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="exampleModalLabel" 
                    aria-hidden="true"
                >
                    <LoadingOverlay
                        active={this.props.overlayModal}
                        spinner
                        text='Cópia em andamento...'
                    >
                        <div className="modal-dialog modal-auto-size" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 className="mt-3" ref={(ref) => { this.textCadProp = ref; }}>
                                        Copiar Manual
                                    </h2>
                                </div>
                                <div className="modal-body">
                                    <React.Fragment>
                                        <div className="">
                                            {this.renderBody()}
                                        </div>
                                    </React.Fragment>
                                </div>
                            </div>
                        </div>
                    </LoadingOverlay>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    item: state.CPManualReducer.item,
    overlayModal: state.CPManualReducer.overlayModal,
});

export default connect(mapStateToProps, {
})(CPManual);

