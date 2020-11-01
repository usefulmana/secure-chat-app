import React from "react";
import { forgotPassword } from "../../API/userAPI";
import { Redirect } from "react-router-dom";
import "./base.scss";
import "./SignUp.scss";
import Swal from "sweetalert2";

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    this.setState({
      email: e.target.value,
    });
  }

  handleSubmit(e) {
    forgotPassword(this.state);
    Swal.fire({
      title: "Success",
      icon: "success",
      timer: 2000,
    }).then((v) => this.props.history.push("/"));
  }

  render() {
    return (
      <div className="background">
        <div className={`base-container signin-cont`}>
          <form className={`signin-form`}>
            <div className="signin-header">
              <div class="row justify-content-center ">
                <img src="img/user.png" className="user-icon" />
              </div>
              <div className="">Forgot Password</div>
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
                  type="email"
                  className="my-form-input"
                  placeholder="Your Email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
            </div>
            <div
              type="button"
              onClick={this.handleSubmit}
              className="btn signin-button"
            >
              Submit
            </div>
          </form>
        </div>
      </div>
    );
  }
}
