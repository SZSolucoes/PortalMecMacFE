import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';

import {
    required
} from '../../utils/validForms';
import { doPostItem } from './CBArosActions';
import { store } from '../../../index';

class CBArosTableForm extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.renderField = this.renderField.bind(this);
    }

    onSubmitForm(values) {
        this.props.doPostItem({ vehicletype: values.vehicletype, aro: values.aro }, this.buttonFecharRef);
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
        const { handleSubmit, pristine, reset, submitting } = this.props
        return (
            <form onSubmit={handleSubmit(this.onSubmitForm)}>
                <div className="form">
                    <div className="cbarosdivtablebasic">
                        <div className="row">
                            <div className="col-12 col-md-3">
                                <div className="form-group">
                                    <label htmlFor="id">ID</label>
                                    <Field 
                                        component="input"
                                        type="text"
                                        className="form-control" 
                                        name="id"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label htmlFor="vehicletype">Tipo de Veículo *</label>
                                    <Field 
                                        component="select" 
                                        className="form-control" 
                                        name="vehicletype"
                                    >
                                        <option key={'1'} value={'1'}>Carro</option>
                                        <option key={'2'} value={'3'}>Caminhão</option>
                                        <option key={'3'} value={'2'}>Moto</option>
                                    </Field>
                                </div>
                            </div> 
                            <div className="col-12 col-md-5">
                                <div className="form-group">
                                    <label htmlFor="aro">Aro *</label>
                                    <Field 
                                        component={this.renderField}
                                        type="text"
                                        className="form-control" 
                                        name="aro"
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
                                                'cbarostableform', 
                                                'vehicletype', 
                                                '1'
                                            )
                                        );
                                        store.dispatch(
                                            change(
                                                'cbarostableform', 
                                                'aro', 
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
    initialValues: {
        id: '',
        vehicletype: '1',
        aro: ''
    }
});

CBArosTableForm = reduxForm({
    form: 'cbarostableform',
    destroyOnUnmount: false
})(CBArosTableForm); 

export default connect(mapStateToProps, {
    doPostItem
})(CBArosTableForm);

