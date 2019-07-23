import React from "react";
import "../css/sologame.css";
import InputField from "./InputField";
import { getUrlPrefix } from './Api';

export default class SoloGame extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
    	text: "",
    };

    this.generateText();
  }

  generateText() {
  	let url = getUrlPrefix() + "/generate/python/30";

  	fetch(url, {
  		method: "GET",
  		mode: "cors",
  		dataType: "json"
  	})
  		.then(result => result.text())
  		.then(result => {
  			this.setState({
  				text: result
  			});
  		})
  		.catch(err => alert(err));
  }

  render() {
    return (
      <div>
        solo game
        <br /><br /><br /><br />
        <InputField text={this.state.text} onFinish={(time) => null} disabled={false} />
      </div>
    );
  }
}
