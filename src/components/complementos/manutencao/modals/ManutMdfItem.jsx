import React, { Component } from 'react';
import { connect } from 'react-redux';

import ManutMdfItemForm from './ManutMdfItemForm';
import './ManutMdfItemStyle.css';

class ManutMdfItem extends Component {
    render() {
        return (
            <div>
                <div 
                    className="modal fade" 
                    id="manutmdfitem" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="exampleModalLabel" 
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-auto-size" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="mt-3" ref={(ref) => { this.textCadProp = ref; }}>
                                    Modificar - Item de Manutenção (Complemento)
                                </h2>
                            </div>
                            <div className="modal-body">
                                <React.Fragment>
                                    <div className="p-3 mt-3">
                                        <ManutMdfItemForm />
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

})(ManutMdfItem);