import React from 'react';
import Timer from './Timer';

const PUBLIC_URL = process.env.PUBLIC_URL || '';
console.log('Does webpack inject this ?');
console.log(PUBLIC_URL);

class WaitAMoment extends React.Component {
    render() {
        let msg = 'Wait a moment until the new environment is generated...';
        if (this.props.msg) {
            msg = this.props.msg;
        }
        return (
            <div className="ui segment">
                <div className="ui right corner mini label">
                    <Timer />
                </div>
                <h2>
                    {' '}
                    <img
                        src={`${PUBLIC_URL}/assets/img/loader.gif`}
                        alt="loading..."
                        style={{ height: 30, width: 30 }}
                    />{' '}
                    {msg}
                </h2>
            </div>
        );
    }
}

export default WaitAMoment;
