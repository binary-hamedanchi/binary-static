import React from 'react';
import classNames from 'classnames';
import Url from '../../../../../_common/url';
import Button from '../form/button.jsx';

class PopUp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { isOpen: this.props.autostart };
    }
    toggleModal = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.props.autostart ? null
                :
                <React.Fragment>
                    {this.props.is_btn ?
                        <Button
                            text={this.props.text}
                            onClick={this.toggleModal}
                            has_effect
                        />
                    :
                        <a
                            className={this.props.className}
                            href='javascript:;'
                            onClick={this.toggleModal}
                        >
                            {this.props.text}
                        </a>
                    }
                </React.Fragment>
                }
                <Modal
                    show={this.state.isOpen}
                    onClose={this.toggleModal}
                    action_one={this.props.action_one}
                    action_one_text={this.props.action_one_text}
                    action_two={this.props.action_two}
                    action_two_text={this.props.action_two_text}
                >
                    {this.props.children}
                </Modal>
            </React.Fragment>
        );
    }
}

class Modal extends React.PureComponent {
    render() {
        const visibility = {
            visibility: this.props.show ? 'visible' : 'hidden',
        };
        const popup_backdrop_class = classNames('popup-backdrop', {
            show: this.props.show,
        });
        const popup_class = classNames('popup', {
            show: this.props.show,
        },  this.props.className );
        return (
            <div
                className={popup_backdrop_class}
                style={visibility}
            >
                <div
                    className={popup_class}
                    style={visibility}
                >
                    <div className='popup-close' onClick={this.props.onClose}>
                        <img src={Url.urlForStatic('images/trading_app/close.svg')} alt='Close' />
                    </div>
                    {!!this.props.title &&
                        <div className='popup-title'>{this.props.title}</div>
                    }
                    <div className='popup-content'>
                        {this.props.children}
                    </div>
                    <div className='popup-footer'>
                        <Button
                            className='flat'
                            text={this.props.action_one_text}
                            onClick={this.props.action_one}
                            has_effect
                        />
                        <Button
                            className='flat'
                            text={this.props.action_two_text}
                            onClick={this.props.action_two}
                            has_effect
                        />
                    </div>
                </div>
            </div>
        );
    }
}

// TODO: Remove defaultProps dummy values
Modal.defaultProps = {
    title: 'Title Goes Here',
};

PopUp.defaultProps = {
    is_btn         : false,
    text           : 'Modal Button',
    autostart      : false,
    action_one_text: 'Action 1',
    action_two_text: 'Action 2',
};

export default PopUp;
