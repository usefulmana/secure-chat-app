import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import "./TeamsList.scss";
import { getTeamInfo, deleteTeam, leaveTeam } from "../../API/teamsAPI";
import { currentUser } from "../../API/userAPI";

import Modal from "../../Template/Modal";
import CreateTeamForm from "./CreateTeamForm";
import EditTeamForm from "../Common/EditTeamForm";
import AddMember from "../Common/AddMember";
import Layout from "../Layout";
import Swal from "sweetalert2";

const TeamsList = ({ history }) => {
  var jwt = JSON.parse(localStorage.getItem("jwt"));
  var userId = jwt.user._id;
  var token = jwt.token;

  const [teams, setTeams] = useState([]);
  const [createFormOpened, setCreateFormOpened] = useState(false);
  const [editFormOpened, setEditFormOpened] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState();
  const [addMemberFormOpened, setAddMemberFormOpened] = useState(false);

  const TeamsRef = useRef({
    setTeams,
    setCreateFormOpened,
    setEditFormOpened,
  });

  useEffect(() => {
    currentUser()
      .then((data) => {
        var teams = data?.servers;
        setTeams(teams);
        if (teams.length > 0) initEvent();
      })
      .catch();
  }, []);

  const parseTeamName = (name) => {
    var arr = name.split(" ");

    if (arr.length - 1 > 0) {
      return (
        <span>
          {arr[0].charAt(0)} {arr[1].charAt(0)}
        </span>
      );
    } else {
      return (
        <span>
          {arr[0].charAt(0)} {arr[0].charAt(1)}
        </span>
      );
    }
  };

  const handleDelete = (teamId) => {
    deleteTeam({ teamId })
      .then((data) => {
        if (data.error) {
          console.log("error in deleting team : ", data.error);
          Swal.fire({
            title: "Error!",
            icon: "error",
            timer: 2000
          })
        } else {
          window.location.reload(false);
        }
      })
      .catch();
  };

  const handleLeaveTeam = (teamId) => {
    leaveTeam({ serverId: teamId })
      .then((data) => {
        if (data.error) {
          console.log("error in leaving team : ", data.error);
          Swal.fire({
            title: "Error!",
            icon: "error",
            timer: 2000
          })
        } else {
          window.location.reload(false);
        }
      })
      .catch();
  };

  const showDropDown = (e) => {
    console.log(e.target.parentNode.querySelector(".drop-down"));
  };

  const initEvent = () => {
    var editBtns = document.querySelectorAll(".edit-btn");

    Array.from(editBtns).forEach((editBtn) => {
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        var target = e.target.closest(".edit-btn");
        var teamId = target.id;
        setTeamToEdit(teamId);
        setEditFormOpened(true);
      });
    });

    var deleteBtns = document.querySelectorAll(".delete-btn");

    Array.from(deleteBtns).forEach((deleteBtn) => {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        var target = e.target.closest(".delete-btn");
        var teamId = target.id;
        Swal.fire({
          title: "Are you sure?",
          text: "You will not be able to undo this action!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.value) {
            handleDelete(teamId);
            Swal.fire({
              title: "Team Deleted",
              icon: "success",
              timer: 2000,
            }).then((v) => window.location.reload());
          }
        });
      });
    });

    var leaveBtns = document.querySelectorAll(".leave-team-btn");
    Array.from(leaveBtns).forEach((leaveBtn) => {
      leaveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        var target = e.target.closest(".leave-team-btn");
        var teamId = target.id;
        Swal.fire({
          title: "Are you sure?",
          text: "You will not be able to undo this action!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.value) {
            handleLeaveTeam(teamId);
            Swal.fire({
              title: "Left Team",
              icon: "success",
              timer: 2000,
            }).then((v) => window.location.reload());
          }
        });
      });
    });

    var addMemberBtns = document.querySelectorAll(".add-member-btn");
    Array.from(addMemberBtns).forEach((addMemberBtn) => {
      addMemberBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        var target = e.target.closest(".add-member-btn");
        var teamId = target.id;
        setTeamToEdit(teamId);
        setAddMemberFormOpened(true);
      });
    });
  };

  const showOptions = (c) => {
    var isAdmin = c.owner === userId;
    return isAdmin ? (
      <>
        <div className="each-option add-member-btn" id={c._id}>
          <i class="fas fa-user-plus"></i>Add members to the team
        </div>
        <div className="each-option edit-btn" id={c._id}>
          <i class="far fa-edit"></i>Edit team
        </div>
        <div className="each-option delete-btn" id={c._id}>
          <i class="far fa-trash-alt"></i>Delete team
        </div>
      </>
    ) : (
      <>
        <div className="each-option leave-team-btn" id={c._id}>
          <i class="fas fa-sign-out-alt"></i>Leave team
        </div>
      </>
    );
  };

  const renderTeams = () => {
    return (
      <div className="teams-list-cont row-w ">
        {teams.map((c) => (
          <div
            className="each-team"
            onClick={() => {
              history.push(`/team/${c._id}/${c.channels[0]}`);
            }}
          >
            <div className="options">
              <div className="show-drop-down-btn" onClick={showDropDown}>
                ...
              </div>
              <div className="drop-down">{showOptions(c)}</div>
            </div>
            <div class="team-image row JCC AIC">{parseTeamName(c.name)}</div>
            <div class="team-name">{c.name}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="teams-header row JCB">
        <div className="first">Teams</div>
        <div
          className="second row AIC"
          onClick={() => setCreateFormOpened(true)}
        >
          <i class="fa fa-pencil-square-o "></i>
          <div className="create-btn btn">Join or create teams</div>
        </div>
      </div>
    );
  };

  const modalStyle = {
    width: "50vw",
    height: "40vw",
  };

  return (
    <Layout>
      <div className="teams-list-cont">
        {renderHeader()}
        {renderTeams()}
      </div>
      <Modal
        opened={createFormOpened}
        setOpened={setCreateFormOpened}
        options={modalStyle}
      >
        <CreateTeamForm TeamsRef={TeamsRef} />
      </Modal>
      <Modal
        opened={editFormOpened}
        setOpened={setEditFormOpened}
        options={modalStyle}
      >
        <EditTeamForm TeamsRef={TeamsRef} teamId={teamToEdit} />
      </Modal>

      <Modal
        opened={addMemberFormOpened}
        setOpened={setAddMemberFormOpened}
        options={modalStyle}
      >
        <AddMember
          TeamsRef={useRef({ setOpened: setAddMemberFormOpened })}
          teamId={teamToEdit}
        />
      </Modal>
    </Layout>
  );
};

export default TeamsList;
