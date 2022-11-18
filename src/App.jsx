import { useEffect, useState } from "react";
import Post from "./components/Post";
import "./styles.css";
import { db, auth } from "../src/firebase.config";
import { Button, FormControl, Input, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ClassRounded, Instagram } from "@material-ui/icons";
import ImageUpload from "./components/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

const useStyles = makeStyles((theme) => ({
  paper: {
    // maxWidth: 600,
    width: "300px",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  modal: {
    display: "grid",
    placeItems: "center"
  },
  button: {
    marginRight: theme.spacing(1),
    fontSize: "13px"
  },
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px"
  },
  input: {
    marginBottom: "20px"
  },
  error: {
    color: "red",
    textAlign: "center"
  }
}));

export default function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignInForm, setOpenSignInForm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  // const [error, setError] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const signup = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch((err) => alert(err.message));
    // .catch((err) => setError("Please enter a valid email and password"));

    setUsername("");
    setEmail("");
    setPassword("");

    setOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setUsername("");
    setEmail("");
    setPassword("");

    setOpenSignInForm(false);
  };

  const body = (
    <div className={classes.paper}>
      <center>
        <img
          className="app__modalImage"
          src="https://i.pinimg.com/736x/f8/e3/7b/f8e37bf74c633ed8c5fdeec50f00043d.jpg"
          // height="60"
          alt="Firegram logo"
        />
        <h4>Firegram</h4>
      </center>

      <form type="submit" className={classes.form}>
        <FormControl className={classes.form}>
          <Input
            className={classes.input}
            autoFocus
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            className={classes.input}
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className={classes.input}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            // variant="outlined"
            size="small"
            onClick={signup}
            // className={classes.button}
            type="submit"
          >
            Sign up
          </Button>
        </FormControl>
      </form>
      {/* {error && <h6 className={classes.error}>{error}</h6>} */}
    </div>
  );
  const signInBody = (
    <div className={classes.paper}>
      <center>
        <img
          className="app__modalImage"
          src="https://i.pinimg.com/736x/f8/e3/7b/f8e37bf74c633ed8c5fdeec50f00043d.jpg"
          // height="60"
          alt="Firegram logo"
        />
        <h4>Firegram</h4>
      </center>

      <form type="submit" className={classes.form}>
        <FormControl className={classes.form}>
          <Input
            className={classes.input}
            autoFocus
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className={classes.input}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            // variant="outlined"
            size="small"
            onClick={signIn}
            // className={classes.button}
            type="submit"
          >
            Sign In
          </Button>
        </FormControl>
      </form>
      {/* {error && <h6 className={classes.error}>{error}</h6>} */}
    </div>
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              post: doc.data()
            };
          })
        );
      });
  }, []);

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className={classes.modal}
      >
        {body}
      </Modal>
      <Modal
        open={openSignInForm}
        onClose={() => setOpenSignInForm(false)}
        className={classes.modal}
      >
        {signInBody}
      </Modal>

      <div className="app__header">
        <div className="app__logo">
          <img
            className="app__headerImage"
            src="https://i.pinimg.com/736x/f8/e3/7b/f8e37bf74c633ed8c5fdeec50f00043d.jpg"
            // height="60"
            alt="Instagram logo"
          />
          <h4>Firegram</h4>
        </div>

        <div>
          {user ? (
            <Button className={classes.button} onClick={() => auth.signOut()}>
              Logout
            </Button>
          ) : (
            <div>
              <Button className={classes.button} onClick={() => setOpen(true)}>
                Sign Up
              </Button>
              <Button
                className={classes.button}
                onClick={() => setOpenSignInForm(true)}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="post-container">
        {posts.map(({ id, post }) => {
          return (
            <Post
              key={id}
              postId={id}
              username={post.username}
              imageUrl={post.imageUrl}
              caption={post.caption}
              user={user}
            />
          );
        })}
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}
