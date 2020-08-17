import React,{useState,useEffect} from 'react';
import './App.css';
import Post from "./Post"
import {db,auth} from "./firebase"
import {makeStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import {Button,Input} from '@material-ui/core'
import ImageUpload from "./ImageUpload"
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes=useStyles()
  const [modalStyle]=useState(getModalStyle)
  const [post, setPosts] = useState([])
  const [openSingin,setopenSignin]=useState(null)
  const [open, setOpen]=useState(false)
  const [username, setUsername]=useState("")
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  const [user, setUser]=useState(null)

  useEffect(()=>{
    const unsubscribe =auth.onAuthStateChanged(authUser=>{
      if (authUser){
        setUser(authUser)
        console.log(authUser)
        ;

      }else{
        setUser(null)
      }
  })
  return ()=>{
    unsubscribe()
  }
  }
  ,[user,username])

    useEffect(()=>{db.collection("posts").orderBy("timestamp","desc").onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({id:doc.id,
        post:doc.data()}))
    )})},[])

  const signUp=event=>{
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email,password).then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message))
    setOpen(false)

  }
const singIn=(event)=>{
  event.preventDefault()
  auth.signInWithEmailAndPassword(email,password).catch((err)=>alert(err.message))
  setopenSignin(false)
}
  
  return (
    
    <div className="App">
      <Modal
        open={openSingin}
        onClose={()=>setopenSignin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
          <img className="app__headerimage" src="https://pngimage.net/wp-content/uploads/2018/06/font-instagram-png-2.png" alt=""/>
          </center>
          <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}  
          />
          <Input 
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}  
          />
          <Button type="submit" onClick={singIn}>Sign In</Button>
        </form>
        </div>
      </Modal>
      <Modal
        open={open}
        onClose={()=>{setOpen(false)}}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
          <img className="app__headerimage" src="https://pngimage.net/wp-content/uploads/2018/06/font-instagram-png-2.png" alt=""/>
          </center>
          <Input 
            placeholder="username"
            type="text"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}  
          />
          <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}  
          />
          <Input 
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}  
          />
          <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>
        </div>
      </Modal>
      
      <div className="app__header">
        <img className="app__headerimage" src="https://pngimage.net/wp-content/uploads/2018/06/font-instagram-png-2.png" alt=""/>
        {user?<Button onClick={()=>{auth.signOut()}}>Logout</Button>:
      <div className="app__logincontainer">
      <Button onClick={()=>{setopenSignin(true)}}>Sign In</Button>
      <Button onClick={()=>{setOpen(true)}}>Sign Up</Button>
      </div>}
      </div>
      <div className='app__posts'>
        <div className="app__postsLeft">
          {
          post.map(({id,post})=>
            <Post key={id} user={user} postId={id} username={post.username} caption={post.caption} imageurl={post.imageurl} />) 
          }
        </div>
          <div className="app__postsRight">
              <InstagramEmbed
              url='https://www.instagram.com/p/B8OD44KAlx1/'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>
      </div>
      
     {user?.displayName?<ImageUpload username={user.displayName} />:(<h3>sorry you need to login to update</h3>)}

    </div>
  );
}

export default App;
