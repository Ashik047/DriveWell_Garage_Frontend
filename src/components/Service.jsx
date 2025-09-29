import { faUser } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from 'react'

const Service = React.memo(({ service }) => {
    return (
        <div className="shadow-[5px_5px_10px_1px_#cdcdcd] p-6">
            <p className="w-[40px] text-accent aspect-square rounded-md bg-blue-100 grid place-content-center"><service.icon className="font-extrabold text-xl" /></p>
            <h3 className="font-bold text-xl mt-4">{service.name}</h3>
            <p className="text-dim-black text-sm mt-2">{service.description}</p>
            <p className="text-accent font-medium mt-4">Starting at $<span>{service.price}</span></p>
        </div>
    )
})

export default Service