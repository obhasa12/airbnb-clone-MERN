import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function BookingWidget({place}) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if(user){
            setName(user.name);
        }
    }, [user]);

    let numberOfNight = 0;
    if(checkIn && checkOut){
        numberOfNight = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    };

    async function bookThisPlace() {
        const data = { 
            checkIn, checkOut, numberOfGuests, name, phone: mobile, place:place._id,
            price: numberOfNight * place.price,
        }
        const response = await axios.post('/bookings', data);

        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    };

    if(redirect){
        return <Navigate to={redirect} />
    }

    return ( 
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4">
                        <label htmlFor="">Check in:</label>
                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}/>
                    </div>
                    <div className="py-3 px-4 border-l">
                        <label htmlFor="">Check out:</label>
                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}/>
                    </div>
                </div>
                <div className="py-3 px-4 border-l">
                    <label htmlFor="">Number of guests:</label>
                    <input type="number" value={numberOfGuests} onChange={(e) => setNumberOfGuests(e.target.value)}/>
                </div>
                {numberOfNight > 0 && (
                    <div className="py-3 px-4 border-l">
                        <label htmlFor="">Your full name :</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                        <label htmlFor="">Your phone number :</label>
                        <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)}/>
                    </div>
                )}
            </div>
            <button onClick={bookThisPlace} className="mt-4 primary">
                Book this place
                {numberOfNight > 0 && (
                    <span> for ${ numberOfNight * place.price }</span>
                )}
            </button>        
        </div>
     );
}

export default BookingWidget;