import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Webpage/home";
import Projects from "./Webpage/upload";
import Social from "./Webpage/signin";

function App () {
    return (
        <>
        
        <Router>
            <Routes>
                {/*This will link to the Feed */}
                <Route path="/" element={<Home/>} />

                {/*This will link  to the ProjectPage */}
                <Route path="/projects" element={<Projects/>} />

                {/*This will link to the Sign In page */}
                <Route path="/connecting" element={<Social/>} />
            </Routes>
        </Router>
        </>
    );
}

export default App;