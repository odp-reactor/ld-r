import React from 'react';

import { Icon } from 'semantic-ui-react';

export default class GoToButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                className="go-to-button"
                style={{
                    padding: 20,
                    color: 'white',
                    borderRadius: 5,
                    cursor: 'pointer',
                    background: '#6c7ae0',
                    width: 'fit-content'
                }}
                onClick={() => window.history.back()}
            >
                <Icon name="home" /> Back
            </div>
        );
    }
}
