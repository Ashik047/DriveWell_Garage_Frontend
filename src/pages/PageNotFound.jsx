import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <main className='flex w-full h-screen flex-col items-center justify-center'>
            <img src="/page-not-found-404.gif" alt="page not found" className='w-full lg:w-[700px] aspect-auto object-cover object-center -mt-18' />
            <Link to={"/"} className='w-fit rounded-md px-4 py-2 bg-accent text-white font-semibold hover:opacity-75'>Home Page</Link>
        </main>
    )
}

export default PageNotFound