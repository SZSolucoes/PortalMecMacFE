import React, { Component } from 'react';
import Main from '../templates/Main';
import { connect } from 'react-redux';

import { 
    modifyFlag,
    modifyTimeToRefresh 
} from './ParametrosActions';

class Parametros extends Component {

    constructor(props) {
        super(props);

        this.onUpdateField = this.onUpdateField.bind(this);
    }

    onUpdateField(event) {
        let params = {}
        switch(event.target.name) {
            case 'stsgreen':
                params = { flaggreen: event.target.value.replace(/[^0-9]/g, '') };
                this.props.modifyFlag(params, 'flaggreen');
                break;
            case 'stsred':
                params = { flagred: event.target.value.replace(/[^0-9]/g, '') };
                this.props.modifyFlag(params, 'flagred');
                break;
            case 'timetorefresh':
                this.props.modifyTimeToRefresh(event.target.value.replace(/[^0-9]/g, ''));
                break;
            default:
        }
    }

    render() {
        return (
            <Main>
                <h2 className="mt-3">
                    <i className='fa fa-cogs'></i> Parâmetros
                </h2>
                <hr />
                <p>Em desenvolvimento...</p>
            </Main>
        );
    }
}

const mapStateToProps = (state) => ({
    flagGreen: state.ParametrosReducer.flagGreen,
    flagRed: state.ParametrosReducer.flagRed,
    timeToRefresh: state.ParametrosReducer.timeToRefresh
});

export default connect(mapStateToProps, { 
    modifyFlag,
    modifyTimeToRefresh 
})(Parametros);

