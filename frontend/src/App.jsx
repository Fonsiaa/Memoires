// the main application component that manages the whole app
import { AuthForm } from "./Webpage/AuthForm";
import { Dashboard } from "./Webpage/Dashboard";
import { Home } from "./Webpage/Home";
import { Toast, Button } from "./parts/UI";
import "./styles/main.scss";

function App() {

    return (
        <div>
            <Home />
            <AuthForm />
            <Dashboard />
            <Toast />
        </div>
    );
}

export default App;