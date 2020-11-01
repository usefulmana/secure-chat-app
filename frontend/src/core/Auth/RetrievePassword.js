import React from "react";
import { retrievePassword } from "../../API/userAPI";
import "./base.scss";
import "./SignUp.scss";
import Swal from "sweetalert2";
import userImage from "./user.png";

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
      retrievePassword(password, this.props.match.params.token)
        .then((res) => {
          Swal.fire({
            title: "Success",
            icon: "success",
            timer: 2000,
          }).then((v) => this.props.history.push("/"));
        })
        .catch((err) => {
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
      <div className="background">
        <div className={`base-container signin-cont`}>
          <form className={`signin-form`}>
            <div className="signin-header">
              <div class="row justify-content-center ">
                <img src={userImage} className="user-icon"/>
              </div>
              <div className="">Retrieve Password</div>
            </div>

            <div className="signin-body">
              <div
                type="button"
                onClick={() => this.props.history.push("/")}
                className="btn signin-button"
              >
                Home
              </div>
              <div className="my-form">
                <input
                  type="password"
                  name="password"
                  placeholder="New Password"
                  value={this.state.password}
                  onChange={this.onChange}
                  className="my-form-input"
                />
              </div>
              <div className="my-form">
                <input
                  type="password"
                  name="retype"
                  placeholder="Confirm Password"
                  value={this.state.retype}
                  onChange={this.onChange}
                  className="my-form-input"
                />
              </div>
            </div>

            <div type="button"
              onClick={this.handleSubmit}
              className="btn signin-button">Submit</div>
            <div>
              <p>{error}</p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
