import React, { Component } from 'react';
import { connect } from 'react-redux';

import ArosMdfForm from './ArosMdfForm';
import './ArosMdfStyle.css';

class ArosMdf extends Component {
    render() {
        return (
            <div>
                <div 
                    className="modal fade" 
                    id="arosmdf" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="exampleModalLabel" 
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-auto-size" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="mt-3" ref={(ref) => { this.textCadProp = ref; }}>
                                    Modificar - Aros (Complemento)
                                </h2>
                            </div>
                            <div className="modal-body">
                                <React.Fragment>
                                    <div className="p-3 mt-3">
                                        <ArosMdfForm 
                                            {...this.props}
                                        />
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

})(ArosMdf);