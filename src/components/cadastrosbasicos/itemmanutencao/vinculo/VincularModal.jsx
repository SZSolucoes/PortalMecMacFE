import React from 'react'
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import 'react-tabs/style/react-tabs.css';

import './Vincular.css';
import VincularTable from './VincularTable';

class VincularModal extends React.Component {

    constructor(props) {
        super(props);

        this.renderBody = this.renderBody.bind(this);
    }

    renderBody() {
        return (
            <div id='vincularmain'>
                <VincularTable 
                    ref={ref => (this.VincularTableRef = ref)} 
                    itemid={this.props.itemid}
                    btnCloseModal={this.buttonFecharRef}
                />
                <div className="row">
                    <div className="col-12 modal-footer d-flex justify-content-end">
                        <button 
                            className="btn btn-primary"
                            type="button"
                            onClick={() => 
                                this.VincularTableRef.getWrappedInstance().onClickConfirm()
                            }
                        >
                            Confirmar
                        </button>
                        <button
                            ref={ref => (this.buttonFecharRef = ref)} 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => 
                                this.VincularTableRef.getWrappedInstance().onClickFechar()
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
                    id="vincularitemmanut" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="exampleModalLabel" 
                    aria-hidden="true"
                >
                    <LoadingOverlay
                        active={this.props.overlayModal}
                        spinner
                        text='Vínculo em andamento...'
                    >
                        <div className="modal-dialog modal-auto-size" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 className="mt-3" ref={(ref) => { this.textCadProp = ref; }}>
                                        Vincular Veículo
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
    itemid: state.VincularReducer.itemid,
    overlayModal: state.VincularReducer.overlayModal,
});

export default connect(mapStateToProps, {
})(VincularModal);

