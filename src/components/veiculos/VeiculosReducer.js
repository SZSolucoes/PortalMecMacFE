
const INITIAL_STATE = {
    listCarros: [],
    listCaminhoes: [],
    listMotos: [],
    filterCarTabOpened: false,
    filterTruckTabOpened: false,
    filterBikeTabOpened: false,
    filterCarTab: {
        fipeperiodoref: '',
        marca: '',
        modelo: '',
        ano: '',
        valor: '',
        combustivel: ''
    },
    filterTruckTab: {
        fipeperiodoref: '',
        marca: '',
        modelo: '',
        ano: '',
        valor: '',
        combustivel: ''
    },
    filterBikeTab: {
        fipeperiodoref: '',
        marca: '',
        modelo: '',
        ano: '',
        valor: '',
        combustivel: ''
    }
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_listcarros_veiculos':
            return {
                ...state,
                listCarros: [...action.payload]
            };
        case 'modify_listcaminhoes_veiculos':
            return {
                ...state,
                listCaminhoes: [...action.payload]
            };
        case 'modify_listmotos_veiculos':
            return {
                ...state,
                listMotos: [...action.payload]
            };
        case 'modify_filtercartab_veiculos':
            return {
                ...state,
                filterCarTab: {...action.payload}
            };
        case 'modify_filtertrucktab_veiculos':
            return {
                ...state,
                filterTruckTab: {...action.payload}
            };
        case 'modify_filterbiketab_veiculos':
            return {
                ...state,
                filterBikeTab: {...action.payload}
            };
        case 'modify_filtercartabopened_veiculos':
            return {
                ...state,
                filterCarTabOpened: action.payload
            };
        case 'modify_filtertrucktabopened_veiculos':
            return {
                ...state,
                filterTruckTabOpened: action.payload
            };
        case 'modify_filterbiketabopened_veiculos':
            return {
                ...state,
                filterBikeTabOpened: action.payload
            };
        case 'modify_clean_veiculos':
            return {
                ...state,
                listCarros: [],
                listCaminhoes: [],
                listMotos: [],
                filterCarTabOpened: false,
                filterTruckTabOpened: false,
                filterBikeTabOpened: false,
                filterCarTab: {
                    fipeperiodoref: '',
                    marca: '',
                    modelo: '',
                    ano: '',
                    valor: '',
                    combustivel: ''
                },
                filterTruckTab: {
                    fipeperiodoref: '',
                    marca: '',
                    modelo: '',
                    ano: '',
                    valor: '',
                    combustivel: ''
                },
                filterBikeTab: {
                    fipeperiodoref: '',
                    marca: '',
                    modelo: '',
                    ano: '',
                    valor: '',
                    combustivel: ''
                }
            };
        default:
            return state;
    }
}

