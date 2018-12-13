import React from 'react'
import { connect } from 'react-redux';

import ComplementosTabs from './ComplementosTabs';

class Complementos extends React.Component {
    render() {
        return (
            <ComplementosTabs />
        );
    }
}

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, {
})(Complementos);

