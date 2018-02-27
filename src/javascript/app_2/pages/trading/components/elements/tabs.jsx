import React from 'react';

class Tabs extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { active_tab_index: '1' };
    }
    setActiveTab(active) {
        this.setState({active_tab_index: active});
    };
    render() {
        const className = 'tab-container';
        return (
            <div className={`${className} ${this.props.alignment}`}>
                <TabsWrapper
                  active={this.state.active_tab_index}
                  onChange={active => this.setActiveTab(active)}
                >
                {Object.keys(this.props.list).map(key => (
                    <React.Fragment key={key}>
                        {!!this.props.list[key].icon &&
                            <i className={this.props.list[key].icon}></i>
                        }
                        <span>{this.props.list[key].header}</span>
                    </React.Fragment>
                ))}
                </TabsWrapper>
                <p className='tab-content'>{this.props.list[this.state.active_tab_index].content}</p>
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
    }

    componentDidUpdate(prevProps) {
        // component re-renders twice, pending better workaround
        if (prevProps.children !== this.props.children && prevProps.active !== this.props.active) {
            this.getSizes();
        }
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
                const className = 'tab';
                return (
                    <div
                      key={i}
                      className={child.key === this.props.active ? `${className} tab--active` : className}
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

// Dummy values
const content = {
    1: { header: 'Tab 1', content: 'Content 1' },
    2: { header: 'Tab 2', content: 'Content 2' },
    3: { header: 'Tab 3', content: 'Content 3' },
    4: { header: 'Tab 4', content: 'Content 4' },
};

Tabs.defaultProps = {
    alignment: 'left',
    list     : content,
};

export default Tabs;
