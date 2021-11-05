import axios from 'axios';
import React from 'react';

import { Container, List, Header, Segment, Label, Icon, Button, Message} from 'semantic-ui-react'
import { routeToAddQuery } from './route/routeToAddQuery';
import { routeToUpdateQuery } from './route/routeToUpdateQuery';


const ODP_REACTOR_SERVER_URL = process.env.ODP_REACTOR_SERVER_URL ? process.env.ODP_REACTOR_SERVER_URL : '';

const QueriesPageStatus = {
    DELETE_ERROR : 'Error deleting query',
    DELETE_SUCCESS : 'Ok',
    OK : 'OK'
}

export default class QueryConfigurationPage extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            queries: null,
            error: {
                title: undefined,
                queryId: undefined,
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
        if (!this.state.queries) {
            fetch(`${process.env.ODP_REACTOR_SERVER_URL}/queries`) .then(response => { 
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                return response.json();
            }).then(data => {
                // `data` is the parsed version of the JSON returned from the above endpoint.
                console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
                if (data.queries) {
                    this.setState({
                        queries: data.queries
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
                        <Label circular inverted size="big" color="black">{this.state.queries && this.state.queries.length ? this.state.queries.length : 0}</Label>
                        <Header.Content>
                            Queries
                        </Header.Content>
                    </Header>
                    {this.state.queries && <List divided relaxed verticalAlign='middle' size="big">
                        {this.state.queries.map((query) => {
                            return <List.Item horizontal>
                                <List.Content floated="right">
                                    <Button color="red" onClick={()=>{
                                        this.deleteQuery(query.id)
                                    }}>Delete</Button>
                                </List.Content>
                                <List.Content floated="right">
                                    <Button color="olive" onClick={()=>{
                                        routeToUpdateQuery(query.id)
                                    }}>Update</Button>
                                </List.Content>                                      
                                <Icon name="cube" color="green" />
                                <List.Content>
                                    <List.Header>{query.patternLabel}</List.Header>
                                    <List.Description>{query.patternUri}</List.Description>
                                </List.Content>
                            </List.Item>
                        })}
                    </List>}
                    {this.state.queries && this.state.queries.length < 1 &&
                        <Message color="blue">
                            There are no queries yet. Let's create a new one.
                            Any query will be run to index collections in connected datasets.
                        </Message>
                    }
                </Segment>
                <div>
                    <List horizontal divided size="big">
                        <List.Item>
                            <Button color="" onClick={()=>{
                                routeToAddQuery()
                            }}>
                                <Icon name="cubes" color="blue"/>
                                <Icon name="add" color="black"/>
                                    Add Query
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
    deleteQuery(queryId) {
        axios.delete(`${process.env.ODP_REACTOR_SERVER_URL}/queries/${queryId}`).then(res => {
            if (res.data.status === QueriesPageStatus.OK && Array.isArray(res.data.queries)) {
                this.setState({
                    queries: res.data.queries,
                    success: {
                        title: QueriesPageStatus.DELETE_OK,
                        queryId: undefined,
                        msg: 'Query succesfully delete',
                        active: true
                    }
                })
            } else {
                this.setState({
                    error: {
                        title: QueriesPageStatus.DELETE_ERROR,
                        queryId: queryId,
                        msg: res.data.msg,
                        active: true
                    }
                })
            }
        }).catch(err => {
            console.log(err)
            this.setState({
                error: {
                    title: QueriesPageStatus.DELETE_ERROR,
                    queryId: queryId,
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
                    queryId: undefined,
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
                    queryId: undefined,
                    msg: undefined,
                    active: false
                }
            });
        }, time);
        return true
    }
}

