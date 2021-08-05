import axios from 'axios'
import React from 'react'

import { Container, Header, Icon, Message, Form, Input} from 'semantic-ui-react'
import { routeToDatasets } from './route/routeToDatasets'


export default class UpdateDatasetPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            datasetObject : {
                id: undefined,
                sparqlEndpoint: undefined,
                graph: undefined,
                indexed: undefined
            },
            error : {
                active: false,
                title: 'Please compile required fields',
                msg: 'To update a dataset you should compile every required field'
            },
            success : {
                active: false,
                title: 'Dataset succesfully updated',
                msg: 'Modify input to update current dataset'
            }

        }
    }

    componentDidMount() {
        const pathName = window.location.pathname
        const params = pathName.split('/')
        const datasetId = params[params.length - 1]
        console.log('Pathname:', pathName, datasetId)

        if (!this.state.datasetObject.id) {
            console.log('Getting data')
            fetch(`${process.env.ODP_REACTOR_SERVER_URL}/datasets/${datasetId}`) .then(response => { 
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                return response.json();
            }).then(data => {
                // `data` is the parsed version of the JSON returned from the above endpoint.
                console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
                if (data.query) {
                    this.setState({
                        datasetObject: data.dataset
                    })
                }
            }).catch(err => {
                console.log(err)
            });
        }
        
    }

    render() {

        if (this.state.success.active) {
            routeToDatasets()
        }

        console.log(this.state)
        return <div>
            <Container fluid className="ldr-padding-more">
                <Header as="h2"><Icon name="cubes" color="blue"/>Update dataset</Header>
                <Form error={this.state.error.active} success={this.state.success.active} size="big">
                    <Form.Field 
                        error={isFieldError(this.state.datasetObject.sparqlEndpoint)} required onChange={(e) => {
                            this.setState({
                                datasetObject: {
                                    id: this.state.datasetObject.id,
                                    sparqlEndpoint: e.target.value,
                                    graph: this.state.datasetObject.graph,
                                    indexed: this.state.datasetObject.indexed
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
                            Sparql Endpoint
                        </label>
                        <Input value={this.state.datasetObject.sparqlEndpoint} placeholder="Sparql Endpoint"></Input>
                    </Form.Field>
                    <Form.Field                     
                        onChange={(e) => {
                            this.setState({
                                datasetObject: {
                                    id: this.state.datasetObject.id,
                                    sparqlEndpoint: this.state.datasetObject.sparqlEndpoint,
                                    graph: e.target.value,
                                    indexed: this.state.datasetObject.indexed
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
                        <Input value={this.state.datasetObject.graph} placeholder="Sparql endpoint graph to be explored"></Input>
                    </Form.Field>
                    <Form.Button color="blue" size="big" onClick={()=>{
                        this.sendDatasetData()
                    }}>Update Dataset</Form.Button>
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
        if (isNotValidField(d.sparqlEndpoint) || isNotValidField(d.id)) {
            this.setState({
                error: {
                    active: true,
                    title: 'Please compile required fields',
                    msg: 'To update a dataset you should compile every required field'
                }
            })
            return
        }
        axios.put(`${process.env.ODP_REACTOR_SERVER_URL}/datasets`, {
            dataset: d
        }).then(res => {
            if (res.data.status === 'OK') {
                this.setState({
                    success : {
                        active: true,
                        title: 'Dataset succesfully update',
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
                    title: 'Error while updating dataset',
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

