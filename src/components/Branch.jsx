import { faLocationPin, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Branch = ({ branch }) => {
    return (
        <div className='w-full shadow-[5px_5px_10px_1px_#cdcdcd] px-4 py-6'>
            <h4 className='font-bold text-lg'>{branch?.branchName}</h4>
            <p className='text-dim-black'><FontAwesomeIcon icon={faLocationPin} className='me-2 mt-3' />{branch?.location}</p>
            <p className='text-dim-black'><FontAwesomeIcon icon={faPhone} className='me-2 mt-1' />{branch?.phone}</p>
            <a href={`https://maps.google.com?q=${branch?.latitude},${branch?.longitude}`} target='_blank' className='bg-accent hover:opacity-75 px-4 py-2 w-[150px] text-center font-semibold text-white block mt-4 rounded-md'>Get Directions</a>
        </div>
    )
}

export default Branch