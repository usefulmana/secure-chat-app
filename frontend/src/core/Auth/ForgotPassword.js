import React from 'react';
import { forgotPassword } from '../../API/userAPI'

export default class ForgotPassword extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            email: ''
        }

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChange(e){
        e.preventDefault();
        this.setState({
            email: e.target.value
        })
    }

    handleSubmit(e){
        forgotPassword(this.state)
    }

    render(){
        return (
            <div className="">
                <form onSubmit={this.handleSubmit}>
                    <input type="email" placeholder="Your Email" value={this.state.email} onChange={this.onChange}/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}