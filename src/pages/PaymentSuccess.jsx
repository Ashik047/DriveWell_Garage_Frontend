import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import "./PaymentSuccess.css"

const PaymentSuccess = () => {
    return (
        <>
            <Header />
            <main className='PaymentSuccess w-full flex flex-col text-center items-center justify-center min-h-[300px] p-6'>
                <img src="/paymentSuccess.gif" alt="Payment success" className='lg:w-[300px]' />
                <p className='text-3xl font-bold'>Payment Successful</p>
                <p className='mt-3 text-dim-black'>Go back home to explore more.</p>
                <Link to={"/"} className='hover:bg-accent text-white px-4 py-1 rounded-lg mt-4 text-2xl bg-black inline-block mb-10'><FontAwesomeIcon icon={faArrowRight} /></Link>
            </main>
        </>
    )
}

export default PaymentSuccess