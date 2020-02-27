import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import Modal from '@material-ui/core/Modal';
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';

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

export default function SubquestModal({open, setOpen, item, getAllQuests}) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [label, setLabel] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const addSubquest = () => {
    var params = {
      TableName : 'Quests',
      Key:{
        "id": item.id,
        },
        UpdateExpression: "set subquests = :s",
        ExpressionAttributeValues:{
            ":s": [...item.subquests, {label:label, notes:notes}]
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
        else {console.log("SUCCESS!!",data); handleClose(); getAllQuests();}
      })
  })
  }

  const handleClose = () => {
      setNotes("");
      setLabel("");
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
          <h2 id="simple-modal-title">New Sub-Quest Title</h2>
          <input type="text" value={label} onChange={(e)=>setLabel(e.target.value)}/>
          <h2 id="simple-modal-title">Notes</h2>
          <textarea rows="5" cols="50" value={notes} onChange={(e)=>setNotes(e.target.value)}/>
          <button onClick={() => addSubquest()}>Inscribe</button>
        </div>
      </Modal>
    </div>
  );
}