import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContect";
import Loader from '../components/Loader'




export const ProtectRoute = () => {

    const {user , loading} = useAuth();

    if(loading)return <Loader/>

    if(!loading){
        return user ? <Outlet/> : <Navigate to="/login"/>;
    }
}



export const UnProtectRoute = () => {

    const {user , loading} = useAuth();

    if(loading)return <Loader/>
    return !user ? <Outlet/> : <Navigate to="/"/>;
}   