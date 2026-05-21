import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App(){
  return(
    <BrowserRouter>
    <Toaster position="top-right" />
    <div>Eduflow coming soon....</div>
    </BrowserRouter>
    
  )
}

export default App