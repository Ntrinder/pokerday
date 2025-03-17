import { BrowserRouter, Route, Routes } from "react-router-dom";
import EstimatePage from "./pages/EstimatePage.tsx";
import HomePage from "./pages/HomePage.tsx";

function App() {

  return (
    <div className={'container'}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/estimate" element={<EstimatePage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
