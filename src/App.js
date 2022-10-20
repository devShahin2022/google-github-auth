import './App.css';
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import app from './firebase/firebase.init';
import { useState } from 'react';


const auth = getAuth(app);

function App() {
  const [user, setUser] = useState({});
  // for display name
  const [displayName, setDisplayName] = useState("");
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
    .then(result => {
      const user = result.user;
      setUser(user);
      console.log(user);
    })
    .catch(error => {
      console.log("error : ", error);
    });
  }
  const handleGitHubLogin = () => {
    signInWithPopup(auth, githubProvider)
    .then(result => {
      const user = result.user;
      setUser(user);
      console.log(result);

      const disName = user.displayName || result._tokenResponse.displayName;
      setDisplayName(disName);
    })
    .catch(error => {
      console.log(error);
    });
  }
const handleSignOut = () => {
  signOut(auth)
  .then(() => {
    setUser({});
    console.log("Signout successfull");
  })
  .catch(error => {
    console.log("an error occure : ", error);
  })
}
  return (
    <div className="App">
        {
          user.uid ?
          <>
          <h3>Name : {displayName}</h3>
          <h4>Email : { user.email }</h4>
          <div><img src={user.photoURL} alt="" /></div>
          <button onClick={handleSignOut}>Log out</button>
        </> :
        <>
         <button onClick={handleGoogleLogin}>Google sign in</button> 
         <button onClick={handleGitHubLogin}>Github sign in</button>
        </>
        }
    </div>
  );
}

export default App;
