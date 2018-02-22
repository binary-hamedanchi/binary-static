import React from 'react';

class PopUp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
    }
    toggleModal = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    render() {
        return (
            <React.Fragment>
                {(!!this.props.trigger_type === 'button') &&
                    <button onClick={this.toggleModal}>{this.props.text}</button>
                }
                {this.props.trigger_type &&
                    <a href='javascript:;' onClick={this.toggleModal}>{this.props.text}</a>
                }
                <Modal
                  show={this.state.isOpen}
                  onClose={this.toggleModal}>
                  {this.props.children}
                </Modal>
            </React.Fragment>
        );
    }
}

class Modal extends React.PureComponent {
    render() {
        // Render nothing if the 'show' prop is false
        if (!this.props.show) {
            return null;
        }
        return (
          <div className={`popup-backdrop ${this.props.show ? 'show' : '' }`}>
              <div className={`popup ${this.props.show ? 'show' : '' }`}>
                  {!!this.props.title &&
                      <div className='popup-title'>{this.props.title}</div>
                  }
                  <div className='popup-content'>
                      {this.props.children}
                  </div>
                  <div className='popup-footer'>
                      <button onClick={this.props.onClose}>
                          <span>Close</span>
                      </button>
                      {!!this.props.action_one &&
                          <button onClick={this.props.action_one}>
                              {this.props.action_one_text}
                          </button>
                      }
                      {!!this.props.action_one &&
                          <button onClick={this.props.action_two}>
                              {this.props.action_two_text}
                          </button>
                      }
                  </div>
              </div>
          </div>
        );
    }
}

Modal.defaultProps = {
    title: 'Title Goes Here',
};

PopUp.defaultProps = {
    trigger_type: 'link',
    text        : 'Modal Button',
};

export default PopUp;
