import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { required } from '../../../utils/validForms';

import { store } from '../../../../index';
import { doPutItem } from '../ItemManutencaoActions';

class ItemManutencaoMdfForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.renderField = this.renderField.bind(this);
        this.onSubmitModifyForm = this.onSubmitModifyForm.bind(this);
        this.resetFields = this.resetFields.bind(this);
    }

    onSubmitModifyForm(values) {
        const {
            id,
            item,
            itemabrev
        } = values;

        const params = {
            id,
            item,
            itemabrev
        };

        this.props.doPutItem(params, () => this.closeBtn);
    }

    resetFields(reset) {
        const {
            formValues
        } = this.props;

        reset();

        store.dispatch(change('itemmanutencaomdfform', 'id', formValues.id));
        store.dispatch(change('itemmanutencaomdfform', 'itemabrev', formValues.itemabrev));
        store.dispatch(change('itemmanutencaomdfform', 'item', formValues.item));
    }

    renderField({ input, label, type, meta: { touched, error, warning, submitFailed } }) {
        return (
            <div>
                <input {...input} type={type} className='form-control' />
                { submitFailed && ((error && <span className='required'>{error}</span>) || (warning && <span>{warning}</span>))}
            </div> 
        );
    } 

    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmitModifyForm)}>
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
                            <label htmlFor="itemabrev">Nome Abreviado *</label>
                            <Field 
                                component={this.renderField}
                                type="text"
                                className="form-control" 
                                name="itemabrev"
                                validate={[ required ]}
                            />
                        </div>
                    </div> 
                    <div className="col-12 col-md-5">
                        <div className="form-group">
                            <label htmlFor="item">Item *</label>
                            <Field 
                                component={this.renderField}
                                type="text"
                                className="form-control" 
                                name="item"
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
                            ref={ref => (this.confirmCadVeiculoBtnRef = ref)}
                            hidden
                            data-dismiss="modal"
                        />
                        <button 
                            className="btn btn-secondary"
                            type="button"
                            disabled={pristine || submitting}
                            onClick={() => this.resetFields(reset)}
                        >
                            Restaurar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            ref={ref => (this.closeBtn = ref)}
                            onClick={() => reset()} 
                            data-dismiss="modal">
                            Fechar
                        </button>
                    </div>
                </div>
                <hr />
            </form>
        );
    }
}

const mapStateToProps = (state) => ({
    formValues: state.ItemManutencaoReducer.formValues,
    initialValues: {
        id: '',
        item: '',
        itemabrev: ''
    }
});

ItemManutencaoMdfForm = reduxForm({
    form: 'itemmanutencaomdfform',
    destroyOnUnmount: false
})(ItemManutencaoMdfForm); 

export default connect(mapStateToProps, {
    doPutItem
})(ItemManutencaoMdfForm);

