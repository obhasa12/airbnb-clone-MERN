import { useEffect, useState } from "react";
import { perksList } from "../assets/perksList";
import { Navigate, useParams } from "react-router-dom";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNav from "../AccountNav";

function PlacesFormPage() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if(!id){
            return
        }
        axios.get(`/places/${id}`)
            .then((res) => {
                const { data } = res;
                setTitle(data.title);
                setAddress(data.address);
                setDescription(data.description);
                setPerks(data.perks);
                setAddedPhotos(data.photos);
                setExtraInfo(data.extraInfo);
                setCheckIn(data.checkIn);
                setCheckOut(data.checkOut);
                setMaxGuests(data.maxGuests);

            })
    }, [id])

    // console.log(perks.includes("pets"))
   

    function inputHeader(text) {
        return <h2 className="text-2xl mt-4">{text}</h2>
    };

    function inputDescription(text) {
        return <p className="text-gray-500 text-sm">{text}</p>
    }

    function perInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }

    function perksHandle(e) {
        const { checked, name } = e.target;
        if(checked){
            setPerks(perk =>[...perk, name]);
        }else{
            setPerks(perk => perk.filter(unsel => unsel !== name))
        }
    };

    async function addNewPlace(e) {
        e.preventDefault();
        const placeData = {title, address, 
            addedPhotos, description, 
            perks, extraInfo, checkIn, 
            checkOut, maxGuests
        }
        await axios.post('/places', placeData);
        setRedirect(true)
    };

    if(redirect){
        return <Navigate to={'/account/places'} /> 
    }

    return ( 
        <div>
            <AccountNav />
            <form className='mx-20' onSubmit={addNewPlace}>
                {perInput('Title', 'Title for your place, it must be catchy as in advertisement')}
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title, ex: my lovely apt"/>
                        {perInput('Address', 'Address to this place')}
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="address" />
                        {perInput('Photos', 'Best pictures')}
                        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                        {perInput('Description', 'description of the place')}
                        <textarea placeholder="this place is very great"
                            value={description} 
                            onChange={e => setDescription(e.target.value)}/>
                        {perInput('Perks', 'select all the perks of your place')}
                        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            {perksList.map((perksData) => {
                                return(
                                    <label className="border p-4 flex rounded-2xl gap-2 item-center cursor-pointer" key={perks.perks}>
                                        <input type="checkbox" 
                                            name={perksData.perks.toLocaleLowerCase()} 
                                            // value={perks}
                                            checked={perks.includes(perksData.perks.toLowerCase())}
                                            onChange={perksHandle} />
                                        {perksData.icon}
                                        <span>{perksData.perks}</span>
                                    </label>
                                );
                            })}
                        </div>
                        {perInput('Extra info', 'house rules, etc')}
                        <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)}/>
                        {perInput('Check in&out times', 'add check in and out times, remember to have some time window for cleaning the room between guests')}         
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-1">Check in time</h3>
                                <input type="text" 
                                    value={checkIn} 
                                    onChange={e => setCheckIn(e.target.value)} 
                                    placeholder="14"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Check out time</h3>
                                <input type="text" 
                                    placeholder="11" 
                                    value={checkOut}
                                    onChange={e => setCheckOut(e.target.value)}/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                                <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)}/>
                            </div> 
                        </div>      
                            <button className="primary my-4">Save</button>
                    </form>
                </div>               
                        
     );
}

export default PlacesFormPage;