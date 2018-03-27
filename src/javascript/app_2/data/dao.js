import BinarySocket from '../../app/base/socket';
import { convertDateTimetoUnix } from '../common/date_time';

/* TODO:
      1. to manage subscriptions and subscription ids
      2. to handle forget and then resubscribe when needed
      3. to handle another request with the same values while the previous one still valid (either stream or not)
      4. to ...
*/
const DAO = (() => {
    const getActiveSymbols = () => BinarySocket.send({ active_symbols: 'brief' });

    const getContractsFor = (symbol) => BinarySocket.send({ contracts_for: symbol });

    const getPayoutCurrencies = () => BinarySocket.send({ payout_currencies: 1 });

    const getWebsiteStatus = () => BinarySocket.send({ website_status: 1 });

    const getTicks = (symbol, cb) => BinarySocket.send({ ticks: symbol, subscribe: 1 }, { callback: cb });

    const getProposal = (store, type_of_contract, cb) => {
        const req = {
            proposal     : 1,
            subscribe    : 1,
            amount       : parseFloat(store.amount),
            basis        : store.basis,
            contract_type: type_of_contract,
            currency     : store.currency,
            symbol       : store.symbol,
            ...(
                store.start_date !== 'now' &&
                { date_start: convertDateTimetoUnix(store.start_date, store.start_time) }
            ),
            ...(
                store.expiry_type === 'duration' ?
                {
                    duration     : parseInt(store.duration),
                    duration_unit: store.duration_unit,
                }
                :
                { date_expiry: convertDateTimetoUnix(store.expiry_date, store.expiry_time) }
            ),
            ...(
                (store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) &&
                { barrier: store.barrier_1 || store.last_digit }
            ),
            ...(
                store.barrier_count === 2 &&
                { barrier2: store.barrier_2 }
            ),
        };

        return BinarySocket.send(req, { callback: cb });
    };

    const forgetProposals = () => BinarySocket.send({ forget_all: 'proposal' });

    return {
        getActiveSymbols,
        getContractsFor,
        getPayoutCurrencies,
        getWebsiteStatus,
        getTicks,
        getProposal,
        forgetProposals,
    };
})();

module.exports = DAO;
