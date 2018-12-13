import { store } from '../../index';
import { diffDates } from '../utils/dates';

export const checkStatus = (value) => {
    const today = new Date().toDateString();
    const paramState = store.getState().ParametrosReducer;
    const diff = diffDates(today, value);
    const flagDays = [
        { flag: 'green', value: parseInt(paramState.flagGreen, 10) },
        { flag: 'red', value: parseInt(paramState.flagRed, 10) }
     ].sort((a, b) => (b.value - a.value));

    let flagStatusColor = 'black';

    flagDays.forEach(day => {
        if (diff <= day.value) {
            flagStatusColor = day.flag;
        }
    });

    return flagStatusColor;
}