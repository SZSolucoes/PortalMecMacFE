import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import _ from 'lodash';

import { store } from '../../../../index';

import { doPutCompAros } from '../ArosActions';
import { doGetDataTableCBArosSub } from '../../../cadastrosbasicos/aros/CBArosActions';
//import { doPutManutencao } from '../../manutencao/ManutencaoActions';

class ArosMdfForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.renderField = this.renderField.bind(this);
        this.onSubmitModifyForm = this.onSubmitModifyForm.bind(this);
        this.resetFields = this.resetFields.bind(this);
        this.getSubCat = this.getSubCat.bind(this);

        this.state = {
            subcatDisabled: false
        }
    }

   componentDidUpdate(prevProps) {
        if (prevProps.refreshSub !== this.props.refreshSub) {
            this.getSubCat(this.props.refreshValue, this.props.refreshValueSub);
        }
    }

    onSubmitModifyForm(values) {
        const {
            id,
            arocombo,
            arosubcombo
        } = values;

        if (!(arocombo && arosubcombo)) {
            alert('Para realizar a inclusão é necessário informar todos os campos.');
            return;
        }

        const params = {
            id,
            aro: arocombo,
            subcat: arosubcombo
        };

        this.props.doPutCompAros(params, () => this.closeBtn);
    }

    resetFields(reset) {
        const {
            formValues
        } = this.props;

        reset();

        store.dispatch(change('arosmdfform', 'id', formValues.id));
        store.dispatch(change('arosmdfform', 'arocombo', formValues.aro));
        store.dispatch(change('arosmdfform', 'arosubcombo', formValues.subcat));

        this.getSubCat(formValues.aro, formValues.subcat);
    }

    async getSubCat(value, newSub) {
        this.setState({ subcatDisabled: true });
        if (value) {
            const newValue = _.findIndex(this.props.aroCombo, (item) => item.aro === value);
            if (newValue !== -1) {
                const dataTableArosSub = await doGetDataTableCBArosSub({ idaro: this.props.aroCombo[newValue].id });
                if (dataTableArosSub && dataTableArosSub.success) {
                    store.dispatch({
                        type: 'modify_arosubcombomdf_aros',
                        payload: dataTableArosSub.data
                    });
    
                    if (dataTableArosSub.data[0] && dataTableArosSub.data[0].subcat) {
                        if (newSub) {
                            store.dispatch(change('arosmdfform', 'arosubcombo', newSub));
                        } else {
                            store.dispatch(change('arosmdfform', 'arosubcombo', dataTableArosSub.data[0].subcat));
                        }
                    } else {
                        store.dispatch(change('arosmdfform', 'arosubcombo', ''));
                    }
                }
            }
        }
        this.setState({ subcatDisabled: false });
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
                <div className='row'>
                    <div className='col-12 col-md-4'>
                        <div className='form-group'>
                            <label htmlFor='arocombo'>Aro</label>
                            <Field 
                                component="select" 
                                className="form-control" 
                                name="arocombo"
                                onChange={event => this.getSubCat(event.target.value)}
                            >
                                {
                                        this.props.aroCombo.map((value, index) => 
                                        <option key={index} value={value.aro}>{value.aro}</option>
                                    )
                                }
                            </Field>
                        </div>
                    </div>
                    <div className='col-12 col-md-8'>
                        <div className='form-group'>
                            <label htmlFor='arosubcombo'>Sub-categoria</label>
                            <Field 
                                component="select" 
                                className="form-control" 
                                name="arosubcombo"
                                disabled={this.state.subcatDisabled}
                                //onChange={event => this.consultarFipe(event, 'fipeperiodoref')}
                            >
                                {
                                        this.props.aroSubComboMdf.map((value, index) => 
                                        <option key={index} value={value.subcat}>{value.subcat}</option>
                                    )
                                }
                            </Field>
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
    item: state.ComplementosReducer.item,
    aroCombo: state.ArosReducer.aroCombo,
    aroSubComboMdf: state.ArosReducer.aroSubComboMdf,
    dataTableAros: state.ArosReducer.dataTableAros,
    formValues: state.ArosReducer.formValues,
    initialValues: {
        id: '',
        arocombo: '',
        arosubcombo: ''
    }
});

ArosMdfForm = reduxForm({
    form: 'arosmdfform',
    destroyOnUnmount: false
})(ArosMdfForm); 

export default connect(mapStateToProps, {
    doPutCompAros
})(ArosMdfForm);

