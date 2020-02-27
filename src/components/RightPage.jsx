import React from 'react';
import cross from "../assets/cross.png"
import SubquestModal from "./SubquestModal"
import "./RightPage.css";

const RightPage = ({item = {}, getAllQuests}) => {
    const [open, setOpen] = React.useState(false);
    if (JSON.stringify(item) === "{}") {return null}
    return (
      <div style={{width:"95%", display:"flex", flexDirection:"column", alignItems:"center", paddingLeft:20, paddingTop:30}} >
      {item.subquests.map(subQ => 
      <React.Fragment>
      <div style={{ width: "95%" , paddingLeft: 30, paddingTop:10, display: "flex", alignItems:"center"}}>
          <img style={{width:30, height:30}} src={cross}/><span style={{fontSize:30, paddingLeft: 20}}>{subQ.label}</span>
      </div>
      <p style={{fontSize:20, width: "90%"}}>{subQ.notes}</p>
      </React.Fragment>
      )}
      { JSON.stringify(item) !== "{}" &&
      <React.Fragment>
        <div className="newSubQuest" onClick={()=> setOpen(true)}>
          <img style={{width:30, height:30}} src={cross}/>
        </div>
        <SubquestModal open={open} setOpen={setOpen} item={item} getAllQuests={getAllQuests}/>
      </React.Fragment>
      }
    </div>
    )
  }

  export default RightPage;