import ItemsList from "./ItemsList";

function Main(props) {
    console.log("The Main Component just rendered!");




    return (
        <main className="main-section">
            {props.node ? (
                <ItemsList userNode={props.node} />
            ) : (
                <p>Back to basics</p>
            )}
        </main>
    )
}

export default Main;
