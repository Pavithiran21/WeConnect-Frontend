/* eslint-disable react/jsx-no-undef */
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { Login } from './Components/Basic/login';
import { Signup } from './Components/Basic/signup';
import { Forgot } from './Components/Basic/forgot';
import { Reset } from './Components/Basic/reset';
import { ToastContainer } from 'react-toastify';
import { AllChat } from './Components/Chats/AllChat';
import { Conversation } from './Components/Chats/Conversation';






function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <ToastContainer/>
        
          <Routes>         
            <Route path='/' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/reset' element={<Forgot/>}/>
            <Route path='/reset/:resetToken' element={<Reset/>}/>
            <Route path='/all-chats' element={<AllChat/>}/>
            <Route path='/all-message/:chatId' element={<Conversation/>}/>
          </Routes>

      
      </BrowserRouter>
     
    </div>
  );
}

export default App;
