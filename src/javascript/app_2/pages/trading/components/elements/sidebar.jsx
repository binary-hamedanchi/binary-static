import React from 'react';

class Sidebar extends React.PureComponent {
    constructor(props) {
        super(props);
        const defaultSelectedId = props.items ? (props.items[0].submenu ? props.items[0].submenu[0].id : props.items[0].id) : '';
        const defaultOpenTargetId = props.items ? props.items[0].id : '';

        this.state = {
            selectedId  : defaultSelectedId,
            openTargetId: defaultOpenTargetId,
        };
    }

    onClick = e => {
        if (/submenu-item/.test(e.target.className)) {
            this.setState({ selectedId: e.target.id });
        } else {
            this.setState({ selectedId: e.target.id, openTargetId: e.target.id });
        }
    }

    openSubmenu = e => {
        if (this.state.openTargetId !== e.target.id) {
            const firstListItem = this.props.items.filter(it => it.id === e.target.id);
            this.setState({ openTargetId: e.target.id, selectedId: firstListItem[0].submenu[0].id });
        }
    }

    render() {
        const { selectedId, openTargetId } = this.state;
        return (
            <div className='sidebar-wrapper' id={this.props.id}>
                <SidebarSubmenu
                    items={this.props.items}
                    onClick={this.onClick}
                    selectedId={selectedId}
                    openSubmenu={this.openSubmenu}
                    openTargetId={openTargetId}
                />
                <SidebarContent content={this.props.content} selectedId={selectedId} />
            </div>
        );
    }
};

class SidebarContent extends React.PureComponent {
    render() {
        return (
            <div className='sidebar-collapsible-content'>
                {this.props.content && this.props.content.map((item, idx) => (
                    <div key={idx} id={item.id} className={this.props.selectedId === item.id ? 'visible' : 'invisible'}>
                        {item.cont}
                    </div>
                ))}
            </div>
        );
    }
}

class SidebarSubmenu extends React.PureComponent {
    render() {
        const getHref = item_id => `#${item_id}`;
        const { openTargetId } = this.props;
        return (
            <div className='sidebar-submenu'>
                <ul>
                    {this.props.items && this.props.items.map((item, idx) => (
                        <li
                            key={idx}
                            className={(item.submenu ? 'has-submenu' : '') + (item.id === this.props.selectedId ? 'active' : '')}
                        >
                            { item.submenu &&
                            <React.Fragment>
                                <a
                                    id={item.id}
                                    className={openTargetId === item.id ? 'selected' : ''}
                                    href={getHref(item.id)}
                                    onClick={this.props.openSubmenu}
                                >
                                    {item.text}
                                </a>
                                <ul className={openTargetId === item.id ? 'collapsed' : 'compressed'}>
                                    { item.submenu.map((submenu, idx_submenu) => (
                                        <li
                                            key={idx_submenu}
                                            className={submenu.id === this.props.selectedId ? 'active' : ''}
                                        >
                                            <a
                                                id={submenu.id}
                                                onClick={this.props.onClick}
                                                className={`submenu-item ${submenu.id === this.props.selectedId ? 'selected' : ''}`}
                                                href={getHref(submenu.id)}
                                            >
                                                {submenu.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </React.Fragment>}
                            { !item.submenu && item.text &&
                                <a
                                    className={item.id === this.props.selectedId ? 'selected' : ''}
                                    id={item.id}
                                    onClick={this.props.onClick}
                                    href={getHref(item.id)}
                                >
                                    {item.text}
                                </a>
                            }
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

// Dummy values
// const dummyitems = [
//     {
//         id     : 'legal',
//         text   : 'Terms and Conditions',
//         submenu: [
//             { id: 'copyright', text: 'Copyright Section' },
//             { id: 'privacy',     text: 'Privacy Section' },
//         ],
//     },
//     { id: 'datafeed',  text: 'Data Feed Section' },
// ];

// const contents = [
//     {
//         id  : 'copyright',
//         cont: <div>copyright</div>
//     },
//     {
//         id  : 'privacy',
//         cont: <div>privacy</div>
//     },
//     {
//         id  : 'datafeed',
//         cont: <div>datafeed</div>,
//     }
// ];
//
// Sidebar.defaultProps = {
//     items  : dummyitems,
//     content: contents,
// }

export default Sidebar;