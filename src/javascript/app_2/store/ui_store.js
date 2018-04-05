import { observable, action } from 'mobx';

export default class UIStore {
    @observable is_portfolio_drawer_on = false;
    @observable is_portfolio_selected  = false;
    @observable selected_portfolio = {};

    @action.bound togglePortfolioDrawer() { // toggle show and hide Portfolio Drawer
        this.is_portfolio_drawer_on = !this.is_portfolio_drawer_on;
    };

    @action.bound toggleActivePortfolio(toggleDrawer) {
        this.is_portfolio_selected = !this.is_portfolio_selected;
        if (toggleDrawer) {
            this.is_portfolio_drawer_on = false;
        }
    };

    @action.bound setActivePortfolio(item) {
        if (item !== this.selected_portfolio) {
            this.selected_portfolio = item;
            this.is_portfolio_selected = true;
        } else {
            this.is_portfolio_selected = !this.is_portfolio_selected;
        }
    };
};
