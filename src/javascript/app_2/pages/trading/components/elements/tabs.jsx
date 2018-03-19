import React from 'react';
import classNames from 'classnames';

class Tabs extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { active_tab_index: '1' };
    }
    setActiveTab(index) {
        this.setState({active_tab_index: index});
    };
    render() {
        const TabContents = this.props.list[this.state.active_tab_index].content;
        const tab_container_class = classNames('tab-container', this.props.alignment);
        const tab_header_class = (icon_name) => classNames({
            icon: icon_name },
            icon_name,
        );
        return (
            <div className={tab_container_class}>
                <TabsWrapper
                    active={this.state.active_tab_index}
                    onChange={active => this.setActiveTab(active)}
                >
                    {Object.keys(this.props.list).map(key => (
                        <React.Fragment key={key}>
                            <span
                                className={tab_header_class(this.props.list[key].icon)}
                                title={this.props.list[key].header}
                            >
                                {this.props.list[key].header}
                            </span>
                        </React.Fragment>
                    ))}
                </TabsWrapper>
                <TabContents />
            </div>
        );
    }
};

class TabsWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sizes: {},
        };
        this.els = {};
    }

    componentDidMount() {
        this.getSizes();
        window.addEventListener('resize', this.getSizes.bind(this));
    }

    componentDidUpdate(prevProps) {
        // component re-renders twice, pending better workaround
        if (prevProps.children !== this.props.children && prevProps.active !== this.props.active) {
            this.getSizes();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.getSizes.bind(this));
    }

    getSizes() {
        const rootBounds = this.root.getBoundingClientRect();

        const sizes = {};

        Object.keys(this.els).forEach((key) => {
            const el = this.els[key];
            const bounds = el.getBoundingClientRect();

            const left = bounds.left - rootBounds.left;
            const right = rootBounds.right - bounds.right;

            sizes[key] = {left, right};
        });

        this.setState({sizes});
        return sizes;
    }

    render() {
        return (
            <div
                className='tab-wrapper'
                ref={el => this.root = el}
            >
                {React.Children.map(this.props.children, (child, i) => {
                    const tab_class = classNames(
                        'tab',
                        { 'tab--active': child.key === this.props.active },
                    );
                    return (
                        <div
                            key={i}
                            className={tab_class}
                            onClick={() => {
                                this.props.onChange(child.key);
                            }}
                            ref={el => this.els[child.key] = el}
                        >
                            {child}
                        </div>
                    );
                })}
                <div
                    className='tab-underline'
                    style={this.getUnderlineStyle()}
                />
            </div>
        );
    }

    getUnderlineStyle() {
        if (this.props.active == null || Object.keys(this.state.sizes).length === 0) {
            return {left: '0', right: '100%'};
        }

        const size = this.state.sizes[this.props.active];

        return {
            left      : `${size.left}px`,
            right     : `${size.right}px`,
            transition: 'left 0.2s, right 0.25s',
        };
    }
}

// TO-DO: Remove dummy values
const TabContent1 = () => (
    <div className='tab-content'><p>Content 1</p></div>
);
const TabContent2 = () => (
    <div className='tab-content'><p>Content 2</p></div>
);
const TabContent3 = () => (
    <div className='tab-content'><p>Content 3</p></div>
);
const TabContent4 = () => (
    <div className='tab-content'><p>Content 4</p></div>
);

const content = {
    1: { header: 'Tab 1', content: TabContent1 },
    2: { header: 'Tab 2', content: TabContent2 },
    3: { header: 'Tab 3', content: TabContent3 },
    4: { header: 'Tab 4', content: TabContent4 },
};

Tabs.defaultProps = {
    alignment: 'left',
    list     : content,
};

export default Tabs;
