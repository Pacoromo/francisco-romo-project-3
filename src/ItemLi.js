//import firebaseConfig from "./firebase"
//import { getDatabase, push, ref, onValue, remove } from "firebase/database";
//import { useState, useEffect } from "react";
import Checkbox from "./Checkbox";
import Qtyinput from "./Qtyinput";

function ItemLi(props) {
    console.log("The ItemsLi Component just rendered!");

    //Set the items quantity
    // [quantity, setQuantity] = useState(1);

    //Handle the active state of an item 
    //

    return (
        <div className="list-item-container">
            {props.items.map((item) => {
                const { key = item, name = item.item.name, qty = item.item.qty, state = item.item.state } = item
                return (
                    <li key={key}>
                        <Checkbox userNode={props.userNode} itemNode={key} name={name} state={state} />
                        <Qtyinput userNode={props.userNode} itemNode={key} name={name} qty={qty} />
                    </li>
                );
            })}
        </div>
    )
}


export default ItemLi;




















/*
{items.map((item) => {
    const { key, name = item.item.name, qty = item.item.qty, state = item.item.state } = item
    return (
        <li key={key}> 
            <p>{name}</p>
            <p>Qty: {qty}</p>
            <p>{state.toString()}</p>
        </li>
    );
})}
*/