
import Axios from 'axios';
import { BASEURL } from '../utils/urls';

export const modifyFlagGreen = (value) => ({
    type: 'modify_flaggreen_parametros',
    payload: value
});

export const modifyFlagRed = (value) => ({
    type: 'modify_flagred_parametros',
    payload: value
});

export const modifyTimeToRefresh = (value) => dispatch => {
    dispatch({
        type: 'modify_timetorefresh_parametros',
        payload: value
    });

    Axios.post(`${BASEURL}parametros`, {
            timerefresh: value
        })
        .then(() => {})
        .catch(() => {});

};

export const modifyFlag = (param, flag) => dispatch => {
    switch(flag) {
        case 'flaggreen':
            dispatch({
                type: 'modify_flaggreen_parametros',
                payload: param.flagreen
            });
            break;
        case 'flagred':
            dispatch({
                type: 'modify_flagred_parametros',
                payload: param.flagred
            });
            break;
        case 'flagyellow':
        default:
    }
   
    Axios.post(`${BASEURL}parametros`, {
            ...param
        })
        .then(() => {})
        .catch(() => {});

};
