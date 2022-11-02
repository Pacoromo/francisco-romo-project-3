import firebaseConfig from "./firebase";
import { getDatabase, push, ref, onValue } from "firebase/database";
import { useState } from "react";

function Header(props) {

    //Track form inputs
    const [userNameInput, setUserNameInput] = useState("");
    const [pinInput, setPinInput] = useState("");
    const [nameInput, setNameInput] = useState("");

    //Set a state variable to check if any username matches
    const [usersFound, setUsersFound] = useState([]);

    //States  to see if email, pin and name inputs are valid
    const [validEmail, setValidEmail] = useState(false);
    const [validPin, setValidPin] = useState(false);
    const [validName, setValidName] = useState(false);

    //Set a state variable to check if user exists
    const [userFound, setUserFound] = useState(false);

    //pass the info to App.js
    if (validPin && !userFound) {
        props.setIntro(false)
    } else {
        props.setIntro(true)
    }


    //function that takes care of the name input logic
    const handleUserNameInput = (e) => {
        const inputValue = e.target.value.toLowerCase();
        //Find matches in database
        const usersInArray = props.users.filter(
            (user) => user.email === inputValue
        );
        if (usersInArray.length > 0) {
            setUsersFound(usersInArray);
        } else {
            setUsersFound([]);
            props.setUser(null);
        }

        //validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setValidEmail(emailRegex.test(inputValue));

        //Clear pin input when using and set the new state
        setPinInput("");
        setUserNameInput(inputValue);
    };

    //function that takes care of the pin input logic
    const handlePinInput = (e) => {
        const inputValue = e.target.value;
        const pinInArray = usersFound.filter((user) => user.pin === inputValue);
        if (pinInArray.length) {
            setUserFound(true);
            props.setUser(pinInArray[0].node);
        } else {
            setUserFound(false);
            props.setUser(null);
        }

        //validate PIN format
        const pinRegex = /^[0-9]{4}$/;
        const pinValid = pinRegex.test(inputValue);
        setValidPin(pinValid);

        //Update input
        setPinInput(inputValue);
    };

    //Function to handle the name input
    const handleNewUserInput = (e) => {
        const inputValue = e.target.value;

        //validate name format
        const nameRegex = /^[a-z ,.'-]+$/i;
        setValidName(nameRegex.test(inputValue));

        //Update input
        setNameInput(inputValue);
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

        //listen for the new information from our database only once
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
            },
            { onlyOnce: true }
        );
    };

    return (
        <header className="header">
            {userFound
                ? null
                : (
                    <>
                        <h1>Just Shopping</h1>
                        <form className="user-info-form">

                            <div className="mail-group">
                                {validEmail || !userNameInput ? null : (
                                    <p className="mail-message">Please enter a valid email</p>
                                )}
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
                            </div>

                            <div className="pin-group">
                                {validPin || !pinInput ? null : (
                                    <p className="pin-message">Please enter a 4 digit number</p>
                                )}
                                <label htmlFor="pin-input" className="sr-only">
                                    Personal Identification Number (4 digits)
                                </label>
                                <input
                                    className="pin-input"
                                    type="password"
                                    inputmode="numeric"
                                    name="pin"
                                    id="pin-input"
                                    placeholder="4 digit pin"
                                    onChange={handlePinInput}
                                    value={pinInput}
                                    disabled={userNameInput === "" || !validEmail ? true : false}
                                    maxLength="4"
                                />
                            </div>
                        </form>
                    </>
                )
            }
            {userFound ? null : (
                <p className="login-legend">log in / New account</p>
            )}

            {validPin && !userFound ? (
                <aside className="user-not-found-container">
                    <p>User has not been found!</p>
                    <p>New user with this email and PIN?</p>

                    <form action="submit" className="new-user-form">
                        <div className="name-group">
                            {validName || !nameInput ? null : (
                                <p className="name-message">Please enter a Valid Name</p>
                            )}
                            <label htmlFor="name" className="sr-only">                            Name
                            </label>
                            <input
                                className="name-input"
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Just tell us your name"
                                onChange={handleNewUserInput}
                                value={nameInput}
                            />
                            <button
                                className="new-user-btn"
                                onClick={handleNewUserForm}
                                disabled={nameInput === "" || !validName ? true : false}
                            >
                                Submit
                            </button>
                            <h4 >We do not spam!</h4>
                            <p className="disclaimer">We use your email only to locate your shopping list.</p>
                        </div>
                    </form>
                </aside>
            ) : null}


        </header>
    );
}

export default Header;
