import React, { Component } from 'react';

import Nav from './Nav';
import HelpModal from './HelpModal';
import { Segment, Icon } from 'semantic-ui-react';

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

export default class ErrorHandler extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        //   logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <Nav />
                    <HelpModal />
                    <Segment placeholder textAlign="center">
                        <div>
                            <div>
                                <Icon size="huge" name="warning" />
                            </div>
                            <h1>An error occured</h1>
                            <div>
                                <a href={`${PUBLIC_URL}/`}>Go back</a>
                            </div>
                        </div>
                    </Segment>
                </div>
            );
        }
        return this.props.children;
    }
}
