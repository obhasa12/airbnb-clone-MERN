import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState('');

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get(`/places/${id}`)
            .then((res) => setPlace(res.data));  
    },[id]);

    return ( 
        <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
            <h1 className="text-3xl">{place.title}</h1>
            <a className="my-2 block font-semibold underline" target="_blank" href={`https://maps.google.com/?q=${place.address}`}>{place.address}</a>
            <div className="grid gap-2 grid-cols-[2fr_1fr]">
                <div>
                    {place.photos && (
                    <div>
                        <img className="aspect-square object-cover" src={`http://localhost:4000/upload/${place.photos?.[0]}`} alt="" />
                    </div>
                    )}
                </div>
                <div className="grid">
                    {place.photos && (
                    <img className="aspect-square object-cover" src={`http://localhost:4000/upload/${place.photos?.[1]}`} alt="" />)}
                    <div className="overflow-hidden">
                        {place.photos && (
                        <img className="aspect-square object-cover relative top-2" src={`http://localhost:4000/upload/${place.photos?.[2]}`} alt="" />)}
                    </div>
                </div>
            </div>
        </div>
     );
}

export default PlacePage;