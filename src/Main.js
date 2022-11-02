import ItemsList from "./ItemsList";

function Main(props) {

    return (
        <main className="main-section">
            {props.node ? (
                <ItemsList userNode={props.node} />
            ) : props.intro ? (
                <div className="intro-paragraph">
                    <h3>Back to basics</h3>
                    <p>A practical shopping list.</p> 
                    <p>As simple and useful as it should be.</p>
                </div>
            ) : null}
        </main>
    );
}

export default Main;
