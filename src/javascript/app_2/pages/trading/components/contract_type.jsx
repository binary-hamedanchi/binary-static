import React from 'react';
import { connect } from '../store/connect';
import Tabs from '../components/elements/tabs.jsx';

const Contracts = ({ list }) => (
    Object.keys(list).map((category, idx) => (
        <React.Fragment key={idx}>
            <optgroup key={idx} label={category} />
            {list[category].map(type => (
                <option key={type.name} value={type.name}>{type.title}</option>
            ))}
        </React.Fragment>
    ))
);

const Contract = ({
    contract_type,
    contract_types_list,
    onChange,
}) => (
    <React.Fragment>
    <fieldset>
        <select name='contract_type' value={contract_type} onChange={onChange}>
            <Contracts list={contract_types_list} />
        </select>
    </fieldset>
    <Tabs />
    </React.Fragment>
);

export default connect(
    ({trade}) => ({
        contract_type      : trade.contract_type,
        contract_types_list: trade.contract_types_list,
        onChange           : trade.handleChange,
    })
)(Contract);
