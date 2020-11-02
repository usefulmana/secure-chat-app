import Swal from "sweetalert2";
import React from "react";

class PasswordRule extends React.Component {

    constructor(props){
        super(props)
        this.clickEvent = this.clickEvent.bind(this)
        this.displayRule = this.displayRule.bind(this)
    }
    displayRule(){
        Swal.fire({
            title: "<strong>Password Rules</strong>",
            icon: "info",
            html: 
            "<br/>"+
            "<ul><li>Minimum 8 characters long</li>"+
            "<li>At least 1 digit from [0-9]</li>"+
            "<li>At least 1 character from [a-z]</li>"+
            "<li>At least 1 character from [A-Z]</li>"+
            "<li>At least 1 character from [$!%*#?&]</li>"+
            "</ul>",
        })
    }

    clickEvent(e){
        e.preventDefault()
        this.displayRule()
    }

    render(){
        return (
            <button 
            className="text-center" 
            style={{color:"teal", border:"none", backgroundColor:"white"}} 
            onClick={this.clickEvent}>Password Rules</button>
        )
    }
}

export default PasswordRule;