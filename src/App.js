import React from 'react';
import './App.css';
import cross from "./assets/cross.png"
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { CustomScrollBar } from "./components/CustomScrollBar"
import DynamoDB from 'aws-sdk/clients/dynamodb';

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-2:3110d787-3e66-4e91-8984-1d3d56c618ba",
    region: 'us-east-2',
    userPoolId: "us-east-2_hKdRyRHlv",
    userPoolWebClientId: "lojk7mp5c9ur24p0pjds63gkm",
  }
});

const thirtyThings = () => {
  let output = [];
  for (let i = 0; i < 30; i++) {
    output.push("thing " + i);
  }
  return output;
}

const formatChapter = (item) => {
  return (
    <div style={{width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-start", paddingLeft:20}} >
    <p style={{fontSize:30}}>{item.label}</p>
    {item.subquests.map(subQ => <div style={{paddingLeft: 30, paddingTop:10, display: "flex", alignItems:"center"}}><img style={{width:30, height:30}} src={cross}/><span style={{fontSize:25, paddingLeft: 20}}>{subQ}</span></div>)}
  </div>
  )
}

function App() {
  const [things, setThings] = React.useState([])
  const [currentUser, setCurrentUser] = React.useState("")
  const [quests, setQuests] = React.useState([])

  React.useEffect(() => {
    setThings(thirtyThings());
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
  const getThings = (dir) => {
    return things.map(item => (
      <p>{dir} {item}</p>
    ))
  }

  const getAllQuests = () => {
    const params = {TableName:"Quests", Limit: 100}
    Auth.currentCredentials()
  .then(credentials => {
    const db= new DynamoDB.DocumentClient({
      credentials: Auth.essentialCredentials(credentials), region:'us-east-2'
    });
      db.scan(params, (err, data) => {
        if (err){console.log("ERROR",err)}
        else {console.log(data); setQuests(data.Items)}
      })
    // now you can run queries with dynamo and current scoped credentials i.e. db.query(...)
  })
  }
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ flex: 1, width: "100%", paddingLeft: "80%" }}>
          {currentUser}
        </div>
        <div style={{ flex: 1, width: "100%"}}>
          
        </div>
        <div style={{ flex: 18, display: "flex", width: "100%", justifyContent: "space-around" }}>
          <div style={{ flex: 1 }}></div>
          <div id="leftPage" style={{ flex: 8, width: "90%", alignItems:"flex-start" }}>
            <CustomScrollBar>
              {quests.map(item => formatChapter(item) )}
            </CustomScrollBar>
          </div>
          <div style={{ flex: 1 }}></div>
          <div id="rightPage" style={{ flex: 8, width: "90%", transform: "rotate(-1.75deg)" }}>
            <CustomScrollBar>
              {getThings("right")}
            </CustomScrollBar>
          </div>
          <div style={{ flex: 1 }}></div>
        </div>
      </header>
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
