import moment from 'moment';
import { observable, action } from 'mobx';
import Client from '../../app/base/client';
import ContractType from '../pages/trading/actions/helpers/contract_type';
import actions from '../pages/trading/actions/index';

export default class TradeStore {
    time_interval = undefined;

    @action.bound init() {
        this.time_interval = setInterval(actions.initTime, 1000);
        actions.getCountryAsync();

        actions.getTicks(action('getTicks', (r) => { this.tick = r; }));

        if (!Client.get('currency')) {
            actions.getCurrenciesAsync();
        }
        ContractType.buildContractTypesConfig(this.symbol).then(action(() => {
            this.contract_types_list = ContractType.getContractCategories();
        }));
    }

    @action.bound dispose() {
        clearInterval(this.time_interval);
        this.time_interval = undefined;
    }

    @action.bound handleChange(e) {
        const { name, value } = e.target;
        if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }
        this[name] = value;
    }

    // Underlying
    @observable symbols_list = { frxAUDJPY: 'AUD/JPY', AS51: 'Australian Index', HSI: 'Hong Kong Index', DEAIR: 'Airbus', frxXAUUSD: 'Gold/USD', R_10: 'Volatility 10 Index' };
    @observable symbol       = Object.keys(this.symbols_list)[0];

    // Contract Type
    @observable contract_type        = '';
    @observable contract_types_list  = {};
    @observable trade_types          = [];
    @observable contract_start_type  = '';
    @observable contract_expiry_type = '';
    @observable form_components      = [];

    // Amount
    @observable basis           = 'stake';
    @observable currency        = Client.get('currency');
    @observable currencies_list = {};
    @observable amount          = 5;

    // Duration
    @observable expiry_type         = 'duration';
    @observable duration            = 15;
    @observable duration_unit       = '';
    @observable duration_units_list = {};
    @observable expiry_date         = null;
    @observable expiry_time         = '09:40 pm';

    // Barrier
    @observable barrier_1 = 0;
    @observable barrier_2 = 0;

    // Start Time
    @observable start_dates_list = [];
    @observable start_date       = 'now';
    @observable start_time       = '12:30 am';

    // Last Digit
    @observable last_digit = 3;

    // Test
    @observable message = '';
    @observable tick    = '';

    // TODO: retrieve from upper state
    @observable server_time = moment.utc();

    // TODO: to remove dummy portfolio value
    @observable portfolio = [
        {
            transaction_id: 32355620467,
            contract_id   : 478981052055,
            payout        : 10,
            expiry_time   : 1522886399,
            longcode      : 'Win payout if AUD/JPY is strictly higher than entry spot at close on 2018-04-04.',
            shortcode     : 'CALL_FRXAUDJPY_10_1520263325_1522886399_S0P_0',
            currency      : 'USD',
            buy_price     : 1.06,
            app_id        : 1,
            symbol        : 'AUD/JPY',
        },
        {
            transaction_id: 47272620508,
            contract_id   : 432523746528,
            payout        : 10,
            expiry_time   : 15234686345,
            longcode      : 'Win payout if AUD/JPY is strictly higher than entry spot at close on 2018-05-04.',
            shortcode     : 'CALL_FRXAUDJPY_10_1520263325_1522886399_S0P_0',
            currency      : 'USD',
            buy_price     : -55.25,
            is_sold       : false,
            app_id        : 1,
            symbol        : 'Australian Index',
        },
        // proposal open contract
        {
            barrier            : '81.811',
            barrier_count      : 1,
            bid_price          : '6.45',
            buy_price          : 5.6,
            contract_id        : 23674746528,
            contract_type      : 'CALL',
            currency           : 'USD',
            current_spot       : '82.070',
            current_spot_time  : 1522819056,
            date_expiry        : 1523059199,
            date_settlement    : 1523059199,
            date_start         : 1520263325,
            display_name       : 'AUD/JPY',
            symbol             : 'AUD/JPY',
            entry_spot         : '81.811',
            entry_tick         : '81.811',
            entry_tick_time    : 1520263326,
            id                 : '9a3f2f8f-eec4-6bb7-a842-4fe7fdbaa4ec',
            is_expired         : 0,
            is_forward_starting: 0,
            is_intraday        : 1,
            is_path_dependent  : 0,
            is_settleable      : 0,
            is_sold            : false,
            is_valid_to_sell   : 0,
            longcode           : 'Win payout if AUD/JPY is strictly higher than entry spot at close on 2018-04-04.',
            payout             : '10',
            purchase_time      : 1520263325,
            shortcode          : 'CALL_FRXAUDJPY_10_1520263325_1522886399_S0P_0',
            status             : 'open',
            transaction_ids    : {
                buy: 47272620508,
            },
            underlying      : 'frxAUDJPY',
            validation_error: 'Resale of this contract is not offered.',
        },
    ];
};
