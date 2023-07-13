import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PlacesPage() {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/places')
            .then(({data}) => {
                setPlaces(data);
            })
    }, []);

    return(
        <div className="mx-20">
            <AccountNav />
                <div className="text-center">
                    <p>list of all places</p>
                <Link className="inline-flex gap-2 bg-primary text-white py-2 px-6 rounded-full" 
                    to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg> Add new place
                </Link>
                <div className="mt-4">
                    {places.length && places.map((place) => (
                        <Link to={`/account/places/${place._id}`} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                            <div className="w-32 h-32 bg-gray-300 grow shrink-0">
                                {place.photos.length && (
                                    // <img src={`http://localhost:4000/upload/${place.photos[0]}`}></img>
                                    <img src={place.photos[0]} alt="" />
                                )}
                            </div>
                            <div className="grow-0 shrink text-left">
                                <h2 className="text-xl">{place.title}</h2>
                                <p className="text-sm mt-2">{place.address} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est vel dolorem facilis quia dolores corrupti et voluptate distinctio esse ex, consectetur laborum itaque! Omnis, eaque? Aut dignissimos facilis modi iusto!</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};