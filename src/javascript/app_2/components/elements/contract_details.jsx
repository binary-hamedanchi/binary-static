import React from 'react';
import moment from 'moment';
import Button from '../form/button.jsx';
import { Currency, addComma } from '../currency.jsx';
import { localize } from '../../../_common/localize';

class ContractDetailsTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rows: this.props.rows,
            data: this.props.data,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });
    }

    renderRow = (row, row_id, row_length) => {
        const col_span = (row_length === 1) ? this.props.colSpan : undefined;

        const renderCell = (data, id, label) => (
            <td key={id} colSpan={col_span}>
                { label && <span>{label}</span> }
                { data  && <div className={this.props.style ? this.props.style.cellClass : 'td-value'}>{data}</div> }
            </td>
        );

        return (
            <tr className={this.props.style ? this.props.style.rowClass : 'table-row'} key={row_id}>
                { row.map(({ id, label }) => ((renderCell)(this.state.data[id], id, label))) }
            </tr>
        );
    };

    render() {
        const { title, colSpan } = this.props;

        return (
            <table className={`table ${this.props.style ? this.props.style.tableClass : ''}`}>
                <thead className='table-thead'>
                    <tr className='table-row'>
                        <th colSpan={colSpan} align='center'>
                            { title }
                        </th>
                    </tr>
                </thead>
                <tbody className='table-tbody'>
                    { this.state.rows.map((row, id) => this.renderRow(row, id, row.length)) }
                </tbody>
            </table>
        );
    }
}

class ContractDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        const contract_details = [
            [
                { id: 'trade_details_contract_type', label: 'Contract Type' },
                { id: 'trade_details_contract_id',   label: 'Contract ID' },
            ],
            [
                { id: 'trade_details_ref_id',         label: 'Transaction ID' },
                { id: 'trade_details_remaining_time', label: 'Remaining Time' },
            ],
            [
                { id: 'trade_details_start_date', label: 'Start Time' },
                { id: 'trade_details_end_date',   label: 'End Time' },
            ],
            [
                { id: 'trade_details_entry_spot', label: 'Entry Spot' },
                { id: 'trade_details_barrier',    label: 'Barrier' },
            ],
            [
                { id: 'trade_details_purchase_price',   label: 'Purchase Price' },
                { id: 'trade_details_potential_payout', label: 'Potential Payout' },
            ],
        ];

        const contract_performance = [
            [
                { id: 'trade_details_current_spot',      label: 'Spot' },
                { id: 'trade_details_current_spot_time', label: 'Spot Time' },
            ],
            [
                { id: 'trade_details_indicative_price', label: 'Indicative' },
                { id: 'trade_details_profit_loss',      label: 'Profit/Loss' },
            ],
            [
                { id: 'trade_details_current_time_label', label: 'Current Time' },
                { id: 'trade_details_current_time' },
            ],
        ];

        const contract_purchase = [
            [
                { id: 'contract_purchase_desc' },
            ],
            [
                { id: 'contract_purchase_reference' },
            ],
            [
                { id: 'contract_purchase_payout', label: 'Potential Payout' },
                { id: 'contract_purchase_cost',   label: 'Total Cost' },
                { id: 'contract_purchase_profit', label: 'Potential Profit' },
            ],
        ];

        this.state = {
            contract_details,
            contract_performance,
            contract_purchase,
            data: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        const { contract } = nextProps;
        this.setState({
            data: this.formatContractDetails(contract),
        });
    }

    /*
        TODO: Format data
     */
    // Format contract details data
    formatContractDetails = (contract) => {
        const final_price       = contract.sell_price || contract.bid_price;
        const user_sold         = contract.sell_time && contract.sell_time < contract.date_expiry;
        const is_ended          = contract.is_settleable || contract.is_sold || user_sold;
        const indicative_price  = final_price && is_ended ? final_price : (contract.bid_price || null);
        const is_started        = !contract.is_forward_starting || contract.current_spot_time > contract.date_start;
        // const sold_before_start = contract.sell_time && contract.sell_time < contract.date_start;

        const getContractPurchaseReference = () => (
            <React.Fragment>
                {localize('Your transaction reference is')}&nbsp;
                <span className='link'>{contract.transaction_id}</span>
            </React.Fragment>
        );

        const getTransactionIDs = (ids) => (
            <React.Fragment>
                {ids.buy  ? `${ids.buy} (${localize('Buy')})` : ''}
                {ids.sell ? `${ids.sell} (${localize('Sell')})` : ''}
            </React.Fragment>
        );

        const getRemainingTime = () => {
            let time_left;

            const now = Math.max(Math.floor((window.time || 0) / 1000), contract.current_spot_time || 0);

            // const is_started = !contract.is_forward_starting || contract.current_spot_time > contract.date_start;
            // const is_ended   = contract.is_settleable || contract.is_sold;
            if ((!is_started || is_ended || now >= contract.date_expiry)) {
                time_left = '-';
            } else {
                let remained = contract.date_expiry - now;
                let days = 0;
                const day_seconds = 24 * 60 * 60;
                if (remained > day_seconds) {
                    days = Math.floor(remained / day_seconds);
                    remained %= day_seconds;
                }
                time_left = (days > 0 ? `${days} ${localize(days > 1 ? 'days' : 'day')}, ` : '') + moment((remained) * 1000).utc().format('HH:mm:ss');
            }
            return time_left;
        };

        const epochToDateTime = epoch => (`${moment.utc(epoch * 1000).format('YYYY-MM-DD HH:mm:ss')} GMT`);

        const displayCurrentTime = (time) => moment(time || undefined).utc().format('YYYY-MM-DD HH:mm:ss [GMT]');

        const getIndicativePrice = () => indicative_price ? <Currency currency={contract.currency} amount={contract.buy_price} /> : '-';

        const getProfitLoss = () => {
            let profit_loss,
                percentage;

            if (final_price) {
                profit_loss = final_price - contract.buy_price;
                percentage  = addComma((profit_loss * 100) / contract.buy_price, 2);
            }

            return (
                <React.Fragment>
                    {
                        final_price ?
                            <span className={profit_loss >= 0? 'profit' : 'loss'}>
                                <Currency currency={contract.currency} amount={profit_loss} />
                                &nbsp;<span className='percent'>({ percentage > 0 ? '+' : '' }{percentage}%)</span>
                            </span>
                            :
                            <span className='loss'>-</span>
                    }
                </React.Fragment>
            );
        };

        return {
            trade_details_contract_type    : '',
            trade_details_contract_id      : contract.contract_id,
            trade_details_ref_id           : getTransactionIDs(contract.transaction_ids || {}),
            trade_details_remaining_time   : getRemainingTime(),
            trade_details_start_date       : epochToDateTime(contract.date_start),
            trade_details_end_date         : epochToDateTime(contract.date_expiry),
            trade_details_entry_spot       : contract.entry_spot,
            trade_details_barrier          : contract.barrier,
            trade_details_purchase_price   : <Currency currency={contract.currency} amount={contract.buy_price} />,
            trade_details_potential_payout : <Currency currency={contract.currency} amount={contract.payout} />,
            trade_details_current_spot     : contract.current_spot,
            trade_details_current_spot_time: epochToDateTime(contract.current_spot_time),
            trade_details_indicative_price : getIndicativePrice(),
            trade_details_profit_loss      : getProfitLoss(),
            trade_details_current_time     : displayCurrentTime(this.props.server_time),
            contract_purchase_desc         : contract.longcode,
            contract_purchase_reference    : getContractPurchaseReference(),
            contract_purchase_payout       : '',
            contract_purchase_cost         : '',
            contract_purchase_profit       : '',
        };
    };

    render() {
        const custom_style = {
            tableClass: 'custom-table',
            rowClass  : undefined,
            cellClass : undefined,
        };

        return (
            <div className='contract-details'>
                <fieldset>
                    <div className='table-container contract-details-table'>
                        <ContractDetailsTable
                            title={localize('Contract Details')}
                            rows={this.state.contract_details}
                            data={this.state.data}
                            colSpan={2}
                        />
                        <ContractDetailsTable
                            title={localize('Contract Performance')}
                            rows={this.state.contract_performance}
                            data={this.state.data}
                            colSpan={2}
                        />
                        <ContractDetailsTable
                            title={localize('Contract Confirmed')}
                            rows={this.state.contract_purchase}
                            data={this.state.data}
                            style={custom_style}
                            colSpan={3}
                        />
                    </div>
                </fieldset>

                <Button
                    className='secondary orange'
                    has_effect
                    text={localize('Back to trade room')}
                    handleClick={this.props.onClick.bind(this, true)}
                />
            </div>
        );
    }
}

export default ContractDetails;