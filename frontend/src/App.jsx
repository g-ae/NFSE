import "./css/App.css";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewBundle from "./pages/NewBundle";
import RegisterBuyer from "./pages/RegisterBuyer";
import RegisterSeller from "./pages/RegisterSeller";
import { Routes, Route } from "react-router-dom";
import { BundleProvider } from "./context/BundleContext";
import NavBar from "./components/NavBar";

function App() {
  return (
    <BundleProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/new-bundle" element={<NewBundle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/buyer" element={<RegisterBuyer />} />
          <Route path="/register/seller" element={<RegisterSeller />} />
        </Routes>
      </main>
    </BundleProvider>
  );
}

export default App;



{/*Fargment*/}
{/*<> IF
      {movieNumber === 2 ? (
      <MovieCard movie={{title:"Film", release_date: "2024"}}/>)
      :
      (<MovieCard movie={{title:"Jhon", release_date: "2022"}}/>
    )}
    </> */}
{/* And 
  {movieNumber === 1 && ...} */}

  {/*Command
    - npm create vite@latest
    - npm install
    - npm run dev
    - npm install react-router-dom*/}