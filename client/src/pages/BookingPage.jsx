import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "./AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "./BookingDates";

function BookingPage() {
    const [booking, setBooking] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if(id){
            axios.get('/bookings')
                .then(res => {
                    const foundBooking = res.data.find(({_id}) => _id === id)
                    if(foundBooking){
                        setBooking(foundBooking)
                    }
                })
        }
    }, [id]);
    
    if(!booking) return '';

    return ( 
        <div className="my-8">
            <h1 className="text-3xl">{booking.place.title}</h1>
            <AddressLink place={booking.place}/>
            <div className="bg-gray-200 p-4 rounded-2xl my-3 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl mb-2">Your booking information</h2>
                    <BookingDates booking={booking} />
                </div>
                <div className="bg-primary text-white rounded-2xl p-6">
                    <div>Total price</div>
                    <div className="text-3xl">${booking.price}</div>
                </div>
            </div>
            <PlaceGallery place={booking.place} />
        </div>
     );
}

export default BookingPage;