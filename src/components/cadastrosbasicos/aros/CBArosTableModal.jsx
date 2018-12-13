import React, { Component } from 'react';
import { connect } from 'react-redux';

import CBArosTableForm from './CBArosTableForm';

class CBArosTableModal extends Component {
    render() {
        return (
            <div>
                <div 
                    className="modal fade" 
                    id="cbarostablemodal" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="exampleModalLabel" 
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-auto-size" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="mt-3" ref={(ref) => { this.textCadProp = ref; }}>
                                    Incluir - Aros
                                </h2>
                            </div>
                            <div className="modal-body">
                                <React.Fragment>
                                    <div className="p-3 mt-3">
                                        <CBArosTableForm />
                                    </div>
                                </React.Fragment>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, {
})(CBArosTableModal);