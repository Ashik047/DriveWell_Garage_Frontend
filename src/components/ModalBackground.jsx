import React from 'react'

const ModalBackground = ({ zIndex }) => {
    return (
        <div className={`w-full h-full bg-dim-black opacity-60 z-${zIndex} fixed inset-0`}></div>
    )
}

export default ModalBackground