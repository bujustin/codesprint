import React from "react";
import "../css/inputfield.css";
import { Input } from "reactstrap";
const ms = require('pretty-ms');

export default class InputField extends React.Component {
  constructor(props) {
    super(props);

    const code =
      'public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World!");\n\t}\n}';

    this.state = {
      theCode: code,
      completed: "",
      error: "",
      errorCount: 0,
      currentChar: code.charAt(0),
      incomplete: code.substring(1),
      index: 0,
      input: "",
      hasBegun: false,
      finished: false,
      time: 0,
      start: 0,
      isOn: false
    };

    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);

    this.focus = this.focus.bind(this);
    this.goToNextWord = this.goToNextWord.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBackSpace = this.handleBackSpace.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== "") {
      this.setState({ 
        theCode: nextProps.text,
        completed: "",
        currentChar: nextProps.text.charAt(0),
        incomplete: nextProps.text.substring(1, nextProps.text.length)
      });
    }
  }

  startTimer() {
    console.log("STARTING TIMER");
    this.setState({
      time: this.state.time,
      start: Date.now() - this.state.time,
      isOn: true
    })
    this.timer = setInterval(() => this.setState({
      time: Date.now() - this.state.start
    }), 1);
    console.log("timer: " + this.timer);
  }

  stopTimer() {
  
    console.log("stopping timer");
    this.state.isOn = false;
    this.setState({isOn: false});
    console.log("Timer is on?  " + this.state.isOn);
    clearInterval(this.timer);

  }

  resetTimer() {
    this.setState({time: 0})
  }

  componentDidMount() {
    this.focus();
  }

  focus() {
    this.textInput.focus();
  }

  goToNextWord() {
    const { theCode } = this.state;
    let { index } = this.state;

    while (index < theCode.length) {
      index++;
      const nextChar = theCode.charAt(index);

      if (nextChar !== "\t" && nextChar !== "\n") {
        this.setState({
          index: index,
          completed: this.state.theCode.substring(0, index),
          currentChar: this.state.theCode.charAt(index),
          incomplete: this.state.theCode.substring(index + 1)
        });

        this.setState({ input: "" });
        break;
      }
    }
  }

  handleInputChange(event) {
    const input = event.target.value.charAt(event.target.value.length - 1);
    const nextChar = this.state.theCode.charAt(this.state.index);

    if (this.state.completed.length == 0) {
      this.startTimer();
    }

    if (this.state.error.length === 0) {
      if (event.target.value.length < this.state.input.length) {
        return;
      }

      if (input === nextChar) {
        this.setState(prevState => ({
          completed: prevState.completed + input,
          currentChar: prevState.theCode.charAt(prevState.index + 1),
          incomplete: prevState.incomplete.substring(1),
          input: prevState.input + prevState.theCode.charAt(prevState.index),
          index: prevState.index + 1
        }));

        if (input === " ") {
          this.setState({ input: "" });
        }

        const nextNextChar = this.state.theCode.charAt(this.state.index + 1);

        if (nextNextChar === "\t" || nextNextChar === "\n") {
          this.goToNextWord();
        }

        const { theCode, index } = this.state;

        if (index >= theCode.length - 1) {
          this.stopTimer();
          this.props.onFinish(this.state.time);
          this.setState({ finished: true });
        }
      } else {
        this.setState(prevState => ({
          error: prevState.error + input,
          errorCount: prevState.errorCount + 1,
          input: prevState.input + input
        }));
      }
    } else {
      if (event.target.value.length > this.state.input.length) {
        this.setState(prevState => ({
          error: prevState.error + input,
          errorCount: prevState.errorCount + 1,
          input: prevState.input + input
        }));
      } else {
        this.setState(prevState => ({
          error: prevState.error.substring(0, prevState.error.length - 1),
          errorCount: prevState.errorCount - 1,
          input: prevState.input.substring(0, prevState.input.length - 1)
        }));
      }
    }

    console.log(this.state);
  }

  handleBackSpace(event) {
    var key = event.keyCode || event.charCode;

    if (key == 8 || key == 46) {
    }
  }

  render() {
    const { completed, currentChar, error, incomplete } = this.state;

    return (
      <div>
        <div>
          <h3 className="timer">{ms(this.state.time)}</h3>
        </div>
        <div className="theCode">
          <div className="completed">{completed}</div>
          <div className="currentChar">{currentChar}</div>
          <div className="error">{error}</div>
          <div className="incomplete">{incomplete}</div>
        </div>
        <br />
        <br />
        {!this.state.finished ? (
          <Input
            disabled={this.props.disabled}
            value={this.state.input}
            innerRef={input => {
              this.textInput = input;
            }}
            type="text"
            onChange={this.handleInputChange}
            onKeyDown={this.handleBackSpace}
          />
        ) : (
          "Finished!"
        )}
      </div>
    );
  }
}