import { SquarePen, Trash } from 'lucide-react'
import React from 'react'

const Service = React.memo(({ service, handleEditService, handleServicesDelete, deletePending, role }) => {

    return (
        <div className="shadow-[5px_5px_10px_1px_#cdcdcd] p-4 max-w-[3200px] mx-auto">
            <img src={service?.image?.url} alt={service?.serviceName} className="w-full aspect-3/2 object-cover object-center" />
            <h3 className="font-bold text-xl mt-4">{service?.serviceName}</h3>
            <p className="text-dim-black text-sm mt-2">{service?.description}</p>
            <p className="text-accent font-medium mt-4">Starting at $<span>{service?.price}</span></p>
            {(role === "Manager") && <div className='p-1 text-right'><button aria-label="Edit service" className='cursor-pointer' onClick={() => handleEditService?.(service)}><SquarePen size={17} className='text-blue-700 me-3' /></button><button aria-label="Delete service" className='cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={deletePending} onClick={() => handleServicesDelete?.(service?._id)}><Trash size={17} className='text-red-600' /></button></div>}
        </div>
    )
})

export default Service