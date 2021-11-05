import axios from 'axios'
import React from 'react'

import { Container, Header, Icon, Message, Form, Input} from 'semantic-ui-react'
import { routeToDatasets } from './route/routeToDatasets'


export default class AddDatasetPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            datasetObject : {
                sparqlEndpoint: undefined,
                graph: undefined,
                label: undefined
            },
            error : {
                active: false,
                title: 'Please compile required fields',
                msg: 'To connect a dataset you should compile every required field'
            },
            success : {
                active: false,
                title: 'Dataset succesfully connected',
                msg: 'Modify input to connect a new sparql endpoint'
            }

        }
    }

    render() {

        if (this.state.success.active) {
            routeToDatasets()
        }

        console.log(this.state)
        return <div>
            <Container fluid className="ldr-padding-more">
                <Header as="h2"><Icon name="cubes" color="blue"/>Add a new dataset</Header>
                <Form error={this.state.error.active} success={this.state.success.active} size="big">
                    <Form.Field error={isFieldError(this.state.datasetObject.sparqlEndpoint)} required onChange={(e) => {
                        this.setState({
                            datasetObject: {
                                sparqlEndpoint: e.target.value,
                                graph: this.state.datasetObject.graph,
                                label: this.state.datasetObject.label
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
                            Sparql endpoint
                        </label>
                        <Input placeholder="Label of the sparql endpoint to connect (e.g. https://dbpedia.org/sparql)"></Input>
                    </Form.Field>
                    <Form.Field error={isFieldError(this.state.datasetObject.label)} required onChange={(e) => {
                        this.setState({
                            datasetObject: {
                                sparqlEndpoint: this.state.datasetObject.sparqlEndpoint,
                                graph: this.state.datasetObject.graph,
                                label: e.target.value
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
                            Dataset Label
                        </label>
                        <Input placeholder="Dataset Label (e.g. DBPedia)"></Input>
                    </Form.Field>
                    <Form.Field onChange={(e) => {
                        this.setState({
                            datasetObject: {
                                sparqlEndpoint: this.state.datasetObject.sparqlEndpoint,
                                graph: e.target.value,
                                label: this.state.datasetObject.label

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
                            Graph
                        </label>
                        <Input placeholder="Knowledge graph to explore"></Input>
                    </Form.Field>
                    <Form.Button color="blue" size="big" onClick={()=>{
                        this.sendDatasetData()
                    }}>Connect dataset</Form.Button>
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
    sendDatasetData ()  {
        const d = this.state.datasetObject
        if (isNotValidField(d.sparqlEndpoint) || isNotValidField(d.label)) {
            this.setState({
                error: {
                    active: true,
                    title: 'Please compile required fields',
                    msg: 'To compile a dataset you should compile every required field'
                }
            })
            return
        }
        axios.post(`${process.env.ODP_REACTOR_SERVER_URL}/datasets`, {
            dataset: d
        }).then(res => {
            if (res.data.status === 'OK') {
                this.setState({
                    success : {
                        active: true,
                        title: 'Dataset succesfully connected',
                        msg: 'Modify input to create a new dataset'        
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
                    title: 'Error while connecting sparql endpoint',
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

