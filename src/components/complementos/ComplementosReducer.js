
const INITIAL_STATE = {
    item: {}
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_item_complementos':
            return {
                ...state,
                item: { ...action.payload }
            };
        case 'modify_clean_complementos':
            return {
                ...state,
                item: {}
            };
        default:
            return state;
    }
}

