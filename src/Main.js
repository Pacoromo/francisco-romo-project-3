import ItemsList from "./ItemsList"

function Main(props) {
    console.log("The Main Component just rendered!");
    // console.log("This is the node", props.node);
    return (
        props.node
            ? <ItemsList userNode={props.node}/>
            : <p>Back to basics</p>
    )
}

export default Main;