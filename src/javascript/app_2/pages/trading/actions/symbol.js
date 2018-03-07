import ContractType from '../store/logic/contract_type';

export const onSymbolChangeAsync = function *({symbol}) {
    const r = yield ContractType.getContractsList(symbol);
    return {
        contract_types_list: r,
    };
};
