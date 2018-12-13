import React from 'react';
import { connect } from 'react-redux';
import { doModalAction } from '../components/utils/UtilsActions';

class ConfirmModal extends React.Component {
    render() {
        return (
            <div>
                <div 
                    className="modal fade" 
                    id="confirmmodal" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="exampleModalLabel" 
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                {this.props.modalTitle}
                            </h5>
                            <button 
                                type="button" 
                                className="close" 
                                data-dismiss="modal" 
                                aria-label="Close"
                            >
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.modalMessage}
                        </div>
                        <div className="modal-footer">
                            <React.Fragment>
                                <button 
                                    type="button" 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => this.props.doModalAction(this.props.extraData)} 
                                    data-dismiss="modal">
                                    Confirmar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-sm" 
                                    data-dismiss="modal">
                                    Fechar
                                </button>
                            </React.Fragment>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    modalTitle: state.UtilsReducer.modalTitle,
    modalMessage: state.UtilsReducer.modalMessage,
    btnType: state.UtilsReducer.btnType,
    extraData: state.UtilsReducer.extraData
})

export default connect(mapStateToProps, { 
    doModalAction
})(ConfirmModal);

