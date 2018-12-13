
const INITIAL_STATE = {
    modalTitle: '',
    modalMessage: '',
    btnType: '',
    extraData: {}
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_modaltitle_utils':
            return {
                ...state,
                modalTitle: action.payload
            };
        case 'modify_modalmessage_utils':
            return {
                ...state,
                modalMessage: action.payload
            };
        case 'modify_btntype_utils':
            return {
                ...state,
                btnType: action.payload
            };
        case 'modify_extradata_utils':
            return {
                ...state,
                extraData: { ...action.payload }
            };
        case 'modify_clean_utils':
            return {
                ...state,
                modalTitle: '',
                modalMessage: '',
                btnType: '',
                extraData: {}
            };
        default:
            return state;
    }
}

