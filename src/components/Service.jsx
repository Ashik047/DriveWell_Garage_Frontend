import React from 'react'

const Service = React.memo(({ service }) => {

    return (
        <div className="shadow-[5px_5px_10px_1px_#cdcdcd] p-6">
            <img src="" alt="" className="w-full aspect-3/2 object-cover object-center" />
            <h3 className="font-bold text-xl mt-4">{service.name}</h3>
            <p className="text-dim-black text-sm mt-2">{service.description}</p>
            <p className="text-accent font-medium mt-4">Starting at $<span>{service.price}</span></p>
        </div>
    )
})

export default Service