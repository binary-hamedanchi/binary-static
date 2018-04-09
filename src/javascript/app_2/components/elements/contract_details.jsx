import React from 'react';
import Button from '../form/button.jsx';
import { Currency, addComma } from '../currency.jsx';
import { Time } from '../time.jsx';
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

    renderTransactionIDs = (ids) => (
        <React.Fragment>
            {ids.buy  ? `${ids.buy} (${localize('Buy')})` : ''}
            {ids.sell ? `${ids.sell} (${localize('Sell')})` : ''}
        </React.Fragment>
    );

    renderContractPurchaseRefs = (id) => (
        <React.Fragment>
            {localize('Your transaction reference is')}&nbsp;
            <span className='link'>{id}</span>
        </React.Fragment>
    );

    renderProfitLoss = ({ currency, sell_price, buy_price, bid_price }) => {
        const final_price = sell_price || bid_price;
        let profit_loss,
            percentage;

        if (final_price) {
            profit_loss = final_price - buy_price;
            percentage  = addComma((profit_loss * 100) / buy_price, 2);
        }

        return (
            <React.Fragment>
                {
                    final_price ?
                        <Currency currency={currency} amount={profit_loss} percentage={percentage} show_indicative />
                        :
                        <span className='loss'>-</span>
                }
            </React.Fragment>
        );
    };

    renderIndicativePrice = ({ currency, sell_price, bid_price, sell_time, date_expiry, is_settleable, is_sold }) => {
        const final_price = sell_price || bid_price;
        const user_sold   = sell_time && sell_time < date_expiry;
        const is_ended    = is_settleable || is_sold || user_sold;

        const indicative_price = final_price && is_ended ? final_price : (bid_price || null);

        return (<Currency currency={currency} amount={indicative_price} show_indicative />);
    };

    formatContractDetails = (contract) => {
        const {
            is_forward_starting,
            is_settleable,
            is_sold,
            transaction_ids,
            transaction_id,
            contract_id,
            date_start,
            date_expiry,
            current_spot,
            entry_spot,
            barrier,
            buy_price,
            currency,
            payout,
            current_spot_time,
            longcode,
        } = contract;

        const is_started    = !is_forward_starting || current_spot_time > date_start;
        const is_ended      = is_settleable || is_sold;
        const timer_options = {
            t_start  : current_spot_time,
            t_end    : date_expiry,
            t_stopped: (!is_started || is_ended),
        };

        return {
            trade_details_contract_type    : '',
            trade_details_contract_id      : contract_id,
            trade_details_ref_id           : this.renderTransactionIDs(transaction_ids || {}),
            trade_details_remaining_time   : <Time timer={timer_options} />,
            trade_details_start_date       : <Time epoch={date_start} />,
            trade_details_end_date         : <Time epoch={date_expiry} />,
            trade_details_entry_spot       : entry_spot,
            trade_details_barrier          : barrier,
            trade_details_purchase_price   : <Currency currency={currency} amount={buy_price} />,
            trade_details_potential_payout : <Currency currency={currency} amount={payout} />,
            trade_details_current_spot     : current_spot,
            trade_details_current_spot_time: <Time epoch={current_spot_time} />,
            trade_details_indicative_price : this.renderIndicativePrice(contract),
            trade_details_profit_loss      : this.renderProfitLoss(contract),
            trade_details_current_time     : <Time time={this.props.server_time} />,
            contract_purchase_desc         : longcode,
            contract_purchase_reference    : this.renderContractPurchaseRefs(transaction_id),
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