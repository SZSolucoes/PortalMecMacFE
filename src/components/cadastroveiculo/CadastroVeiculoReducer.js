
const INITIAL_STATE = {
    idVeiculo: '',
    formType: '',
    formVeiculoType: '',
    fipeTabRef: [],
    fipeMarcas: [],
    fipeModelos: [],
    fipeAnos: [],
    formValues: {
        fipeperiodoref: '',
        marca: '',
        modelo: '',
        ano: '',
        valor: '',
        combustivel: ''
    },
    overlayModal: false,
    overlayModalText: 'Em andamento...'
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'modify_idveiculo_cadastroveiculo':
            return {
                ...state,
                idVeiculo: action.payload
            };
        case 'modify_formtype_cadastroveiculo':
            return {
                ...state,
                formType: action.payload
            };
        case 'modify_formveiculotype_cadastroveiculo':
            return {
                ...state,
                formVeiculoType: action.payload
            };
        case 'modify_fipetabref_cadastroveiculo':
            return {
                ...state,
                fipeTabRef: [...action.payload]
            };
        case 'modify_fipemarcas_cadastroveiculo':
            return {
                ...state,
                fipeMarcas: [...action.payload]
            };
        case 'modify_fipemodelos_cadastroveiculo':
            return {
                ...state,
                fipeModelos: [...action.payload]
            };
        case 'modify_fipeanos_cadastroveiculo':
            return {
                ...state,
                fipeAnos: [...action.payload]
            };
        case 'modify_formvalues_cadastroveiculo':
            return {
                ...state,
                formValues: { ...action.payload }
            };
        case 'modify_overlaymodal_cadastroveiculo':
            return {
                ...state,
                overlayModal: action.payload
            };
        case 'modify_overlaymodaltext_cadastroveiculo':
            return {
                ...state,
                overlayModalText: action.payload
            };
        case 'modify_clean_utils':
            return {
                ...state,
                idVeiculo: '',
                formType: '',
                formVeiculoType: '',
                fipeTabRef: {},
                fipeMarcas: [],
                fipeModelos: [],
                fipeAnos: [],
                formValues: {},
                overlayModal: false,
                overlayModalText: ''
            };
        default:
            return state;
    }
}

