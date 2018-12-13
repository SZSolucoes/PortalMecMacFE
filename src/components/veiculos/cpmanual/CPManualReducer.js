
const INITIAL_STATE = {
    item: {},
    overlayModal: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_item_cpmanual':
            return {
                ...state,
                item: { ...action.payload }
            };
        case 'modify_overlaymodal_cpmanual':
            return {
                ...state,
                overlayModal: action.payload
            };
        case 'modify_clean_cpmanual':
            return {
                ...state,
                item: {},
                overlayModal: false
            };
        default:
            return state;
    }
}

