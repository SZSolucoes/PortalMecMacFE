import React from 'react';

export default class RadioGroupInline extends React.Component {
    render() {
        const { input, meta, options } = this.props
        const hasError = meta.touched && meta.error;

        return (
            <div className='form-control'>
                <div className='row pt-3'>
                    {options.map(
                        o =>
                        <div key={o.value} className='col-6'>
                            <label key={o.value}>
                                <input type='radio' {...input} value={o.value} checked={o.value === input.value} />
                                {` ${o.title}`}
                            </label>
                        </div>
                    )}
                    {hasError && <span className='error'>{meta.error}</span>}
                </div>
            </div>
        );
    }
}