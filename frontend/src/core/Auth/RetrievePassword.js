import React from "react";
import { retrievePassword } from "../../API/userAPI";

export default class RetrievePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      retype: "",
      error: "",
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    const { password, retype } = this.state;

    if (password === retype) {
      retrievePassword(password, this.props.match.params.token).then(
          res => alert("Successfully Reset Password!")
      ).catch(err => {
        this.setState({
            error: err,
          });
      });
    } else {
      this.setState({
        error: "Password and the retyped password do not match!",
      });
    }
  }

  render() {
    const { error } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={this.state.password}
            onChange={this.onChange}
          />
          <input
            type="password"
            name="retype"
            placeholder="Confirm Password"
            value={this.state.retype}
            onChange={this.onChange}
          />
          <button type="submit">Submit</button>
          <div>
            <p>{error}</p>
          </div>
        </form>
      </div>
    );
  }
}
