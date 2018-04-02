import React from 'react';
import moment from 'moment';
import Button from '../form/button.jsx';
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
        this.updateDisplayData(nextProps.data);
    }

    updateDisplayData = (data) => {
        this.setState({ data });
    };

    renderRow = (row, row_id, row_length) => {
        const col_span = (row_length === 1) ? this.props.colSpan : undefined;

        const renderCell = (data, id, title) => (
            <td key={id} colSpan={col_span}>
                { title && <span>{title}</span> }
                { data && <span className={this.props.style ? this.props.style.cellClass : 'td-value'}>{data}</span> }
            </td>
        );

        return (
            <tr className={this.props.style ? this.props.style.rowClass : 'table-row'} key={row_id}>
                {
                    row.map(({ id, title }) => (
                        (renderCell)(this.state.data[id], id, title)
                    ))
                }
            </tr>
        );
    };

    renderBodyRows = () => this.state.rows.map((row, id) => this.renderRow(row, id, row.length));

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
                    {
                        this.renderBodyRows()
                    }
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
                { id: 'contract_type_label', title: 'Contract Type' },
                { id: 'contract_type' },
            ],
            [
                { id: 'transaction_id', title: 'Transaction ID' },
                { id: 'remaining_time', title: 'Remaining Time' },
            ],
            [
                { id: 'start_time', title: 'Start Time' },
                { id: 'end_time',   title: 'End Time' },
            ],
            [
                { id: 'entry_spot', title: 'Entry Spot' },
                { id: 'barrier',    title: 'Barrier' },
            ],
            [
                { id: 'purchase_price',   title: 'Purchase Price' },
                { id: 'potential_payout', title: 'Potential Payout' },
            ],
        ];

        const contract_performance = [
            [
                { id: 'spot',      title: 'Spot' },
                { id: 'spot_time', title: 'Spot Time' },
            ],
            [
                { id: 'indicative_price', title: 'Indicative' },
                { id: 'profit_loss',      title: 'Profit/Loss' },
            ],
            [
                { id: 'current_time_label', title: 'Current Time' },
                { id: 'current_time' },
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
                { id: 'contract_purchase_payout', title: 'Potential Payout' },
                { id: 'contract_purchase_cost',   title: 'Total Cost' },
                { id: 'contract_purchase_profit', title: 'Potential Profit' },
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
        const formated_data = this.getContractDetails(nextProps.contract);
        this.setState({ data: formated_data });
    }

    /*
        TODO: Format data
     */
    // Format contract details data
    getContractDetails = (contract) => {
        const epochToDateTime = epoch => {
            const date_time = moment.utc(epoch * 1000).format('YYYY-MM-DD HH:mm:ss');
            return `${date_time} GMT`;
        };
        const getCurrentTime = () => moment(this.props.server_time || undefined).utc().format('YYYY-MM-DD HH:mm:ss [GMT]');
        const getContractPurchaseReference = () => (
            <React.Fragment>
                {localize('Your transaction reference is')}&nbsp;
                <span className='link'>{contract.transaction_id}</span>
            </React.Fragment>
        );

        return {
            contract_type              : '',
            transaction_id             : contract.transaction_id,
            remaining_time             : '',
            start_time                 : contract.start_time,
            end_time                   : epochToDateTime(contract.expiry_time),
            entry_spot                 : '',
            barrier                    : '',
            purchase_price             : '',
            potential_payout           : '',
            spot                       : '',
            spot_time                  : '',
            indicative_price           : '',
            profit_loss                : '',
            current_time               : getCurrentTime(),
            contract_purchase_desc     : contract.longcode,
            contract_purchase_reference: getContractPurchaseReference(),
            contract_purchase_payout   : '',
            contract_purchase_cost     : '',
            contract_purchase_profit   : '',
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