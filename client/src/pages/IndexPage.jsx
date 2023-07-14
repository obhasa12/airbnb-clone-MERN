import axios from "axios";
import { useEffect, useState } from "react";

export default function IndexPage() {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/places')
            .then((data) => setPlaces([...data.data, ...data.data, ...data.data, ...data.data]))
    }, []);

    return(
        <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-4 lg:grid-cold-6">
           {places.length && places.map(place => (
            <div>
                <div className="bg-gray-500 mb-2 rounded-2xl flex">
                    {place.photos?.[0] && (
                        <img  className="rounded-2xl aspect-square object-cover" src={`http://localhost:4000/upload/${place.photos?.[0]}`} alt="" />
                    )}
                </div>
                <h2 className="font-bold leading-4 truncate">{place.address}</h2>
                <h2 className="text-sm truncate text-gray-500">{place.title}</h2>
                <div className="mt-1">
                    <span className="font-bold">${place.price}</span> per night
                </div>
            </div>
           ))}
        </div>
    );
}