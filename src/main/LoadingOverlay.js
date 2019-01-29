import React from 'react';
import LO from 'react-loading-overlay';
import { connect } from 'react-redux';

class LoadingOverlay extends React.Component {
    render() {
        return (
            <LO
                active={this.props.overlayModal}
                spinner
                text={this.props.overlayModalText}
            >
                {this.props.children}
            </LO>
        )
    }
}

const mapStateToProps = (state) => ({
    overlayModal: state.AppReducer.overlayModal,
    overlayModalText: state.AppReducer.overlayModalText
});

export default connect(mapStateToProps, {})(LoadingOverlay);