import Axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { BASEURL } from "../../utils/urls";

export const modifyCPManualItem = (value) => ({
    type: 'modify_item_cpmanual',
    payload: value
});

export const doConfirmCPManual = (params) => async dispatch => {
    dispatch({
        type: 'modify_overlaymodal_cpmanual',
        payload: true
    });
    await Axios.post(`${BASEURL}cpmanual`, params)
            .then((res) => {
                if (res && res.data) {
                    if (res.data.success === 'true') {
                        toastr.success('Sucesso', res.data.message);
                        return true;
                    } else {
                        toastr.error('Erro', res.data.message);
                        return false;
                    }
                }
            })
            .catch(() => false);
    dispatch({
        type: 'modify_overlaymodal_cpmanual',
        payload: false
    });
}

