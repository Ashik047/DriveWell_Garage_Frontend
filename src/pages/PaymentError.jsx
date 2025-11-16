import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import "./PaymentError.css"

const PaymentError = () => {
    return (
        <>
            <Header />
            <main className='PaymentError h-screen w-full flex flex-col text-center items-center justify-center min-h-[300px] p-6'>
                <img src="/paymentFailed.webp" alt="Payment failed" className='w-[300px]' />
                <p className='text-3xl font-bold'>Payment Failed</p>
                <p className='mt-3 text-dim-black'>You can head back home and retry later.</p>
                <Link to={"/"} className='hover:bg-accent text-white px-4 py-1 rounded-lg mt-4 text-2xl bg-black inline-block mb-10'><FontAwesomeIcon icon={faArrowRight} /></Link>
            </main>
        </>
    )
}

export default PaymentError