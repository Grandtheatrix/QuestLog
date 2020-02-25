import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Scrollbars } from 'react-custom-scrollbars';
import scrollbarThumb from "./assets/scrollworkThumb.png"
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { CustomScrollBar } from "./components/CustomScrollBar"

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

function App() {
  const [things, setThings] = React.useState([])
  const [currentUser, setCurrentUser] = React.useState("")
  React.useEffect(() => {
    setThings(thirtyThings());
    Auth.currentAuthenticatedUser({
      bypassCache: false
    }).then(user =>
      // console.log(user)
      setCurrentUser(user.username)
    )
      .catch(err => console.log("currentAuthenticatedUser error", err));
  }, []
  )
  const getThings = (dir) => {
    return things.map(item => (
      <p>{dir} {item}</p>
    ))
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
          <div id="leftPage" style={{ flex: 8, width: "90%" }}>
            <CustomScrollBar>
              {getThings("left")}
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
