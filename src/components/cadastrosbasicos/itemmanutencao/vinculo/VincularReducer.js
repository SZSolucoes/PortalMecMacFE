
const INITIAL_STATE = {
    itemid: -1,
    overlayModal: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_item_vincularitemmanut':
            return {
                ...state,
                itemid: action.payload
            };
        case 'modify_overlaymodal_vincularitemmanut':
            return {
                ...state,
                overlayModal: action.payload
            };
        case 'modify_clean_vincularitemmanut':
            return {
                ...state,
                itemid: -1,
                overlayModal: false
            };
        default:
            return state;
    }
}

