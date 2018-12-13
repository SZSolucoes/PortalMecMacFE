import './Main.css';
import React, { Fragment } from 'react';

export default props => (
    <Fragment>
        <main className="content container-fluid">
            <div className="p-3 mt-3">
                {props.children}
            </div>
        </main>
    </Fragment>
);

