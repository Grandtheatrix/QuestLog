import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import Modal from '@material-ui/core/Modal';
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    top:"50%",
    left: "50%",
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal({open, setOpen, val}) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [text, setText] = React.useState("");

  const putQuest = () => {
    var params = {
      TableName : 'Quests',
      Item: {
         id: uuidv4(),
         label: text,
         subquests: [],
         dateCreated: moment.now()
      }
    };
    Auth.currentCredentials()
  .then(credentials => {
    const db = new DynamoDB.DocumentClient({
      credentials: Auth.essentialCredentials(credentials), region:'us-east-2'
    });
      db.put(params, (err, data) => {
        if (err){console.log("ERROR",err)}
        else {console.log("SUCCESS!!",data);}
      })
  })
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div 
        style={modalStyle} 
        className={classes.paper}>
          <h2 id="simple-modal-title">New Quest Title</h2>
          <textarea rows="5" cols="50" value={text} onChange={(e)=>setText(e.target.value)}/>
          <button onClick={() => putQuest()}>Inscribe</button>
        </div>
      </Modal>
    </div>
  );
}