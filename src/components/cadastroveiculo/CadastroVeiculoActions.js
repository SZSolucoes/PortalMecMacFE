
import { change } from 'redux-form';
import Axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { BASEURL } from '../utils/urls';

import { consultarMarcas, consultarModelos, consultarAnoModelo } from '../utils/fipeApi';
import { doFetchVehicle } from '../utils/UtilsActions';
import { store } from '../../index';

export const doOpenVeiculoModal = (
    formType = '1', 
    veiculoType, 
    idVeiculo = '-1', 
    formValues = {
        fipeperiodoref: '',
        marca: '',
        modelo: '',
        ano: '',
        valor: '',
        combustivel: ''
    }
) => dispatch => {
    const veiculo = veiculoType || '1';
    const fipeTabRef = store.getState().CadastroVeiculoReducer.fipeTabRef;
    dispatch({
        type: 'modify_formtype_cadastroveiculo',
        payload: formType
    });
    dispatch({
        type: 'modify_formveiculotype_cadastroveiculo',
        payload: veiculo
    });
    dispatch({
        type: 'modify_idveiculo_cadastroveiculo',
        payload: idVeiculo
    });
    dispatch({
        type: 'modify_formvalues_cadastroveiculo',
        payload: formValues
    });

    if (formType === '2') {
        store.dispatch(change('cadastroveiculos', 'fipemesano', formValues.fipeperiodoref));
        store.dispatch(change('cadastroveiculos', 'marca', formValues.marca));
        store.dispatch(change('cadastroveiculos', 'modelo', formValues.modelo));
        store.dispatch(change('cadastroveiculos', 'ano', formValues.ano));
        store.dispatch(change('cadastroveiculos', 'valor', formValues.valor));
        store.dispatch(change('cadastroveiculos', 'combustivel', formValues.combustivel));
    }

    if (fipeTabRef && fipeTabRef.length > 0) {
        const funExec = async () => {
            dispatch(change('cadastroveiculos', 'fipeperiodoref', fipeTabRef[0].Codigo));
            const marcas = await consultarMarcas(fipeTabRef[0].Codigo, veiculo);
            if (marcas.success) {
                dispatch({
                    type: 'modify_fipemarcas_cadastroveiculo',
                    payload: marcas.data
                })
                dispatch(change('cadastroveiculos', 'fipemarca', marcas.data[0].Value));
            } else { return }

            const modelos = await consultarModelos(fipeTabRef[0].Codigo, veiculo, marcas.data[0].Value);
            if (modelos.success) {
                dispatch({
                    type: 'modify_fipemodelos_cadastroveiculo',
                    payload: modelos.data
                })
                dispatch(change('cadastroveiculos', 'fipemodelo', modelos.data[0].Value));
            } else { return }

            const anos = await consultarAnoModelo(fipeTabRef[0].Codigo, veiculo, marcas.data[0].Value, modelos.data[0].Value);
            if (anos.success) {
                dispatch({
                    type: 'modify_fipeanos_cadastroveiculo',
                    payload: anos.data
                })
                dispatch(change('cadastroveiculos', 'fipeano', anos.data[0].Value));
            } else { return }
        }
        funExec();
    }
};

export const modifyFormValues = (fields) => dispatch => {
    dispatch(change('cadastroveiculos', 'marca', fields.marca));
    dispatch(change('cadastroveiculos', 'modelo', fields.modelo));
    dispatch(change('cadastroveiculos', 'ano', fields.ano));
    dispatch(change('cadastroveiculos', 'valor', fields.valor));
    dispatch(change('cadastroveiculos', 'combustivel', fields.combustivel));
    dispatch(change('cadastroveiculos', 'recurso', fields.recurso));
    dispatch(change('cadastroveiculos', 'auditsqa', fields.auditsqa));
    dispatch(change('cadastroveiculos', 'przentreg', fields.przentreg));
    dispatch(change('cadastroveiculos', 'observ', fields.observ));
    dispatch(change('cadastroveiculos', 'horasproj', fields.horasproj));
    dispatch(change('cadastroveiculos', 'horasapont', fields.horasapont));
    dispatch(change('cadastroveiculos', 'status', fields.status));
};

export const modifyCadIdVeiculo = (value) => ({
    type: 'modify_idveiculo_cadastroveiculo',
    payload: value
});

export const modifyFormType = (value) => ({
    type: 'modify_formtype_cadastroveiculo',
    payload: value
});

export const modifyVeiculoType = (value) => ({
    type: 'modify_veiculotype_cadastroveiculo',
    payload: value
});

export const doPostVeiculo = (params, funCleanModal) => dispatch => {
    dispatch({
        type: 'modify_overlaymodaltext_cadastroveiculo',
        payload: 'Cadastro em andamento...'
    });
    dispatch({
        type: 'modify_overlaymodal_cadastroveiculo',
        payload: true
    });
    Axios.post(`${BASEURL}veiculos`, params)
        .then(res => onPostVeiculoSuccess(dispatch, res, params, funCleanModal))
        .catch(() => {
            dispatch({
                type: 'modify_overlaymodal_cadastroveiculo',
                payload: false
            });
            toastr.error('Erro', 'Falha de comunicação com o servidor.');
        });
};

const onPostVeiculoSuccess = (dispatch, res, params, funCleanModal) => {
    dispatch({
        type: 'modify_overlaymodal_cadastroveiculo',
        payload: false
    });
    if (res && res.data) {
        if (res.data.success === 'true') {
            toastr.success('Sucesso', 'Cadastro realizado com sucesso.');
            
            funCleanModal(params);
            
            refreshVehicle(params.vehicletype);
        } else {
            const lowerMsg = res.data.message.toLowerCase();
            if (lowerMsg.indexOf('duplicate') !== -1) {
                toastr.error('Erro', 'Veículo já cadastrado.');
            }
        }
    }
};

export const doRemoveVeiculo = (id, vehicletype) => dispatch => {
    Axios.delete(`${BASEURL}veiculos`, { params: { id, vehicletype } })
        .then(res => onDeleteVeiculoSuccess(dispatch, res, vehicletype))
        .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'));
};

const onDeleteVeiculoSuccess = (dispatch, res, vehicletype) => {
    if (res && res.data) {
        if (res.data.success === 'true') {
            toastr.success('Sucesso', res.data.message);
            refreshVehicle(vehicletype);
        } else {
            toastr.error('Erro', res.data.message); 
        }
    }
};

export const doPutVeiculo = (params, funCleanCloseModal) => dispatch => {
    dispatch({
        type: 'modify_overlaymodaltext_cadastroveiculo',
        payload: 'Modificação em andamento...'
    });
    dispatch({
        type: 'modify_overlaymodal_cadastroveiculo',
        payload: true
    });
    Axios.put(`${BASEURL}veiculos`, params)
        .then(res => onPutVeiculoSuccess(dispatch, res, params, funCleanCloseModal))
        .catch(() => {
            dispatch({
                type: 'modify_overlaymodal_cadastroveiculo',
                payload: false
            });
            toastr.error('Erro', 'Falha de comunicação com o servidor.');
        });
};

const onPutVeiculoSuccess = (dispatch, res, params, funCleanCloseModal) => {
    dispatch({
        type: 'modify_overlaymodal_cadastroveiculo',
        payload: false
    });
    if (res && res.data) {
        if (res.data.success === 'true') {
            toastr.success('Sucesso', 'Modificação realizada com sucesso.');
            
            funCleanCloseModal().click();
            
            refreshVehicle(params.vehicletype, params);
        } else {
            const lowerMsg = res.data.message.toLowerCase();
            if (lowerMsg.indexOf('duplicate') !== -1) {
                toastr.error('Erro', 'Veículo já cadastrado.');
                return;
            }

            toastr.error('Erro', 'Falha na modificação do veículo.');
        }
    }
};

const refreshVehicle = (vehicletype, params) => {
    const asyncFunExec = async () => {
        const veiculo = await doFetchVehicle({ vehicletype });
        if (veiculo && veiculo.success) {
            if (vehicletype === '1') {
                store.dispatch({
                    type: 'modify_listcarros_veiculos',
                    payload: veiculo.data
                });
                store.dispatch({
                    type: 'modify_isrefreshtabcar_veiculos',
                    payload: true
                });
            } else if (vehicletype === '2') {
                store.dispatch({
                    type: 'modify_listmotos_veiculos',
                    payload: veiculo.data
                });
                store.dispatch({
                    type: 'modify_isrefreshtabbike_veiculos',
                    payload: true
                });
            } else if (vehicletype === '3') {
                store.dispatch({
                    type: 'modify_listcaminhoes_veiculos',
                    payload: veiculo.data
                });
                store.dispatch({
                    type: 'modify_isrefreshtabtruck_veiculos',
                    payload: true
                });
            }
        }
    }
    asyncFunExec();
}

