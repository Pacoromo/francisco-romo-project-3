import firebaseConfig from "./firebase";
import { getDatabase, ref, get } from "firebase/database";
import { useState, useEffect } from "react";
import "./styles/styles.scss";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

function App(props) {
  console.log("The App component just rendered!");

  //Set an array with all users
  const [allUsers, setAllUsers] = useState([]);

  //Build a variable to store the info once a user has been found and pass it down to main
  const [userFoundNode, setUserFoundNode] = useState("");

  //A state to show introductory paragraph
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    //create a variable that will hold on to our database values
    const database = getDatabase(firebaseConfig);
    //create a variable that makes reference to our database
    const databaseRef = ref(database);
    //array of names, pins and nodes of all users
    const users = [];
    //grabbing a snapshot from our database
    get(databaseRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          //all data in the database
          const allData = snapshot.val();
          //make an array with all users (name, pin and node)
          for (const key in allData) {
            users.push({
              email: allData[key].email,
              pin: allData[key].pin,
              node: key,
            });
          }
          setAllUsers(users);
        } else {
          alert("Database not available. Please try again later");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="App">
      <div className="wrapper">
        <Header users={allUsers} setUser={setUserFoundNode} setAllUsers={setAllUsers} setIntro={setShowIntro} />
        <Main node={userFoundNode} intro={showIntro} />
        <Footer />

      </div>
    </div>
  );
}

export default App;