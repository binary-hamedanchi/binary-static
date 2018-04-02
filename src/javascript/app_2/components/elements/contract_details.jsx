import React from 'react';
import Button from '../form/button.jsx';
import { localize } from '../../../_common/localize';

class ContractTable extends React.PureComponent {
    render() {
        const { id, title, rows } = this.props;

        const TableRow = ({columns}) => {
            const data = columns.length === 1 ? columns[0] : columns;
            return (
                <tr className='table-row'>
                    {
                        columns.length === 1 ?
                            <React.Fragment>
                                <td key={data.id}>
                                    { data.name && <span>{localize(data.name)}</span> }
                                </td>
                                <td>
                                    <span className='td-value'>{data.value}</span>
                                </td>
                            </React.Fragment>
                        :
                        columns.map((column) =>  (
                            <td key={column.id}>
                                { column.name && <span>{localize(column.name)}</span> }
                                <span className='td-value'>{column.value}</span>
                            </td>
                        ))
                    }
                </tr>
            );
        };

        return (
            <table className='table'>
                <thead className='table-thead'>
                    <tr className='table-row'>
                        <th colSpan='2' align='center'>
                            {localize(title)}
                        </th>
                    </tr>
                </thead>
                <tbody className='table-tbody'>
                    { rows.map((row, idx) => (<TableRow key={`${id}_${idx}`} columns={row} />)) }
                </tbody>
            </table>
        );
    }
}

class ContractDetails extends React.PureComponent {
    render() {
        const props = this.props.portfolio;

        const contract_details_rows = [
            [
                {
                    id   : 'contract_type',
                    name : 'Contract Type',
                    value: props.contract_type,
                },
            ],
            [
                {
                    id   : 'transaction_id',
                    name : 'Transaction ID',
                    value: props.transaction_id,
                },
                {
                    id   : 'remaining_time',
                    name : 'Remaining Time',
                    value: props.transaction_id,
                },
            ],
            [
                {
                    id   : 'start_time',
                    name : 'Start Time',
                    value: props.transaction_id,
                },
                {
                    id   : 'end_time',
                    name : 'End Time',
                    value: props.transaction_id,
                },
            ],
            [
                {
                    id   : 'entry_spot',
                    name : 'Entry Spot',
                    value: props.transaction_id,
                },
                {
                    id   : 'barrier',
                    name : 'Barrier',
                    value: props.transaction_id,
                },
            ],
            [
                {
                    id   : 'purchase_price',
                    name : 'Purchase Price',
                    value: props.transaction_id,
                },
                {
                    id   : 'potential_payout',
                    name : 'Potential Payout',
                    value: props.transaction_id,
                },
            ],
        ];

        const contract_performance_rows = [
            [
                {
                    id   : 'spot',
                    name : 'Spot',
                    value: props.transaction_id,
                },
                {
                    id   : 'spot_time',
                    name : 'Spot Time',
                    value: props.transaction_id,
                },
            ],
            [
                {
                    id   : 'indicative',
                    name : 'Indicative',
                    value: props.transaction_id,
                },
                {
                    id   : 'profit',
                    name : 'Profit/Loss',
                    value: props.transaction_id,
                },
            ],
            [
                {
                    id   : 'current_time',
                    name : 'Current Time',
                    value: props.transaction_id,
                },
            ],
        ];

        return (
            <div className='contract-details'>
                <fieldset>
                    <div className='table-container contract-details-table'>
                        <ContractTable
                            id='contract_details_table'
                            title='Contract Details'
                            rows={contract_details_rows}
                        />
                        <ContractTable
                            id='contract_performance_table'
                            title='Contract Performance'
                            rows={contract_performance_rows}
                        />
                        <table className='table custom-table'>
                            <thead className='table-thead'>
                                <tr>
                                    <th colSpan='3'>
                                        {localize('Contract Confirmed')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='table-tbody'>
                                <tr>
                                    <td colSpan='3'>
                                        {props.longcode}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan='3'>
                                        {localize('Your transaction reference is')}&nbsp;
                                        <span className='link '>{props.transaction_id}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>{localize('Potential Payout:')}</span>
                                        <span className='td-value'>$500.00</span>
                                    </td>
                                    <td>
                                        <span>{localize('Total Cost:')}</span>
                                        <span className='td-value'>$1000.00</span>
                                    </td>
                                    <td>
                                        <span>{localize('Potential Profit:')}</span>
                                        <span className='td-value'>$10.00</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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