import Login from '../components/user/Login'
import App from '../App';

const ProtectedRoutes = () => {
    let token=localStorage.getItem("CC_Token");
     console.log("token est " + token)
    return(
    token!=null ? <><App/></>: <Login/>
    )
    }
    export default ProtectedRoutes;
