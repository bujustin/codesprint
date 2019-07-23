import React from 'react';
import '../css/home.css';
import { getUrlPrefix } from './Api';

import {Button, Container, Row, Col} from 'reactstrap';
import computerImage from '../img/computer.png'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleSoloGame = this.handleSoloGame.bind(this);
    this.handleMultiGame = this.handleMultiGame.bind(this);
  }

  handleSoloGame() {
    this.props.history.push("/solo-game");
  }

  handleMultiGame() {
  	let url = getUrlPrefix() + "/new";

  	fetch(url, {
  		method: "GET",
  		mode: "cors",
  	})
  		.then(result => result.text())
  		.then(roomName => {
  			this.props.history.push("/multi-game/" + roomName);
  		})
  		.catch(err => alert(err));
  }
  
  render() {
    return (
      <Container className="no-padding">
        <Row>
          <Col xs="6">
            <img classname="computer-image" src={computerImage}/>
          </Col>
            
          <Col xs="6">
            <Container>
              <h1 className="welcome-text">
                Improve your typing!
              </h1>
              <br/>
              <h5 className="instructions-text">Run a solo time trial or challenge your friends!</h5>
              <br/>
              <br/>
              <br/>
            </Container>
            <Button className="solo-button" onClick={this.handleSoloGame}>Solo Game</Button>
            <Button className="multi-button" onClick={this.handleMultiGame}>Multiplayer Game</Button>
          </Col>
        </Row>
        
        


      </Container>
    );
  }
} 

export default Home;