import React from 'react';

export default class RadioGroup extends React.Component {
    render() {
        const { input, meta, options } = this.props
        const hasError = meta.touched && meta.error;

        return (
            <div>
                {options.map(
                    o =>
                    <div key={o.value}>
                        <label key={o.value}>
                            <input type='radio' {...input} value={o.value} checked={o.value === input.value} />
                            {` ${o.title}`}
                        </label>
                    </div>
                )}
                {hasError && <span className='error'>{meta.error}</span>}
            </div>
        );
    }
}