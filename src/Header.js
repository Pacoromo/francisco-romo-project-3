import firebaseConfig from "./firebase";
import { getDatabase, push, ref, onValue } from "firebase/database";
import { useState } from "react";

function Header(props) {
    console.log("The Header Component just rendered!");

    //Track form inputs
    const [userNameInput, setUserNameInput] = useState("");
    const [pinInput, setPinInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    
    //Set a state variable to check if any username matches
    const [usersFound, setUsersFound] = useState([]);

    //Set a state variable to check if user exists
    const [userFound, setUserFound] = useState(false);

    //Set a state to see if add user button is visible
    const [btnVisible, setBtnVisible] = useState(false);

    //function that takes care of the name input logic
    const handleUserNameInput = (e) => {
        const usersInArray = props.users.filter(
            (user) => user.email === e.target.value.toLowerCase()
        );
        if (usersInArray.length > 0) {
            setUsersFound(usersInArray);
        } else {
            setUsersFound([]);
            props.setUser(null);
        }
        // setUserFound(false);
        setUserNameInput(e.target.value.trim());
        setPinInput("");
        setBtnVisible(false);
    };

    //function that takes care of the pin input logic
    const handlePinInput = (e) => {
        const pinInArray = usersFound.filter((user) => user.pin === e.target.value);
        if (pinInArray.length) {
            setUserFound(true);
            props.setUser(pinInArray[0].node);
        } else {
            setUserFound(false);
            props.setUser(null);
        }

        if (userNameInput !== "" && e.target.value !== "") {
            setBtnVisible(true);
        } else {
            setBtnVisible(false);
        }

        setPinInput(e.target.value.trim());
    };

    //Function to handle the name input
    const handleNewUserInput = (e) => {
        setNameInput(e.target.value);
    };

    //A function that creates a new user
    const handleNewUserForm = (e) => {
        e.preventDefault();
        const newUserObj = {
            email: userNameInput.toLowerCase(),
            pin: pinInput,
            name: nameInput,
        };
        //Push the information to firebase
        const database = getDatabase(firebaseConfig);
        const databaseRef = ref(database);
        push(databaseRef, newUserObj);

        //listen for new information from our database
        onValue(
            databaseRef,
            (response) => {
                //Creating an array to store our data
                const newState = [];
                //store the returned data as variable
                const data = response.val();
                //loop through the returned object
                for (const key in data) {
                    newState.push({
                        email: data[key].email,
                        pin: data[key].pin,
                        node: key,
                    });
                }
                //update users
                props.setAllUsers(newState);
                //Get New user
                const newUser = newState.filter(
                    (user) => user.email === userNameInput && user.pin === pinInput
                );
                //Send node to App Component
                props.setUser(newUser[0].node);
                //Send it to new users found
                const usersFoundCopy = [...usersFound];
                usersFoundCopy.push(newUser[0]);
                setUsersFound(usersFoundCopy);
                //Clear the input and update states
                setNameInput("");
                setUserFound(true);
                setBtnVisible(false);
            },
            { onlyOnce: true }
        );
    };

    return (
        <header className="header">
            <form className="user-info-form">
                <label htmlFor="mail-input" className="sr-only">
                    email
                </label>
                <input
                    className="mail-input"
                    type="email"
                    name="mail"
                    id="mail-input"
                    placeholder="email"
                    onChange={handleUserNameInput}
                    value={userNameInput}
                />
                <label htmlFor="pin-input" className="sr-only">
                    PIN
                </label>
                <input
                    className="pin-input"
                    type="text"
                    name="pin"
                    id="pin-input"
                    placeholder="PIN"
                    onChange={handlePinInput}
                    value={pinInput}
                    disabled={userNameInput === "" ? true : false}
                />
                {userFound ? <span>✅</span> : null}
            </form>
            {btnVisible && !userFound ? (
                <div className="user-not-found-container">
                    <p>User has not been found</p>
                    <form action="submit" className="new-user-form">
                        <label htmlFor="name" className="sr-only">
                            Name
                        </label>
                        <input
                            className="new-user-input"
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            onChange={handleNewUserInput}
                            value={nameInput}
                        />
                        <button onClick={handleNewUserForm}>Create New User?</button>
                    </form>
                </div>
            ) : null}
        </header>
    );
}

export default Header;
