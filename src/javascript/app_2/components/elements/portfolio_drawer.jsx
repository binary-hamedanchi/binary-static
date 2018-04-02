import React from 'react';
import moment from 'moment';
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

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleVisibility() {
        this.setState({ is_open: !this.state.is_open });
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    // TODO: returning correct indicative price & currency
    getIndicative = (v) => {
        const sign = v > 0 ? '+' : '-';
        return {
            value  : v,
            display: `${sign}$S${Math.abs(v)}`,
        };
    };

    // TODO: calculate remaining time and render
    getRemainingTime = (epoch) => {
        const time_left = parseInt(moment.unix(epoch) - this.props.server_time.unix());
        return time_left;
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
                                    <span className={`indicative-${this.getIndicative(contract.buy_price).value > 0 ? 'positive' : 'negative'}`}>
                                        {this.getIndicative(contract.buy_price).display}
                                    </span>
                                    <span className='remaining-time'>{moment(this.getRemainingTime(contract.expiry_time)).format('HH:mm:ss')}</span>
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
