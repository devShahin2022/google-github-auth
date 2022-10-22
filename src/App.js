import './App.css';
import { createUserWithEmailAndPassword, getAuth, GithubAuthProvider, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
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
      console.log(user.photoURL);
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
// create a new account with email and password
const handleCreateAcc = (e) => {
  e.preventDefault();
  const form = e.target;
  // console.log(form);
  const userInptEmail = form.email.value;
  const userInptPsw = form.password.value;
  // console.log(userInptEmail,userInptPsw);
  createUserWithEmailAndPassword(auth,userInptEmail,userInptPsw)
  .then(result => {
    // console.log(result.user);
    if(result.user && result.user.email){
      console.log("Your account created success!");
      // email verification link
      sendEmailVerification(result.user)
      .then(() => {
        console.log("email verify link hasbeen sent");
      })
    }
  })
  .catch(error => {
    // console.log("error code : ", error.code, "Error message : ", error.message);
    if(error.code ==="auth/email-already-in-use"){
      console.log("Data already exits");
    }
    else if(error.code === "auth/weak-password"){
      console.log("Password will be atleast 6 characters");
    }else{
      console.log("Internal error!");
    }
  });
}
const handleLogin = (e) => {
  e.preventDefault();
  const form = e.target;
  // console.log(form);
  const userInptEmail = form.email.value;
  const userInptPsw = form.password.value;

  signInWithEmailAndPassword(auth, userInptEmail, userInptPsw)
  .then(res => {
    console.log("Log in success => ",res.user.email);
  })
  .catch(error => {
    console.log(error);
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
        <h1>Sign up</h1>
        <form onSubmit={handleCreateAcc}>
          <p>email : <input name='email' type="text" placeholder='input email'/></p>
          <p>email : <input name='password' type="text" placeholder='password'/></p>
          <button type='submit'>Create account</button>
        </form>

        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <p>email : <input name='email' type="text" placeholder='input email'/></p>
          <p>password : <input name='password' type="text" placeholder='password'/></p>
          <button type='submit'>Log in</button>
        </form>
    </div>
  );
}

export default App;
