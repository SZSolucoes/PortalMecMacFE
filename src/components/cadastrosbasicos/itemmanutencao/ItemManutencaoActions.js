import Axios from 'axios';
import { toastr } from 'react-redux-toastr';
import _ from 'lodash';

import { BASEURL } from '../../utils/urls';

export const doPostItem = (params, btnClick) => dispatch => {
    Axios.post(`${BASEURL}itemmanutencao`, params)
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                btnClick.click();
                toastr.success('Sucesso', 'Inclusão realizada com sucesso.');
            } else {
                const lowerMsg = res.data.message.toLowerCase();
                if (lowerMsg.indexOf('duplicate') !== -1) {
                    toastr.error('Erro', 'Registro já existe.');
                    return;
                }

                if (res.data.success === 'false') {
                    toastr.error('Erro', 'Falha ao incluir item.');
                }
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doPutItem = (params, btnClose) => dispatch => {
    Axios.put(`${BASEURL}itemmanutencao`, params)
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                dispatch({
                    type: 'modify_refreshtable_itemmanutencao',
                    payload: true
                });
                btnClose().click();
                toastr.success('Sucesso', 'Modificação realizada com sucesso.');
            } else {
                const lowerMsg = res.data.message.toLowerCase();
                if (lowerMsg.indexOf('duplicate') !== -1) {
                    toastr.error('Erro', 'Registro já existe.');
                    return;
                }

                if (res.data.success === 'false') {
                    toastr.error('Erro', 'Falha ao modificar item.');
                }
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doPostCsvItens = (params) => dispatch => {
    Axios.post(`${BASEURL}itemmanutencaobatch`, params)
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                toastr.success('Sucesso', 'Inclusão efetuada com sucesso.');
            } else {
                const lowerMsg = res.data.message.toLowerCase();
                if (lowerMsg.indexOf('duplicate') !== -1) {
                    toastr.error('Erro', 'Registro já existe.');
                    return;
                }

                if (res.data.success === 'false') {
                    toastr.error('Erro', 'Falha ao incluir registro.');
                }
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doDeleteItemManutencao = (id) => dispatch => {
    Axios.delete(`${BASEURL}itemmanutencao`, {
        params: {
            id
        }
    })
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                toastr.success('Sucesso', res.data.message);
            } else {
                toastr.error('Erro', res.data.message); 
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doDeleteVincular = (params, btnAction) => dispatch => {
    Axios.delete(`${BASEURL}itemmanutxvehicle`, {
        params
    })
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                if (btnAction) {
                    btnAction();
                }
                toastr.success('Sucesso', res.data.message);
            } else {
                toastr.error('Erro', res.data.message); 
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doPostVincCsvItens = (params) => dispatch => {
    Axios.post(`${BASEURL}itemmanutxvehiclebatch`, params)
    .then((res) => {
        if (res && res.data) {
            if (res.data.success === 'true') {
                if (res.data.message && res.data.message instanceof Array && res.data.message.length) {
                    let veiculos = '';
                    res.data.message.forEach(element => {
                        veiculos += `${element}\n`;
                    });
                    alert('Os veículos a seguir não foram importados devido a não possuirem cadastro.\n' + veiculos)
                } else {
                    toastr.success('Sucesso', 'Inclusão efetuada com sucesso.');
                }
            } else {
                const lowerMsg = res.data.message.toLowerCase();
                if (lowerMsg.indexOf('duplicate') !== -1) {
                    toastr.error('Erro', 'Registro já existe.');
                    return;
                }
                if (res.data.success === 'false') {
                    toastr.error('Erro', 'Falha ao inserir registro.');
                }
            }
        }
    })
    .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'))
}

export const doGetLastId = async () => {
    return Axios.get(`${BASEURL}itemmanutencaoid`)
            .then((res) => ({ success: true, data: res.data }))
            .catch(() => ({ success: false, data: [] }));
}

export const doGetDataTableItemManutencao = async (id) => {
    return Axios.get(`${BASEURL}itemmanutencao`, { params: { id } })
            .then((res) => ({ success: true, data: res.data }))
            .catch(() => ({ success: false, data: [] }));
}


export const doFetchVehicles = (params, vehicles) => async dispatch => {
    try {
        const res = await Axios.get(`${BASEURL}itemmanutxvehicle`, { params });
        if (res && res.data && res.data instanceof Array) {
            let vFiltred = [];
    
            vFiltred = _.filter(vehicles, (item) => {
                for (let index = 0; index < res.data.length; index++) {
                    const element = res.data[index];
                    if (element.vehicleid === item.id) {
                        return true;
                    }
                }
            });
    
            vFiltred = _.map(vFiltred, item => {
                for (let index = 0; index < res.data.length; index++) {
                    const element = res.data[index];
                    if (element.vehicleid === item.id) {
                        return { ...item, id: element.id };
                    }
                }
    
                return item;
            })
    
            dispatch({
                type: 'modify_datatablevehicles_itemmanutencao',
                payload: vFiltred
            });
        } else if (!(res && res.data)) {
            toastr.error('Erro', 'Falha de comunicação com o servidor.');
        }
    } catch (e) {
        dispatch({
            type: 'modify_veiculosloading_itemmanutencao',
            payload: false
        });

        return;
    }

    dispatch({
        type: 'modify_veiculosloading_itemmanutencao',
        payload: false
    });
}
