// import React, { useState, useEffect, useRef } from "react";

// import ChatRoom from "../Dashboard_component/ChatRoom";
// import Contact from "../Dashboard_component/Contact";
// import Teams from "../Dashboard_component/Teams";

// import dashboard from "./Dashboard.scss"
// import Layout from "../Layout";

// const Dashboard = ({ }) => {



//     // ['teams]
//     const [selectedOption , setSelectedOption]= useState('teams')

//     var dashboardRef = useRef({
//     })

//     useEffect(() => {

//     })

//     const handleClick = (option) => (e) => {
//         setSelectedOption(option)
//     }




//     const renderOption=()=>{
//         if(selectedOption==="teams") return <Teams/>
//     }

//     return (
//         <>
//             {/* <Layout dashboardRef={dashboardRef} />
//             <div className="row dashboard-cont">
//                 <div className="first">
//                     {renderSideNavBar()}
//                 </div>
//                 <div className="second">
//                     {renderOption()}
//                 </div>
//             </div> */}
//         </>
//     )
// }

// export default Dashboard