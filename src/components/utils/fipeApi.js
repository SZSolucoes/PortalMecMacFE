import Axios from 'axios';
import { BASEURL } from './urls';

export const consultarTabelaDeReferencia = async () => {
    return Axios.get(`${BASEURL}ConsultarTabelaDeReferencia`
    )
    .then((res) => {
        const success = res && res.data && res.data.success && res.data.success === 'true';
        if (success) {
            return { success, data: res.data.data };
        } else {
            return { success: false, data: {} };
        }
    })
    .catch(() => {
        console.log('Ocorreu um erro ao buscar a tabela de referência fipe.');
        return { success: false, data: {} };
    });
}

export const consultarMarcas = async (codTab, codVeiculoType) => {
    return Axios.get(
        `${BASEURL}ConsultarMarcas`,
        {
            params: {
                codigoTabelaReferencia: codTab,
                codigoTipoVeiculo: codVeiculoType
            }
        }
    )
    .then((res) => {
        const success = res && res.data && res.data.success && res.data.success === 'true';
        if (success) {
            return { success, data: res.data.data };
        } else {
            return { success: false, data: {} };
        }
    })
    .catch(() => {
        console.log('Ocorreu um erro ao buscar as marcas fipe.');
        return { success: false, data: {} };
    });
}

export const consultarModelos = async (codigoTabelaReferencia, codigoTipoVeiculo, codigoMarca) => {
    return Axios.get(
        `${BASEURL}ConsultarModelos`,
        {
            params: {
                codigoTabelaReferencia,
                codigoTipoVeiculo,
                codigoMarca
            }
        }
    )
    .then((res) => {
        const success = res && res.data && res.data.success && res.data.success === 'true';
        if (success) {
            return { success, data: res.data.data.Modelos };
        } else {
            return { success: false, data: {} };
        }
    })
    .catch(() => {
        console.log('Ocorreu um erro ao buscar os modelos fipe.');
        return { success: false, data: {} };
    });
}

export const consultarAnoModelo = async (codigoTabelaReferencia, codigoTipoVeiculo, codigoMarca, codigoModelo) => {
    return Axios.get(
        `${BASEURL}consultarAnoModelo`,
        {
            params: {
                codigoTabelaReferencia,
                codigoTipoVeiculo,
                codigoMarca,
                codigoModelo
            }
        }
    )
    .then((res) => {
        const success = res && res.data && res.data.success && res.data.success === 'true';
        if (success) {
            return { success, data: res.data.data };
        } else {
            return { success: false, data: {} };
        }
    })
    .catch(() => {
        console.log('Ocorreu um erro ao buscar os anos fipe.');
        return { success: false, data: {} };
    });
}

export const consultarModelosAtravesDoAno = async (
    codigoTabelaReferencia, codigoTipoVeiculo, codigoMarca, ano, codigoTipoCombustivel, anoModelo) => {
    return Axios.get(
        `${BASEURL}consultarModelosAtravesDoAno`,
        {
            params: {
                codigoTabelaReferencia,
                codigoTipoVeiculo,
                codigoMarca,
                ano,
                codigoTipoCombustivel,
                anoModelo
            }
        }
    )
    .then((res) => {
        const success = res && res.data && res.data.success && res.data.success === 'true';
        if (success) {
            return { success, data: res.data.data };
        } else {
            return { success: false, data: {} };
        }
    })
    .catch(() => {
        console.log('Ocorreu um erro ao buscar os modelos atraves do ano fipe.');
        return { success: false, data: {} };
    });
}

export const ConsultarValorComTodosParametros = async (
    codigoTabelaReferencia, codigoTipoVeiculo, 
    codigoMarca, ano, codigoTipoCombustivel, anoModelo, codigoModelo, tipoConsulta) => {
    return Axios.get(
        `${BASEURL}ConsultarValorComTodosParametros`,
        {
            params: {
                codigoTabelaReferencia,
                codigoTipoVeiculo,
                codigoMarca,
                ano,
                codigoTipoCombustivel,
                anoModelo,
                codigoModelo,
                tipoConsulta: tipoConsulta || 'tradicional'
            }
        }
    )
    .then((res) => {
        const success = res && res.data && res.data.success && res.data.success === 'true';
        if (success) {
            return { success, data: res.data.data };
        } else {
            return { success: false, data: {} };
        }
    })
    .catch(() => {
        console.log('Ocorreu um erro ao buscar todos os valores fipe.');
        return { success: false, data: {} };
    });
}