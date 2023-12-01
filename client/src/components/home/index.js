import { Link } from "react-router-dom";
import "./index.css";

function Home({ problems }) {
  return (
    <>
      <h2>Problems</h2>
      {problems &&
        problems.map((problem) => (
          <div className="problem-container">
            <h2 className="problem-id">{problem.pid}</h2>
            <Link to={`/solve/${problem.pid}`} className="problem-link">
              <h2 className="problem-title">{problem.title}</h2>
            </Link>
          </div>
        ))}
    </>
  );
}

export default Home;
