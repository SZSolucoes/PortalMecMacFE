import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';

import {
    required
} from '../../utils/validForms';
import { doPostItem, doPostItemSub } from './CBArosActions';
import { store } from '../../../index';

class CBArosTableForm extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.renderField = this.renderField.bind(this);
    }

    onSubmitForm(values) {
        const { arosSubValues } = this.props
        this.props.doPostItemSub({ 
            idaro: arosSubValues.id,
            subcat: values.subcat,
        }, this.buttonFecharRef);
    }

    renderField({ input, label, type, meta: { touched, error, warning, submitFailed } }) {
        return (
            <div>
                <input {...input} type={type} className="form-control" />
                { submitFailed && ((error && <span className="required">{error}</span>) || (warning && <span>{warning}</span>))}
            </div> 
        );
    } 

    render() {
        const { handleSubmit, pristine, reset, submitting, arosSubValues } = this.props
        const id = arosSubValues.id || '';
        const aro = arosSubValues.aro || '';
        let vehicletype = arosSubValues.vehicletype || '';

        if (vehicletype === '1') {
            vehicletype = 'Carro';
        } else if (vehicletype === '2') {
            vehicletype = 'Moto';
        } else if (vehicletype === '3') {
            vehicletype = 'Caminhão';
        }

        return (
            <form onSubmit={handleSubmit(this.onSubmitForm)}>
                <div className="form">
                    <div className="cbarosdivtablebasic">
                        <div className="row">
                            <div className="col-12 col-md-2">
                                <div className="form-group">
                                    <label htmlFor="id">ID Aro</label>
                                    <input 
                                        type="text"
                                        className="form-control" 
                                        name="id"
                                        disabled
                                        value={id}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-2">
                                <div className="form-group">
                                    <label htmlFor="vehicletype">Tipo de Veículo</label>
                                    <input 
                                        type="text"
                                        className="form-control" 
                                        name="vehicletype"
                                        disabled
                                        value={vehicletype}
                                    />
                                </div>
                            </div> 
                            <div className="col-12 col-md-3">
                                <div className="form-group">
                                    <label htmlFor="aro">Aro</label>
                                    <input 
                                        type="text"
                                        className="form-control" 
                                        name="ano"
                                        disabled
                                        value={aro}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-5">
                                <div className="form-group">
                                    <label htmlFor="subcat">Sub-categoria *</label>
                                    <Field 
                                        component={this.renderField}
                                        type="text"
                                        className="form-control" 
                                        name="subcat"
                                        validate={[ required ]}
                                    />
                                </div>
                            </div> 
                        </div>
                        <div className="row">
                            <div className="col-12 modal-footer d-flex justify-content-end">
                                <button 
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={pristine || submitting}
                                >
                                    Confirmar
                                </button>
                                <button 
                                    className="btn btn-secondary"
                                    type="button"
                                    disabled={pristine || submitting}
                                    onClick={() => {
                                        store.dispatch(
                                            change(
                                                'cbarossubtableform', 
                                                'subcat', 
                                                ''
                                            )
                                        );
                                    }}
                                >
                                    Limpar
                                </button>
                                <button
                                    ref={ref => (this.buttonFecharRef = ref)} 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => reset()} 
                                    data-dismiss="modal">
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div> 
                </div>
            </form>
          );
    }
}

const mapStateToProps = (state) => ({
    arosSubValues: state.CBArosReducer.arosSubValues,
    initialValues: {
        subcat: ''
    }
});

CBArosTableForm = reduxForm({
    form: 'cbarossubtableform',
    destroyOnUnmount: false
})(CBArosTableForm); 

export default connect(mapStateToProps, {
    doPostItem,
    doPostItemSub
})(CBArosTableForm);

