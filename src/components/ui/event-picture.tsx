import React, { useState } from 'react'
import { Label } from './label';


const EVENT_PICTURES = [
    { src: "/peekingpidgey/logo-bulbasaur.png", label: "logo1" },
    { src: "/peekingpidgey/logo-nidoran.png", label: "logo2" },
    { src: "/peekingpidgey/logo-pichu.png", label: "logo3" },
    { src: "/peekingpidgey/logo-poliwal.png", label: "logo4" },
    { src: "/peekingpidgey/logo-puff.png", label: "logo5" },
]


const EventPicture = () => {
    const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
    return (
        <div>
            <Label>Event Picture (For Pro users)</Label>
            <div className="flex flex-wrap gap-3">
                {EVENT_PICTURES.map(({ src, label }, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`size-10 flex items-center justify-center text-xl transition-all rounded-md ${selectedPicture === src
                            ? 'bg-brand-100 ring-2 ring-brand-700 scale-110'
                            : 'bg-brand-100 hover:bg-brand-200'
                            }`}
                        onClick={() => setSelectedPicture(src)}
                    >
                        <img
                            src={src}
                            alt={label}
                            className="w-8 h-8 object-cover rounded-full"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default EventPicture