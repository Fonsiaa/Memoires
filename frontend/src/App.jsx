// the main application component that manages the whole app
import { Routes } from "react-router-dom";
import Navbar from "./parts/Header";

import { AuthForm } from "./Webpage/AuthForm";
import { Profile } from "./Webpage/Profile";
import { Home } from "./Webpage/Home";
import { Favourites} from "./Webpage/Favourite";
import { Admin } from "./Webpage/Admin";

import "./styles/main.scss";

function App() {

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth" element={<AuthForm />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
    );
}

export default App;