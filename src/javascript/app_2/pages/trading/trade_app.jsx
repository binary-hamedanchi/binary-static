import React from 'react';
import Amount from './components/amount.jsx';
import Barrier from './components/barrier.jsx';
import ContractType from './components/contract_type.jsx';
import Duration from './components/duration.jsx';
import LastDigit from './components/last_digit.jsx';
import StartDate from './components/start_date.jsx';
import Symbol from './components/symbol.jsx';
import Test from './components/test.jsx';
import Purchase from './components/purchase.jsx';
import { connect } from './store/connect';
import PortfolioDrawer from './components/elements/portfolio_drawer.jsx';
import ContractDetails from './components/contract_details.jsx';

class TradeApp extends React.Component {
    isVisible(component_name) {
        return this.props.form_components.indexOf(component_name) >= 0;
    }

    render() {
        return (
            <div id='trade_container' className={this.props.is_portfolio_drawer_on ? 'show' : undefined}>
                <div className='chart-container notice-msg'>
                    <Symbol />
                    <ContractType />
                    <Test />
                </div>
                <div className='sidebar-container desktop-only'>
                    <div className={`${this.props.is_portfolio_selected ? 'fade-out' : 'fade-in'}`}>
                        {this.isVisible('start_date') && <StartDate />}
                        <Duration />
                        {this.isVisible('barrier') && <Barrier />}
                        {this.isVisible('last_digit') && <LastDigit />}
                        <Amount />
                        <Purchase />
                    </div>
                    <div className={`${this.props.is_portfolio_selected ? 'fade-in' : 'fade-out'}`}>
                        <ContractDetails
                            portfolio={this.props.selected_portfolio}
                            onClick={this.props.toggleActivePortfolio}
                        />
                    </div>
                </div>

                <div className='offset-container'>
                    <PortfolioDrawer
                        onClick={this.props.togglePortfolioDrawer}
                        portfolios={this.props.portfolios}
                        onSelect={this.props.setActivePortfolio}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    ({ trade, ui }) => ({
        form_components       : trade.form_components,
        portfolios            : trade.portfolios,
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
        togglePortfolioDrawer : ui.togglePortfolioDrawer,
        selected_portfolio    : ui.selected_portfolio,
        setActivePortfolio    : ui.setActivePortfolio,
        is_portfolio_selected : ui.is_portfolio_selected,
        toggleActivePortfolio : ui.toggleActivePortfolio,
    })
)(TradeApp);
