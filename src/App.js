import React from 'react';
import './App.css';
import cross from "./assets/cross.png"
import diamond from "./assets/blackDiamond.png"
import divider from "./assets/simpleDivider.png"
import closeButton from "./assets/closeButton.png"
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { CustomScrollBar } from "./components/CustomScrollBar"
import RightPage from "./components/RightPage"
import DynamoDB from 'aws-sdk/clients/dynamodb';
import Modal from "./components/Modal";
import Collapse from '@material-ui/core/Collapse';

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-2:3110d787-3e66-4e91-8984-1d3d56c618ba",
    region: 'us-east-2',
    userPoolId: "us-east-2_hKdRyRHlv",
    userPoolWebClientId: "lojk7mp5c9ur24p0pjds63gkm",
  }
});

function FormatChapter({item = {}, setSelectedQuest, selectedQuest}){
  const[show, setShow] = React.useState(false);
  React.useEffect(() => {
    if(selectedQuest.id !== item.id){
      setShow(false);
    }
  },[selectedQuest])

  const handleShowState = (bool) => {
    if (selectedQuest.id === item.id || bool){
      setShow(true)
    } else {
      setShow(false)
    }
  }

  if (JSON.stringify(item) === "{}") {return null}
  return (
    <div onMouseOver={() => handleShowState(true)} onMouseLeave={() => handleShowState(false)} onClick={()=>{if(setSelectedQuest) setSelectedQuest(item)}} style={{cursor:"pointer",width:"50%", display:"flex", flexDirection:"column", alignItems:"flex-start", paddingLeft:20, paddingTop:30, transition: "height 0.5s"}} >
    <div style={{display:"flex", alignItems:"center"}}><img style={{width:30, height:15}}  src={diamond}/><span style={{fontSize:15, paddingLeft:10}}>{item.label}</span></div>
    <Collapse timeout={1000} in={show}>
    {
    item.subquests.map(subQ => <div style={{paddingLeft: 30, paddingTop:10, display: "flex", alignItems:"center"}}><img style={{width:30, height:30}} src={cross}/><span style={{fontSize:15, paddingLeft: 20}}>{subQ.label}</span></div>)
    }
    </Collapse>
  </div>
  )
}

function App() {
  const [currentUser, setCurrentUser] = React.useState("");
  const [quests, setQuests] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [questEditMode, setQuestEditMode] = React.useState(false);
  const [selectedQuest, setSelectedQuest] = React.useState({});

  

  React.useEffect(() => {
    Auth.currentAuthenticatedUser({
      bypassCache: false
    }).then(user =>
      {setCurrentUser(user.username);
      getAllQuests();
      }
    )
      .catch(err => console.log("currentAuthenticatedUser error", err));
      
  }, []
  )
  React.useEffect(() => {
    for (let i of quests){
      if (i.id === selectedQuest.id){
        setSelectedQuest(i)
        return;
      }
    }
    setSelectedQuest({});
  },[quests])

  const getAllQuests = () => {
    const params = {TableName:"Quests", Limit: 100}
    Auth.currentCredentials()
  .then(credentials => {
    const db = new DynamoDB.DocumentClient({
      credentials: Auth.essentialCredentials(credentials), region:'us-east-2'
    });
      db.scan(params, (err, data) => {
        if (err){console.log("ERROR",err)}
        else {console.log(data); setQuests(data.Items.reverse())}
      })
  })
  }
  const deleteQuest = () => {
    var params = {
      TableName: "Quests",
      Key:{
          "id": selectedQuest.id
      }
    };
    Auth.currentCredentials()
  .then(credentials => {
    const db = new DynamoDB.DocumentClient({
      credentials: Auth.essentialCredentials(credentials), region:'us-east-2'
    });
      db.delete(params, (err, data) => {
        if (err){console.log("ERROR",err)}
        else {console.log("SUCCESS!!",data); getAllQuests()}
      })
  })
  }
  

  const confirmDeleteQuest = () => {
    let txt="";
    if (window.confirm("Do you want to delete the Selected Quest along with all Sub-Quests?")) {
      deleteQuest();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ flex: 1, width: "100%", paddingLeft: "80%" }}>
          {currentUser}
        </div>
        <div style={{ flex: 1, width: "100%"}}>
          
        </div>
        <div style={{ flex: 18, display: "flex", width: "90%", justifyContent: "space-around" }}>
          <div style={{ flex: 1 }}></div>
          <div id="leftPage" style={{ flex: 8, width: "100%", alignItems:"center" }}>
            <CustomScrollBar>
              {quests.map(item => <FormatChapter setSelectedQuest={setSelectedQuest} selectedQuest={selectedQuest} item={item}/> )}
              <div className="newQuestButtonDiv" onClick={()=> setOpen(true)}>
                <div className="newQuestButton"style={{display: "flex", alignItems:"center"}}>
                  <img style={{width:30, height:15, cursor:"pointer"}}  src={diamond}/>
                </div>
              </div>
            </CustomScrollBar>
          </div>
          <div style={{ flex: 1 }}></div>
          <div id="rightPage" style={{ display:"flex", flexDirection:"column", alignItems:"center",flex: 8, width: "90%", transform: "rotate(-1.75deg)" }}>
            {JSON.stringify(selectedQuest) !== "{}" && 
            <div style={{display:"flex", alignItems:"center"}}>
              <span onClick={()=>{setQuestEditMode(true); setOpen(true) } } style={{fontSize:25, paddingLeft:10}}>{selectedQuest.label}</span> <img className="closeButton" src={closeButton} onClick={confirmDeleteQuest}/>
              {/* <img style={{height:10,width: "90%"}} src={divider}/> */}
              </div>
            }
            <CustomScrollBar>
              <RightPage item={selectedQuest} getAllQuests={getAllQuests}/>
            </CustomScrollBar>
          </div>
          <div style={{ flex: 1 }}></div>
        </div>
      </header>
      <Modal open={open} setOpen={setOpen} getAllQuests={getAllQuests} questEditMode={questEditMode} setQuestEditMode={setQuestEditMode} selectedQuest={selectedQuest}/>
    </div>
  );
}

export default withAuthenticator(App, {
  signUpConfig: {
    hiddenDefaults: ['phone_number'],
    signUpFields: [
      {
        label: 'Character Name (case sensitive, no spaces)',
        key: 'username',
        required: true,
        displayOrder: 1,
        type: 'string'
      },
      {
        label: 'Email Address',
        key: 'email',
        required: true,
        displayOrder: 2,
        type: 'string'
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 3,
        type: 'password'
      }
    ]
  }
  // ,includeGreetings: true
}
);
