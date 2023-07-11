import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { perksList } from "../assets/perksList";
import axios from "axios";

export default function PlacesPage() {
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const { action } = useParams();
 

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

    async function addPhotoByLink(e) {
        e.preventDefault();
        const {data: filename} = await axios.post('/upload-by-link', {link: photoLink});
        setAddedPhotos(prv => {
           return [...prv, filename];
        })
        setPhotoLink('');
    };

    function uploadPhoto(e) {
        const files = e.target.files;
        const data = new FormData();
        for (let file of files){
            data.append('photos', file)
        }

        axios.post('/upload', data, {
            headers: {'Content-type': 'multipart/form-data'},
        }).then(res => {
            const {data: filenames} = res;
            setAddedPhotos(prv => {
                return [...prv, ...filenames];
             })
        });
    }

    function perksHandle(e) {
        const { checked, name } = e.target;
        if(checked){
            setPerks(perk =>[...perk, name]);
        }else{
            setPerks(perk => perk.filter(unsel => unsel !== name))
        }
    }

    // perksHandle()

    return(
        <div className="mx-20">
            {action !== 'new' && (
                <div className="text-center">
                <Link className="inline-flex gap-2 bg-primary text-white py-2 px-6 rounded-full" 
                    to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg> Add new place
                </Link>
            </div>
            )}
            {action === 'new' && (
                <div>
                    <form className="">
                        {perInput('Title', 'Title for your place, it must be catchy as in advertisement')}
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title, ex: my lovely apt"/>
                        {perInput('Address', 'Address to this place')}
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="address" />
                        {perInput('Photos', 'Best pictures')}
                        <div className="flex gap-2">
                            <input type="text" 
                                value={photoLink}
                                onChange={e => setPhotoLink(e.target.value)}
                                placeholder="Add using a link .... jpg"/>
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photos</button>
                        </div>
                        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {addedPhotos.length > 0 && addedPhotos.map(photo => (
                                <div className="h-32 flex" key={photo}>
                                    <img className="rounded-2xl w-full object-cover" src={`http://localhost:4000/upload/${photo}`} alt="" />
                                </div>
                            ))}
                            <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                                <input type="file" multiple className="hidden" onChange={uploadPhoto}/> 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                </svg>
                                Upload
                            </label>
                        </div>
                        {perInput('Description', 'description of the place')}
                        <textarea placeholder="this place is very great"
                            value={description} 
                            onChange={e => setDescription(e.target.value)}/>
                        {perInput('Perks', 'select all the perks of your place')}
                        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            {perksList.map((perks) => {
                                return(
                                    <label className="border p-4 flex rounded-2xl gap-2 item-center cursor-pointer">
                                        <input type="checkbox" name={perks.perks.toLocaleLowerCase()} value={perks.perks} onChange={perksHandle}/>
                                        {perks.icon}
                                        <span>{perks.perks}</span>
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
            )}
        </div>
    );
};