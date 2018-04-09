import React from 'react';
import { Currency } from '../currency.jsx';
import { Time } from '../time.jsx';
import { localize } from '../../../_common/localize';

class PortfolioDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.state = {
            is_open   : this.props.is_open,
            active_idx: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        const is_open = nextProps.is_open;
        this.setState({ is_open });

        if (!is_open) {
            this.setState({ active_idx: null });
        }
    }

    handleVisibility() {
        this.setState({ is_open: !this.state.is_open });
    }

    renderIndicativePrice = ({ currency, sell_price, bid_price, sell_time, date_expiry, is_settleable, is_sold }) => {
        const final_price = sell_price || bid_price;
        const user_sold   = sell_time && sell_time < date_expiry;
        const is_ended    = is_settleable || is_sold || user_sold;

        const indicative_price = final_price && is_ended ? final_price : (bid_price || null);

        return (<Currency currency={currency} amount={indicative_price} show_indicative />);
    };

    renderRemainingTime = (contract) => {
        const { is_forward_starting, is_settleable, date_start, is_sold, current_spot_time, date_expiry } = contract;

        const is_started = !is_forward_starting || current_spot_time > date_start;
        const is_ended   = is_settleable || is_sold;

        const timer_options = {
            t_start  : current_spot_time,
            t_end    : date_expiry,
            t_stopped: (!is_started || is_ended),
        };

        return (
            <span className='remaining-time'>
                <Time timer={timer_options} />
            </span>
        );
    };

    onClick = (contract, idx) => {
        if (this.state.active_idx !== idx) {
            this.setState({ active_idx: idx });
        } else {
            this.setState({ active_idx: null });
        }
        this.props.onSelect(contract);
    };

    render() {
        return (
            <div className='portfolio-drawer'>
                <div className='portfolio-drawer-header'>
                    <span className='ic-portfolio' />
                    <p>{localize('Portfolio Quick Menu')}</p>
                    <a
                        href='javascript:;'
                        className='ic-close'
                        onClick={this.props.onClick}
                    />
                </div>
                <div className={`portfolio-list ${this.state.is_open ? 'show': '' }`}>
                    {
                        this.props.portfolio.map((contract, idx) => (
                            <div
                                key={idx}
                                className={`portfolio ${(this.state.active_idx === idx) ? 'active' : ''}`}
                                onClick={this.onClick.bind(this, contract, idx)}
                            >
                                <span className='ic-portfolio' />
                                <div className='asset'>
                                    <span className='symbol'>{contract.symbol}</span>
                                    { this.renderIndicativePrice(contract) }
                                    { this.renderRemainingTime(contract) }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

module.exports = PortfolioDrawer;
