
import Axios from 'axios';
import { BASEURL } from '../components/utils/urls';

export const doFetchParametros = () => dispatch => {
    Axios.get(`${BASEURL}parametros`
    )
    .then(res => onFetchSuccess(dispatch, res))
    .catch((e) => onFetchError(e));
};

const onFetchSuccess = (dispatch, res) => {
    if (res.data && Array.isArray(res.data)) {
        dispatch({
            type: 'modify_timetorefresh_parametros',
            payload: res.data[0].timerefresh
        });
        dispatch({
            type: 'modify_flaggreen_parametros',
            payload: res.data[0].flaggreen
        });
        dispatch({
            type: 'modify_flagred_parametros',
            payload: res.data[0].flagred
        });
    }
}

const onFetchError = (e) => {

}
