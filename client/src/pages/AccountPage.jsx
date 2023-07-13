import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function AccountPage() {
    const [redirect, setRedirect] = useState('')
    const {user, ready, setUser} = useContext(UserContext);
    let { subpage } = useParams();
    if(subpage === undefined){
        subpage = 'profile'
    }

    async function logout() {
        await axios.post('/logout');
        setUser(null);
        setRedirect('/');
    }
    
    if(!ready){
        return 'Loading ...'
    }

    if(ready && !user && !redirect){
        return <Navigate to={'/login'} />
    }

    
    if(redirect) {
        return <Navigate to={redirect} />
    };
    
    return(
        <div>
            <AccountNav />
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email}) <br/>
                    <button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
                </div>
            )}
            {subpage === 'places' && (<PlacesPage />)}
        </div>
    );
};