import React, { useState, useEffect } from "react";
// import { withRouter } from "react-router";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom";
import { signout } from "../API/userAPI";
import layout from './Layout.scss'

const Layout = ({ loading, history, children }) => {
    var localItem = localStorage.getItem('jwt')
    var item = JSON.parse(localItem)

    const [userImage, setUserImage] = useState(item.user.image)


    const handleClick = (option) => () => {
        history.push(`/${option}`)
    }

    const signout=()=>{
        localStorage.removeItem('jwt')
        history.push('/')
    }

    const isActive = () => {

        var pathname = history.location.pathname

        if (pathname.includes('teams')) {
            return "each-section active-each-section"
        } else {
            return "each-section"
        }
    }

    const renderSideNavBar = () => {
        return (
            <>
                <div className="side-navbar-cont">
                    <div className={isActive()} onClick={handleClick('teams')}>
                        <i class="fa fa-users teams-icon icon"></i>
                        <div className="text-center">Teams</div>
                    </div>
                    {/* <div className="btn option-btn" onClick={handleClick('contact')}>Contact</div> */}
                    {/* <div className="btn option-btn" onClick={handleClick('chats')}>Chats</div> */}
                </div>
                {/* <Contact visible={visible} /> */}
                {/* <Chats visible={visible} /> */}
            </>
        )
    }

    const renderTopNavbar = () => {
        return (
            <div className="top-navbar-cont row JCB AIC">
                <div className="first">
                    <span className="logo-text" >Microsoft Teams</span>
                </div>
                <div className="second">

                </div>
                <div className="third">
                    <div className="icon-image-cont" onClick={() => history.push('/profile')}>
                        <img className="icon-image" src={`${userImage}`} />
                    </div>
                    <div className="dropdown-cont">
                        <div onClick={()=>history.push('/profile')}>Profile</div>
                        <div onClick={signout}>Sign out</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {renderTopNavbar()}
            <div className="row layout-cont">
                <div className="first">
                    {renderSideNavBar()}
                </div>
                <div className="second">
                    {children}
                </div>
            </div>
        </>
    )
}

export default withRouter(Layout)