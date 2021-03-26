import React, { Component } from 'react';

export default class ErrorTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crash: false
        };
    }
    render() {
        if (this.state.crash) {
            throw new Error('I crashed');
        }
        return (
            <div>
                Error test component. Click the button to raise an error
                <div
                    onClick={() => {
                        this.setState({ crash: true });
                    }}
                    style={{
                        backgroundColor: 'red',
                        width: 'fit-content',
                        cursor: 'pointer'
                    }}
                >
                    Explode
                </div>
            </div>
        );
    }
}
