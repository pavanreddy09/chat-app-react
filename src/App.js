import './App.css';
import {FiSend} from 'react-icons/fi';
import {CgProfile} from 'react-icons/cg';
import { useEffect, useState } from 'react';
import {onValue, push, ref} from 'firebase/database';
import moment from 'moment';
import {firebaseDatabase} from '../src/backend/FirebaseHandler';

function App() {
  const [msg,setMsg] = useState("");
  const [Allmsgs,setAllmsgs] = useState([])

  const handlesendMessage = async () => {
     const fref = ref(firebaseDatabase,'MESSAGES')
     await push(fref,{
       message:msg,
       name:"pavan",
       timeStamp:moment().format('MMMM Do YYYY, h:mm:ss a')
     })
     setMsg("");
  }

  useEffect(()=>{
     const fbref = ref(firebaseDatabase,'MESSAGES');
     onValue(fbref,(snapshot) => {
       if(snapshot.exists()) {
        setAllmsgs(Object.values(snapshot.val()).reverse())
       }
     },{onlyOnce:false})
  },[])

  return (
    <div className='chat-app-container'>
      <div className='message-container'>
         {
           Allmsgs.map(item => {
             return(
               <div className='message-arch-container'>
                  <CgProfile  size={40}/>
                  <div className='message-info-container'>
                    <p className='message-name'>{item.name}</p>
                    <p>{item.message}</p>
                  </div>
               </div>
             )
           })
         }
      </div>
      <div className='action-container'>
        <input placeholder='Type Your Message...' value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button onClick={handlesendMessage}>
          Send
          <FiSend size={15} />
        </button>
      </div>
    </div>
  );
}

export default App;
