import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./Profile.scss";
import {
  changeUsername,
  changePassword,
  currentUser,
  changeAvatar,
} from "../API/userAPI";
import Modal from "../Template/Modal";
import { set } from "animejs";

const Profile = ({ history }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var token = undefined;

  if (!jwt) {
    history.push("/");
  } else {
    token = jwt.token;
  }

  const [user, setUser] = useState({
    username: "",
    password: "",
    image: "",
  });

  const [formData, setFormData] = useState(new FormData());

  const [disabled, setDisabled] = useState({
    username: true,
    password: true,
    image: "",
  });

  const [popUp, setPopUp] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    currentUser({ token })
      .then((data) => {
        setUser({
          username: data.username,
          image: data.image,
          password: "123123123",
        });
      })
      .catch((err) => {
        console.log("err : ", err);
      });
  }, []);

  const handleChange = (option) => (e) => {
    if (option === "username") {
      setUser({ ...user, username: e.target.value });
    } else if (option === "password") {
      setUser({ ...user, password: e.target.value });
    } else if (option === "image") {
      formData.append(`avatar`, e.target.files[0]);
      // setUser({ ...user, image: e.target.files[0] })
    }
  };

  const handleClick = (option) => (e) => {
    if (option === "username") {
      setDisabled({ username: false, password: true });
    } else if (option === "password") {
      setDisabled({ username: true, password: false });
      setUser({ ...user, password: "" });
    } else if (option === "image") {
    }
  };

  const handleSubmit = (option) => (e) => {
    if (option === "username") {
      changeUsername({ username: user.username, token: token })
        .then((data) => {
          if (data.username === user.username) {
            setPopUp(true);
            setMessage("Username was succesfully changed");
            setDisabled({ username: true, password: true });
          }
        })
        .catch((err) => {});
    } else if (option === "password") {
      changePassword({ password: user.password, token })
        .then((data) => {
          if (data.success === true) {
            setPopUp(true);
            setMessage("Password was succesfully changed");
            setUser({ ...user, password: "***********" });
            setDisabled({ username: true, password: true });
          } else if (data.error) {
          }
        })
        .catch((err) => {});
    } else if (option === "image") {
      changeAvatar({ formData, token })
        .then((data) => {
          if (data.image) {
            setPopUp(true);
            setMessage("Avatar has been succesfully changed");
            setUser({ ...user, image: data.image });
          } else if (data.error) {
          }
        })
        .catch((err) => {});
    }
  };

  const showOptions = (option) => {
    if (option === "username" && disabled.username) {
      return <button onClick={handleClick("username")}>Edit</button>;
    } else if (option === "username" && !disabled.username) {
      return <button onClick={handleSubmit("username")}>Submit</button>;
    }

    if (option === "password" && disabled.password) {
      return <button onClick={handleClick("password")}>Edit</button>;
    } else if (option === "password" && !disabled.password) {
      return <button onClick={handleSubmit("password")}>Submit</button>;
    }
  };

  const modalStyle = {
    width: "50vw",
    height: "20vh",
  };

  return (
    <div className="profile-cont">
      <div>
        <img className="avatar-image" src={`${user.image}`} />
      </div>
      <input
        type="file"
        name="filefield"
        onChange={handleChange("image")}
        required
      ></input>
      <button onClick={handleSubmit("image")}>Submit</button>
      <div>
        <input
          value={user.username}
          onChange={handleChange("username")}
          disabled={disabled.username}
        />
        {showOptions("username")}
      </div>
      <div>{user.email}</div>
      <div>
        <input
          type="password"
          onChange={handleChange("password")}
          value={user.password}
          disabled={disabled.password}
        />
        {showOptions("password")}
      </div>
      <Modal opened={popUp} setOpened={setPopUp} options={modalStyle}>
        <div className="btn-profile">
          <button
            onClick={() => {
              setPopUp(!popUp);
            }}
          >
            Close
          </button>
          {message}
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
