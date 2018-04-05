import React from 'react';
import moment from 'moment';
import { Currency } from '../currency.jsx';
import { localize } from '../../../_common/localize';

class PortfolioDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.state = {
            is_open   : true,
            active_idx: null,
        };
    }

    handleVisibility() {
        this.setState({ is_open: !this.state.is_open });
    }

    renderIndicativePrice = (contract) => {
        const final_price       = contract.sell_price || contract.bid_price;
        const user_sold         = contract.sell_time && contract.sell_time < contract.date_expiry;
        const is_ended          = contract.is_settleable || contract.is_sold || user_sold;
        const indicative_price  = final_price && is_ended ? final_price : (contract.bid_price || null);

        return (
            <span className={indicative_price > 0 ? 'profit' : 'loss'}>
                <Currency currency={contract.currency} amount={indicative_price} />
            </span>
        );
    };

    renderRemainingTime = (contract) => {
        let time_left;

        const now = Math.max(Math.floor((this.props.server_time || 0) / 1000), contract.current_spot_time || 0);

        const is_started = !contract.is_forward_starting || contract.current_spot_time > contract.date_start;
        const is_ended   = contract.is_settleable || contract.is_sold;
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

        return (
            <span className='remaining-time'>{time_left}</span>
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
                                className={`portfolio ${this.state.active_idx === idx ? 'active' : ''}`}
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
