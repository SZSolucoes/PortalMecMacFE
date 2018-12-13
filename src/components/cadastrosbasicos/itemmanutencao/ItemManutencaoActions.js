import Axios from 'axios';
import { toastr } from 'react-redux-toastr';

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

export const doGetLastId = async () => {
    return Axios.get(`${BASEURL}itemmanutencaoid`)
            .then((res) => ({ success: true, data: res.data }))
            .catch(() => ({ success: false, data: [] }));
}

export const doGetDataTableItemManutencao = async () => {
    return Axios.get(`${BASEURL}itemmanutencao`)
            .then((res) => ({ success: true, data: res.data }))
            .catch(() => ({ success: false, data: [] }));
}

