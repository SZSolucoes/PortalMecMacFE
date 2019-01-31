import Axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { BASEURL } from '../../utils/urls';

export const modifyCleanAros = () => ({
    type: 'modify_clean_aros'
});

export const doGetCompAros = async (params) => {
    return Axios.get(`${BASEURL}comparos`, {
        params
    })
    .then((res) => {
        if (res.data && res.data.length) {
            return { success: true, data: res.data }
        }

        return { success: true, data: [] }
    })
    .catch(() => ({ success: false, data: [] }));
}

export const doPostCompAros = (params) => dispatch => {
    Axios.post(`${BASEURL}comparos`, params)
        .then(res => {
            if (res && res.data) {
                if (res.data.success === 'true') {
                    toastr.success('Sucesso', 'Adição realizada com sucesso.');
                } else {
                    const lowerMsg = res.data.message.toLowerCase();
                    if (lowerMsg.indexOf('duplicate') !== -1) {
                        toastr.error('Erro', 'Registro já cadastrado.');
                        return;
                    }

                    if (res.data.success === 'false') {
                        toastr.error('Erro', 'Falha ao incluir registro.');
                    }
                }
            }
        })
        .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'));
}

export const doPutCompAros = (params, closeBtn) => dispatch => {
    Axios.put(`${BASEURL}comparos`, params)
        .then(res => {
            if (res && res.data) {
                if (res.data.success === 'true') {
                    dispatch({
                        type: 'modify_refreshtable_aros',
                        payload: true
                    })
                    closeBtn().click();
                    toastr.success('Sucesso', 'Modificação realizada com sucesso.');
                } else {
                    const lowerMsg = res.data.message.toLowerCase();
                    if (lowerMsg.indexOf('duplicate') !== -1) {
                        toastr.error('Erro', 'Registro já cadastrado.');
                        return;
                    }

                    toastr.error('Erro', 'Falha ao modificar aro.');
                }
            }
        })
        .catch(() => toastr.error('Erro', 'Falha de comunicação com o servidor.'));
}

export const doDeleteCompAros = (id) => dispatch => {
    Axios.delete(`${BASEURL}comparos`, {
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

