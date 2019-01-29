
const INITIAL_STATE = {
    overlayModal: false,
    overlayModalText: 'Em andamento...'
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_overlaymodal_app':
            return {
                ...state,
                overlayModal: action.payload
            };
        case 'modify_overlaymodaltext_app':
            return {
                ...state,
                overlayModalText: action.payload
            };
        case 'modify_clean_utils':
            return {
                ...state,
                overlayModal: false,
                overlayModalText: ''
            };
        default:
            return state;
    }
}

