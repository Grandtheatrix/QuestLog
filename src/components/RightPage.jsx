import React from 'react';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import Amplify, { Auth } from 'aws-amplify';
import cross from "../assets/cross.png"
import SubquestModal from "./SubquestModal"
import closeButton from "../assets/closeButton.png"
import "./RightPage.css";



const RightPage = ({item = {}, getAllQuests}) => {
    
    
    const updateSubquest = (index) => {
        var params = {
          TableName : 'Quests',
          Key:{
            "id": item.id,
            },
            UpdateExpression: "set subquests = :s",
            ExpressionAttributeValues:{
                ":s": [...item.subquests.slice(0,index), ...item.subquests.slice(index + 1)]
            },
            ReturnValues:"UPDATED_NEW"
        };
        Auth.currentCredentials()
      .then(credentials => {
        const db = new DynamoDB.DocumentClient({
          credentials: Auth.essentialCredentials(credentials), region:'us-east-2'
        });
          db.update(params, (err, data) => {
            if (err){console.log("ERROR",err)}
            else {console.log("SUCCESS!!",data); getAllQuests();}
          })
      })
      }
      
    
      const confirmDeleteQuest = (index) => {
        let txt="";
        if (window.confirm("Do you want to delete this Sub-Quest and all supplementary Notes?")) {
            updateSubquest(index);
        }
      }


    const [open, setOpen] = React.useState(false);
    const [subquestEditIndex, setSubquestEditIndex] = React.useState(null);
    const [subquestEditMode, setSubquestEditMode] = React.useState(false);



    if (JSON.stringify(item) === "{}") {return null}
    return (
      <div style={{width:"90%", display:"flex", flexDirection:"column", alignItems:"center", paddingLeft:20, paddingTop:30}} >
      {item.subquests.map((subQ, index) => 
      <React.Fragment>
      <div style={{ width: "95%" , paddingLeft: 30, paddingTop:10, display: "flex", alignItems:"center"}}>
          <img style={{width:30, height:30}} src={cross}/><span onClick={()=>{setSubquestEditMode(true);setOpen(true);setSubquestEditIndex(index);}} style={{fontSize:20, paddingLeft: 20}}>{subQ.label}</span> <img className="closeButton" src={closeButton} onClick={() => confirmDeleteQuest(index)} />
      </div>
      <div style={{display:"flex", alignItems:"flex-start", justifyContent:"flex-start", width: "95%"}}>
        <p style={{fontSize:15, width: "95%" ,textAlign: "left"}} onClick={()=>{setSubquestEditMode(true);setOpen(true);setSubquestEditIndex(index);}}>{subQ.notes}</p>
      </div>
      </React.Fragment>
      )}
      { JSON.stringify(item) !== "{}" &&
      <React.Fragment>
        <div className="newSubQuest" onClick={()=> setOpen(true)}>
          <img style={{width:30, height:30}} src={cross}/>
        </div>
        <SubquestModal open={open} setOpen={setOpen} item={item} getAllQuests={getAllQuests} subquestEditMode={subquestEditMode} setSubquestEditMode={setSubquestEditMode} subquestEditIndex={subquestEditIndex} setSubquestEditIndex={setSubquestEditIndex}/>
      </React.Fragment>
      }
    </div>
    )
  }

  export default RightPage;