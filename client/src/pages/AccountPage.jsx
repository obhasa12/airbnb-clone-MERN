import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate } from "react-router-dom";

export default function AccountPage() {
    const {user, ready} = useContext(UserContext);

    if(!ready){
        return 'Loading ...'
    }

    if(ready && !user){
        return <Navigate to={'/login'} />
    }

    return(
        <div>
            <nav className="w-full flex justify-center mt-8 gap-2">
                <Link className="py-2 px-6 bg-primary text-white rounded-full" to={'/account'}>My profile</Link>
                <Link className="py-2 px-6 " to={'/account/booking'}>My booking</Link>
                <Link className="py-2 px-6 " to={'/account/places'}>My accommodation</Link>
            </nav>
        </div>
    );
};