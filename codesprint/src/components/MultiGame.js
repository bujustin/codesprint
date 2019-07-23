import React from "react";
import { Button } from 'reactstrap';
import { startListener, finishListener, joinListener, getUrlPrefix } from './Api';
import InputField from "./InputField";
import '../css/sologame.css';
import meImage from '../img/me.png'
import userImage from '../img/user.png'
const ms = require('pretty-ms');

export default class MultiGame extends React.Component {
  constructor(props) {
    super(props);

    const roomName = this.props.match.params.roomName;

    this.state = {
    	roomName: roomName,
    	numPlayers: 0,
    	playerId: "0",
    	text: "",
    	times: {},
    	disabled: true
    };

    this.joinRoom(roomName);
    joinListener(roomName, (data) => this.opponentJoined(data["players"]));
    startListener(roomName, (data) => this.allstart());
    finishListener(roomName, (data) => this.allfinish(data["times"]));
  }

  joinRoom(roomName) {
  	let url = getUrlPrefix() + "/room/" + roomName;

  	fetch(url, {
  		method: "GET",
  		mode: "cors",
  		dataType: "json"
  	})
  		.then(result => result.json())
  		.then(result => {
  			this.setState({
  				numPlayers: parseInt(result["players"]),
  				playerId: result["players"],
  				text: result["text"]
  			});
  		})
  		.catch(err => alert(err));
  }

  opponentJoined(numPlayers) {
  	this.setState({
  		numPlayers: numPlayers
  	});
  }

  start() {
  	let url = getUrlPrefix() + "/start/" + this.state.roomName;
  	fetch(url);
  }

  finish(time) {
  	let url = getUrlPrefix() + "/finish/" + this.state.roomName + "/" 
  		+ this.state.playerId + "/" + time;
  	fetch(url);
  }

  allstart() {
  	this.setState({
  		disabled: false
  	});
  }

  allfinish(times) {
  	this.setState({
  		times: times
  	});
  }

  render() {
    return (
      <div>
      	<table>
      		<tr>
		      	{[...Array(this.state.numPlayers)].map((x, i) =>
	      	    <td key={i}>
	      	    	{parseInt(this.state.playerId) === i+1 ?
	      	    		<img src={meImage} style={{maxWidth: "30px"}} key={i}/>
	      	    		:
	      	    		<img src={userImage} style={{maxWidth: "30px"}} key={i}/>
	      	    	}
	      	    </td>
		      	)}
      		</tr>
      	</table>
      	<br /><br />
        multiplayer game
        <br /><br />

        {this.state.playerId == "1" && this.state.disabled &&
        	<Button onClick={() => this.start()}>
        		Start
        	</Button>
        }

        <br /><br />
        <InputField text={this.state.text} onFinish={(time) => this.finish(time)} disabled={this.state.disabled}/>

      	<br /><br />
      	<table>
	      	{Object.keys(this.state.times).map((playerId) => 
	      		<tr>
	      			<td>
	      				{parseInt(this.state.playerId) === parseInt(playerId) ?
	      	    		<img src={meImage} style={{maxWidth: "30px"}}/>
	      	    		:
	      	    		<img src={userImage} style={{maxWidth: "30px"}}/>
	      	    	}
	      	    	{ms(this.state.times[playerId])}
	      			</td>
	      		</tr>
	      	)}
      	</table>
      </div>
    );
  }
}
