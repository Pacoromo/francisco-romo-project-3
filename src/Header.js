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
    const handleUserNameChange = (e) => {
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
        setUserNameInput(e.target.value);
        setPinInput("");
        setBtnVisible(false);
    };

    //function that takes care of the pin input logic
    const handlePinChange = (e) => {
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

        setPinInput(e.target.value);
    };

    //Function to handle the name input
    const handleNameChange = (e) => {
        setNameInput(e.target.value);
    };

    //A function that creates a new user
    const handleNewUser = (e) => {
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
        <header>
            <form className="user-info-form">
                <label htmlFor="mail" className="sr-only">
                    email
                </label>
                <input
                    type="email"
                    name="mail"
                    id="mail"
                    placeholder="email"
                    onChange={handleUserNameChange}
                    value={userNameInput}
                />
                <label htmlFor="pin" className="sr-only">
                    PIN
                </label>
                <input
                    type="text"
                    name="pin"
                    id="pin"
                    placeholder="PIN"
                    onChange={handlePinChange}
                    value={pinInput}
                />
                {userFound ? <span>✅</span> : null}
            </form>
            {btnVisible && !userFound ? (
                <>
                    <p>User has not been found</p>
                    <label htmlFor="name" className="sr-only">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Name"
                        onChange={handleNameChange}
                        value={nameInput}
                    />
                    <button onClick={handleNewUser}>Create New User?</button>
                </>
            ) : null}
        </header>
    );
}

export default Header;
