import "./styles/styles.scss";

import firebaseConfig from "./firebase";
import { getDatabase, ref, get } from "firebase/database";
import { useState, useEffect } from "react";

import Header from "./Header";
import Main from "./Main";

function App(props) {
  console.log("The App component just rendered!");

  //Set an array with all users
  const [allUsers, setAllUsers] = useState([]);

  //Build a variable to store the info once a user has been found and pass it down to main
  const [userFoundNode, setUserFoundNode] = useState("");

  useEffect(() => {
    //create a variable that will hold on to our database values
    const database = getDatabase(firebaseConfig);
    //create a variable that makes reference to our database
    const databaseRef = ref(database);
    //array of names, pins and nodes of all users
    const users = [];
    //grabbing the information from our database
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

  //A function to pass down the node data from Header
  const setUser = (node) => {
    setUserFoundNode(node);
  };

  return (
    <div className="App">
      <h1>My Shopping List</h1>
      <Header users={allUsers} setUser={setUser} setAllUsers={setAllUsers} />
      <Main node={userFoundNode} />
    </div>
  );
}

export default App;
