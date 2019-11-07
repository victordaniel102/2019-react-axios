import React from "react";

import {
  Button,
  Card,
  Container,
  Header,
  Icon,
  Placeholder
} from "semantic-ui-react";

import api from "../../infrastructure/api";

class TaskPage extends React.Component {
  state = {
    loading: true,
    data: undefined
  };

  list2map = list => {
    const map = new Map();
    if (Object.keys(list).length !== 0) {
        list.forEach(item => map.set(item.oid, item));
    }
    return map;
  };
  componentDidMount = () => {
    api
      .get("tasks")
      .then(response => response.data)
      .then(list => this.list2map(list))
      .then(tasks => this.setState({ data: tasks, loading: false }));
  };

  handleDone = task => {
    const { data } = this.state;
    api
      .post(`tasks/${task.oid}/done`)
      .then(response => response.data)
      .then(json => {
        console.log("====================================");
        console.log(task);
        console.log("====================================");
        task.done = true;
        data.set(task.oid, task);
        this.setState({ data: data });
      });
  };

  handleDelete = task => {
    const { data } = this.state;
    api
      .delete(`tasks/${task.oid}`)
      .then(response => response.data)
      .then(json => {
        console.log("====================================");
        console.log(task);
        console.log("====================================");
        task.done = true;
        data.set(task.oid, task);
        this.setState({ data: data });
      });
  };

  renderHeader = task => {
    return (
      <Card.Header>
        {task.title + " "}
        <Button
          disabled={task.delete || task.done}
          circular
          icon="trash alternate outline"
          onClick={this.handleDelete.bind(this, task)}
        />
        <Button
          disabled={task.delete || task.done}
          circular
          icon="thumbs up outline"
          onClick={this.handleDone.bind(this, task)}
        />
      </Card.Header>
    );
  };

  renderDescription = description => {
    return <Card.Meta>{description}</Card.Meta>;
  };

  renderDetails = task => (
    <Card.Description align="center">
      <Icon name="phone" circular={true} />
      <Icon name="plus" />
      <Icon name="users" circular={true} />
      <Icon name="arrow right" />
      <Icon name="dollar sign" circular={true} />
    </Card.Description>
  );

  renderCard = (task, loading) => {
    if (loading) {
      return (
        <Card>
          <Placeholder fluid>
            <Placeholder.Line length="medium" />
            <Placeholder.Line length="long" />
            <Placeholder.Line length="short" />
          </Placeholder>
        </Card>
      );
    } else {
      return (
        <Card key={task.oid}>
          <Card.Content>
            {this.renderHeader(task)}
            {this.renderDescription(task.description)}
            {this.renderDetails(task)}
          </Card.Content>
        </Card>
      );
    }
  };

  render() {
    const { data, loading } = this.state;
    const tasks = data !== undefined ? [...data].map(item => item[1]) : [];

    return (
      <Container fluid>
        <Header>Gentilezas</Header>
        <Card.Group itemsPerRow={1}>
          {tasks.map(task => this.renderCard(task, loading))}
        </Card.Group>
      </Container>
    );
  }
}

export default TaskPage;
