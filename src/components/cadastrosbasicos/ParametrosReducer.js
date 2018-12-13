
const INITIAL_STATE = {
    flagGreen: '0',
    flagRed: '0',
    timeToRefresh: '10',
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_flaggreen_parametros':
            return {
                ...state,
                flagGreen: action.payload
            };
        case 'modify_flagred_parametros':
            return {
                ...state,
                flagRed: action.payload
            };
        case 'modify_timetorefresh_parametros':
            return {
                ...state,
                timeToRefresh: action.payload
            };
        case 'modify_clean_parametros':
            return {
                ...state,
                flagGreen: '0',
                flagRed: '0',
                timeToRefresh: '10'
            };
        default:
            return state;
    }
}

