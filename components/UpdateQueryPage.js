import axios from 'axios'
import React from 'react'

import { Container, Header, Icon, Message, Form, Input} from 'semantic-ui-react'
import { routeToQueries } from './route/routeToQueries'


export default class AddQueryPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            queryObject : {
                string: undefined,
                patternUri: undefined,
                patternLabel: undefined,
                id: undefined
            },
            error : {
                active: false,
                title: 'Please compile required fields',
                msg: 'To add a query you should compile every required field'
            },
            success : {
                active: false,
                title: 'Query succesfully created',
                msg: 'Modify input to create a new query'
            }

        }
    }

    componentDidMount() {
        const pathName = window.location.pathname
        const queryId = pathName.split('/')[2]
        console.log('Pathname:', pathName, queryId)

        if (!this.state.queryObject.id) {
            console.log('Getting data')
            fetch(`${process.env.ODP_REACTOR_SERVER_URL}/queries/${queryId}`) .then(response => { 
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                return response.json();
            }).then(data => {
                // `data` is the parsed version of the JSON returned from the above endpoint.
                console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
                if (data.query) {
                    this.setState({
                        queryObject: data.query
                    })
                }
            }).catch(err => {
                console.log(err)
            });
        }
        
    }

    render() {

        if (this.state.success.active) {
            routeToQueries()
        }

        console.log(this.state)
        return <div>
            <Container fluid className="ldr-padding-more">
                <Header as="h2"><Icon name="database" color="violet"/>Update query</Header>
                <Form error={this.state.error.active} success={this.state.success.active} size="big">
                    <Form.Field 
                        error={isFieldError(this.state.queryObject.patternLabel)} required onChange={(e) => {
                            this.setState({
                                queryObject: {
                                    string: this.state.queryObject.string,
                                    patternUri: this.state.queryObject.patternUri,
                                    patternLabel: e.target.value,
                                    id: this.state.queryObject.id
                                },
                                error : {
                                    active: false
                                },
                                success: {
                                    active : false
                                }
                            })
                        }}>
                        <label>
                            Pattern Label
                        </label>
                        <Input value={this.state.queryObject.patternLabel} placeholder="Label of the collection indexed by the query (e.g. Measurements)"></Input>
                    </Form.Field>
                    <Form.Field 
                    
                        error={isFieldError(this.state.queryObject.patternUri)} required onChange={(e) => {
                            this.setState({
                                queryObject: {
                                    string: this.state.queryObject.string,
                                    patternUri: e.target.value,
                                    patternLabel: this.state.queryObject.patternLabel,
                                    id: this.state.queryObject.id
                                },
                                error : {
                                    active: false
                                },
                                success: {
                                    active : false
                                }
                            })
                        }}>
                        <label>
                            Pattern URI
                        </label>
                        <Input value={this.state.queryObject.patternUri} placeholder="Identifier of the collection indexed by the query (e.g. https://ontologydesignpatterns.org/measurement-collection)"></Input>
                    </Form.Field>
                    <Form.TextArea 
                        value={this.state.queryObject.string}
                        error={isFieldError(this.state.queryObject.string)} required label='Query' placeholder='SELECT * WHERE { ?s ?p ?o .}' style={{ minHeight: 200}} 
                        onChange={(e) => {
                            this.setState({
                                queryObject: {
                                    string: e.target.value,
                                    patternUri: this.state.queryObject.patternUri,
                                    patternLabel: this.state.queryObject.patternLabel,
                                    id: this.state.queryObject.id
                                },
                                error : {
                                    active: false
                                },
                                success: {
                                    active : false
                                }    
                            })
                        }}/>
                    <Form.Button color="violet" size="big" onClick={()=>{
                        this.sendQueryData()
                    }}>Update Query</Form.Button>
                    <Message error
                        header={this.state.error.title}
                        content={this.state.error.msg}
                    />
                    <Message success
                        header={this.state.success.title}
                        content={this.state.success.msg}
                    />
                </Form>
            </Container>
        </div>
    }
    sendQueryData ()  {
        const q = this.state.queryObject
        if (isNotValidField(q.patternLabel) || isNotValidField(q.patternUri) || isNotValidField(q.string) || isNotValidField(q.id)) {
            this.setState({
                error: {
                    active: true,
                    title: 'Please compile required fields',
                    msg: 'To add a query you should compile every required field'
                }
            })
            return
        }
        axios.put(`${process.env.ODP_REACTOR_SERVER_URL}/queries`, {
            query: q
        }).then(res => {
            if (res.data.status === 'OK') {
                this.setState({
                    success : {
                        active: true,
                        title: 'Query succesfully update',
                        msg: 'Modify input to update again'        
                    }
                })
            } else {
                this.setState({
                    error: {
                        active: true,
                        title: 'Server error',
                        msg: res.data.msg
                    }
                })    
            }
        }).catch(err => {
            console.log(err)
            this.setState({
                error: {
                    active: true,
                    title: 'Error while updating query',
                    msg: err.message
                }
            })
        })
    }
}

const isFieldError = (input) => {
    return input === '' ? true : false
}

const isNotValidField = (input) => {
    return input === undefined || input === '' ? true : false
} 

