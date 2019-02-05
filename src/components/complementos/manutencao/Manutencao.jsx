import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';
import _ from 'lodash';
import Select from 'react-select';
import Main from '../../templates/Main';
import RadioGroup from '../../utils/RadioGroup';
import RadioGroupInline from '../../utils/RadioGroupInline';
import ManutencaoTable from './ManutencaoTable';
import ManutMdfItem from './modals/ManutMdfItem';

import { store } from '../../../index';

import { doPostManutencao, doPostManutencaoLote, doPutVehicleComp } from './ManutencaoActions';
import './Manutencao.css';

class Manutencao extends React.Component {
    
    constructor(props) {
        super(props);

        this.onClickAdicionar = this.onClickAdicionar.bind(this);
        this.renderField = this.renderField.bind(this);
        this.onClickLinkSave = this.onClickLinkSave.bind(this);
        this.renderCadType = this.renderCadType.bind(this);
        this.renderCadSimples = this.renderCadSimples.bind(this);
        this.renderCadLote = this.renderCadLote.bind(this);

        this.state = {
            linkitemmanut: '',
            typecad: 'simples',
            loterows: [
                {
                    key: 0,
                    mes: '',
                    milhas: '',
                    quilometros: ''
                }
            ],
            itemmanutcombo: 0
        };
    }

    componentDidMount() {
        const { item } = this.props;
        if (item && item.linkitemmanut) {
            this.setState({ linkitemmanut: item.linkitemmanut });
        }
    }

    onClickAdicionar() {
        const formValues = getFormValues('manutencao')(store.getState());
        const vehicle = { ...this.props.item };
        if (typeof vehicle === 'object' && Object.keys(vehicle).length && this.state.itemmanutcombo.value) {
            if (vehicle.vehicletype) {
                let keyTable = {};
                if (vehicle.vehicletype === '1') {
                    keyTable.idcar = vehicle.id
                } else if (vehicle.vehicletype === '2') {
                    keyTable.idbike = vehicle.id
                } else if (vehicle.vehicletype === '3') {
                    keyTable.idtruck = vehicle.id
                }

                this.props.doPostManutencao({
                    iditemmanut: this.state.itemmanutcombo.value,
                    mes: formValues.mes,
                    milhas: formValues.milhas,
                    quilometros: formValues.km,
                    tipomanut: formValues.manutencao,
                    ...keyTable
                });
            }
        }
    }

    onClickAdicionarLote() {
        const formValues = getFormValues('manutencao')(store.getState());
        const vehicle = { ...this.props.item };
        if (typeof vehicle === 'object' && Object.keys(vehicle).length && this.state.itemmanutcombo.value) {
            if (vehicle.vehicletype) {
                let tbl = '';

                if (vehicle.vehicletype === '1') {
                    tbl = 'idcar';
                } else if (vehicle.vehicletype === '2') {
                    tbl = 'idbike';
                } else if (vehicle.vehicletype === '3') {
                    tbl = 'idtruck';
                }

                let newLote = _.filter(
                    this.state.loterows, lt => lt.mes.trim() || lt.milhas.trim() || lt.quilometros.trim()
                );

                if (newLote.length) {
                    newLote = _.map(
                        newLote, nlt => ([
                            vehicle.id,
                            nlt.mes, 
                            nlt.milhas,
                            nlt.quilometros,
                            formValues.manutencao,
                            this.state.itemmanutcombo.value
                        ]));

                    this.props.doPostManutencaoLote(
                        {
                            values: newLote,
                            tbl
                        },
                        () => this.setState({ loterows: [
                            {
                                key: 0,
                                mes: '',
                                milhas: '',
                                quilometros: ''
                            }
                        ]})
                    );
                }
            }
        }
    }

    onClickLinkSave() {
        const { item } = this.props;
        const { linkitemmanut } = this.state;

        if (item && typeof item === 'object' && linkitemmanut.trim()) {
            const {
                id,
                vehicletype
            } = item;

            if (id && vehicletype) {
                this.props.doPutVehicleComp({
                    id,
                    vehicletype,
                    linkitemmanut
                });
            }
        }
    }

    renderField({ input, label, type, meta: { touched, error, warning, submitFailed } }) {
        return (
            <div>
                <input {...input} type={type} className='form-control' />
                { submitFailed && ((error && <span className='required'>{error}</span>) || (warning && <span>{warning}</span>))}
            </div> 
        );
    }

    renderCadType(typecad) {
        switch (typecad) {
            case 'simples':
                return this.renderCadSimples();
            case 'lote':
                return this.renderCadLote();
            case 'faixas':
                return this.renderCadFaixas();
            default:
                return this.renderCadSimples();
        }
    }

    renderCadSimples() {
        return (
            <React.Fragment>
                <div className='row'>
                    <div className='col-12 col-sm-12 col-xl-4'>
                        <div className='form-group'>
                            <label htmlFor='mes'>Mês</label>
                            <Field
                                component={this.renderField}
                                className='form-control' 
                                name='mes'
                            />
                        </div>
                    </div>
                    <div className='col-12 col-sm-12 col-xl-4'>
                        <div className='form-group'>
                            <label htmlFor='milhas'>Mi x 1000</label>
                            <Field
                                component={this.renderField} 
                                className='form-control' 
                                name='milhas'
                            />
                        </div>
                    </div>
                    <div className='col-12 col-sm-12 col-xl-4'>
                        <div className='form-group'>
                            <label htmlFor='km'>Km x 1000</label>
                            <Field
                                component={this.renderField} 
                                className='form-control' 
                                name='km'
                            />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <div className='form-group'>
                            <label>Manutenção</label>
                            <Field 
                                component={RadioGroup} 
                                name="manutencao" 
                                required={true}
                                options={[
                                    { title: 'Vistoria', value: 'vistoria' },
                                    { title: 'Substituição', value: 'substituicao' },
                                    { title: 'Nenhum', value: 'nenhum' },
                                ]} 
                            />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 d-flex justify-content-start'>
                        <button 
                            className='btn btn-primary'
                            type='button'
                            onClick={() => this.onClickAdicionar()}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
                <hr />
            </React.Fragment>
        )
    }

    renderCadLote() {
        const mappedRows = _.map(this.state.loterows, (row, index) => {
            return (
                <div className='row' key={index}>
                    <div className='col-2 col-sm-2 col-xl-2'>
                        <div 
                            className='form-group d-flex justify-content-center align-items-center mt-2'
                        >
                            <label>
                                <b>{index + 1}</b>
                            </label>
                        </div>
                    </div>
                    <div className='col-3 col-sm-3 col-xl-3'>
                        <div className='form-group'>
                            <input
                                className='form-control' 
                                value={row.mes}
                                onChange={e => {
                                    const newLote = [...this.state.loterows];
                                    newLote[index].mes = e.target.value;
                                    this.setState({ loterows: newLote });
                                }}
                            />
                        </div>
                    </div>
                    <div className='col-3 col-sm-3 col-xl-3'>
                        <div className='form-group'>
                            <input
                                className='form-control'
                                value={row.milhas}
                                onChange={e => {
                                    const newLote = [...this.state.loterows];
                                    newLote[index].milhas = e.target.value;
                                    this.setState({ loterows: newLote });
                                }}
                            />
                        </div>
                    </div>
                    <div className='col-3 col-sm-3 col-xl-3'>
                        <div className='form-group'>
                            <input
                                className='form-control'
                                value={row.quilometros}
                                onChange={e => {
                                    const newLote = [...this.state.loterows];
                                    newLote[index].quilometros = e.target.value;
                                    this.setState({ loterows: newLote });
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
        })
        return (
            <div>
                <div className='row'>
                    <div className='col-12'>
                        <div className='form-group'>
                            <label>Manutenção</label>
                            <Field 
                                component={RadioGroupInline}
                                name="manutencao" 
                                required={true}
                                options={[
                                    { title: 'Vistoria', value: 'vistoria' },
                                    { title: 'Substituição', value: 'substituicao' },
                                    { title: 'Nenhum', value: 'nenhum' },
                                ]} 
                            />
                        </div>
                    </div>
                </div>
                <div 
                    className='row'
                    style={{
                        paddingLeft: 2,
                        paddingRight: 38
                    }}
                >
                    <div className='col-2 col-sm-2 col-xl-2'>
                        <div className='form-group'>
                            <label htmlFor='mes'>Linha</label>
                        </div>
                    </div>
                    <div className='col-3 col-sm-3 col-xl-3'>
                        <div className='form-group'>
                            <label htmlFor='mes'>Mês</label>
                        </div>
                    </div>
                    <div className='col-3 col-sm-3 col-xl-3'>
                        <div className='form-group'>
                            <label htmlFor='milhas'>Mi x 1000</label>
                        </div>
                    </div>
                    <div className='col-3 col-sm-3 col-xl-3'>
                        <div className='form-group'>
                            <label htmlFor='km'>Km x 1000</label>
                        </div>
                    </div>
                </div>
                <div 
                    style={{
                        height: 200,
                        overflowY: 'scroll',
                        paddingRight: 20,
                        paddingTop: 10,
                        backgroundColor: '#E9ECEF',
                        borderWidth: 3,
                        borderColor: '#6C757D',
                        borderStyle: 'dotted'
                    }}
                >
                    {mappedRows}
                </div>
                <div className='row mt-2'>
                    <div className='col-4 col-md-4 d-flex justify-content-center'>
                        <button 
                            className='btn btn-sm btn-primary btn-block'
                            type='button'
                            onClick={() => this.setState({
                                loterows: [
                                    ...this.state.loterows,
                                    {
                                        key: this.state.loterows.length,
                                        mes: '',
                                        milhas: '',
                                        quilometros: ''
                                    }
                                ]
                            })}
                        >
                            Mais
                        </button>
                    </div>
                    <div className='col-4 col-md-4 d-flex justify-content-center'>
                        <button 
                            className='btn btn-sm btn-danger btn-block'
                            type='button'
                            onClick={() => {
                                if (this.state.loterows.length > 1) {
                                    const newLote = [...this.state.loterows];
                                    newLote.splice(this.state.loterows.length - 1, 1);
                                    this.setState({
                                        loterows: newLote
                                    });
                                }
                            }}
                        >
                            Menos
                        </button>
                    </div>
                    <div className='col-4 col-md-4 d-flex justify-content-center'>
                        <button 
                            className='btn btn-sm btn-secondary btn-block'
                            style={{ color: 'white' }}
                            type='button'
                            onClick={() => this.setState({
                                loterows: [
                                    {
                                        key: 0,
                                        mes: '',
                                        milhas: '',
                                        quilometros: ''
                                    }
                                ]
                            })}
                        >
                            Resetar
                        </button>
                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-12 d-flex justify-content-start'>
                        <button 
                            className='btn btn-primary'
                            type='button'
                            onClick={() => this.onClickAdicionarLote()}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div id='manutmain'>
                <div id={'manutmaincad'}>
                    <Main>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='form-group'>
                                    <label htmlFor='typecad'>Tipo</label>
                                    <select
                                        className="form-control" 
                                        name="typecad"
                                        value={this.state.typecad}
                                        onChange={event => this.setState({ typecad: event.target.value })}
                                    >
                                        <option 
                                            key={'simples'} 
                                            value={'simples'}
                                        >
                                            Simples
                                        </option>
                                        <option 
                                            key={'lote'} 
                                            value={'lote'}
                                        >
                                            Lote
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='form-group'>
                                    <label htmlFor='iditemmanut'>Itens de Manutenção</label>
                                    <Select 
                                        name="iditemmanut"
                                        placeholder={'Selecionar item...'}
                                        noOptionsMessage={() => 'Não há opções...'}
                                        onChange={option => 
                                            this.setState({ 
                                                itemmanutcombo: option 
                                            })
                                        }
                                        options={
                                            this.props.itemManutencaoCombo.map((value, index) => {
                                                if (value.itemabrev) {
                                                   return ({
                                                       value: value.itemmanutid,
                                                       label: value.itemabrev
                                                   });
                                                }

                                                return null;
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {this.renderCadType(this.state.typecad)}
                    </Main>
                    <Main>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='form-group'>
                                    <label>Link de referência</label>
                                    <div>
                                        <input 
                                            className='form-control'
                                            name='linkitemmanut'
                                            value={this.state.linkitemmanut}
                                            onChange={(e) => this.setState({ linkitemmanut: e.target.value })}
                                        />
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 d-flex justify-content-start'>
                                <button 
                                    className='btn btn-primary'
                                    type='button'
                                    onClick={() => this.onClickLinkSave()}
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </Main>
                </div>
                <div id={'manutmaintable'}>
                    <Main>
                        <ManutencaoTable itemsManut={this.props.dataTableManutencao} />
                    </Main>   
                </div>
                <ManutMdfItem />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    item: state.ComplementosReducer.item,
    itemManutencaoCombo: state.ManutencaoReducer.itemManutencaoCombo,
    dataTableManutencao: state.ManutencaoReducer.dataTableManutencao,
    initialValues: {
        iditemmanut: '',
        mes: '',
        milhas: '',
        km: '',
        manutencao: 'vistoria'
    }
});

Manutencao = reduxForm({
    form: 'manutencao',
    destroyOnUnmount: false
})(Manutencao); 

export default connect(mapStateToProps, {
    doPostManutencao,
    doPostManutencaoLote,
    doPutVehicleComp
})(Manutencao);

