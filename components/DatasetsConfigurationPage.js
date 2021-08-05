import axios from 'axios';
import React from 'react';

import { Container, List, Header, Segment, Label, Icon, Button, Message} from 'semantic-ui-react'
import { routeToAddDataset } from './route/routeToAddDataset';


const ODP_REACTOR_SERVER_URL = process.env.ODP_REACTOR_SERVER_URL ? process.env.ODP_REACTOR_SERVER_URL : '';

const DatasetPageStatus = {
    DELETE_ERROR : 'Error deleting dataset',
    DELETE_SUCCESS : 'Ok',
    OK : 'OK'
}

export default class DatasetsConfigurationPage extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            datasets: null,
            error: {
                title: undefined,
                datasetId: undefined,
                msg: undefined,
                active: false
            },
            success : {
                title: undefined,
                msg: undefined,
                active: false
            }
        }
    }

    componentDidMount() {
        if (!this.state.datasets) {
            fetch(`${process.env.ODP_REACTOR_SERVER_URL}/datasets`) .then(response => { 
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                return response.json();
            }).then(data => {

                // `data` is the parsed version of the JSON returned from the above endpoint.
                console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
                if (data.datasets) {
                    this.setState({
                        datasets: data.datasets
                    })
                }
            }).catch(err => {
                console.log(err)
            });
        }
    }


    render() {

        console.log(this.state)


        return <div>
            <Container fluid className="ldr-padding-more">
                <Segment>
                    <Header as="h2">
                        <Label circular inverted size="big" color="black">{this.state.datasets && this.state.datasets.length ? this.state.datasets.length : 0}</Label>
                        <Header.Content>
                            Datasets
                        </Header.Content>
                    </Header>
                    {this.state.datasets && <List divided relaxed verticalAlign='middle' size="big">
                        {this.state.datasets.map((dataset) => {
                            return <List.Item horizontal>
                                <List.Content floated="right">
                                    <Button color="red" onClick={()=>{
                                        this.deleteDataset(dataset.id)
                                    }}>Delete</Button>
                                </List.Content>
                                <List.Content floated="right">
                                    <Button color="olive" onClick={()=>{
                                        routeToUpdateDataset(dataset.id)
                                    }}>Update</Button>
                                </List.Content>                                      
                                <Icon name="cube" color="green" />
                                <List.Content>
                                    <List.Header>{dataset.label}</List.Header>
                                    <List.Description>{dataset.sparqlEndpoint}</List.Description>
                                    <List.Description>{dataset.graph}</List.Description>
                                </List.Content>
                            </List.Item>
                        })}
                    </List>}
                    {this.state.datasets && this.state.datasets.length < 1 &&
                        <Message color="blue">
                            There are no datasets yet. Let's connect to a sparql endpoint.
                        </Message>
                    }
                </Segment>
                <div>
                    <List horizontal divided size="big">
                        <List.Item>
                            <Button color="" onClick={()=>{
                                routeToAddDataset()
                            }}>
                                <Icon name="cubes" color="blue"/>
                                <Icon name="add" color="black"/>
                                    Add Dataset
                            </Button>
                        </List.Item>
                    </List>
                </div>
                <div>
                    {this.state.error.active && this.delayedCancelErrorMessage() &&
                  <Message error
                      header={this.state.error.title}
                      content={this.state.error.msg}
                      size="small"
                      className={this.state.error.active ? 'fadeIn' : 'fadeOut'}
                  />}
                    {this.state.success.active && this.delayedCancelSuccessMessage() &&
                  <Message success
                      header={this.state.success.title}
                      content={this.state.success.msg}          
                      size="large"
                      className={this.state.success.active ? 'fadeIn' : 'fadeOut'}
                  />}
                </div>
            </Container>
        </div>
    }
    deleteDataset(datasetId) {
        axios.delete(`${process.env.ODP_REACTOR_SERVER_URL}/datasets/${datasetId}`).then(res => {
            if (res.data.status === DatasetPageStatus.OK && Array.isArray(res.data.datasets)) {
                this.setState({
                    datasets: res.data.datasets,
                    success: {
                        title: DatasetPageStatus.DELETE_SUCCESS,
                        datasetId: undefined,
                        msg: 'Dataset succesfully delete',
                        active: true
                    }
                })
            } else {
                this.setState({
                    error: {
                        title: DatasetPageStatus.DELETE_ERROR,
                        datasetId: datasetId,
                        msg: res.data.msg,
                        active: true
                    }
                })
            }
        }).catch(err => {
            console.log(err)
            this.setState({
                error: {
                    title: DatasetPageStatus.DELETE_ERROR,
                    datasetId: datasetId,
                    msg: err.message,
                    active: true
                }                
            })
        })
    }
    delayedCancelErrorMessage(time=2000) {
        setTimeout(() => {
            this.setState({
                error: {
                    title: undefined,
                    datasetId: undefined,
                    msg: undefined,
                    active: false
                }
            });
        }, time);
        return true
    }
    delayedCancelSuccessMessage(time=2000) {
        setTimeout(() => {
            this.setState({
                success: {
                    title: undefined,
                    datasetId: undefined,
                    msg: undefined,
                    active: false
                }
            });
        }, time);
        return true
    }
}

