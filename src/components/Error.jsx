import React from 'react'
import "./Error.css";

const Error = () => {
    return (
        <main className='grow flex justify-center items-center w-full min-h-[240px] h-[70vh]'>
            <div className="tv-container my-10">
                <div className="tv-screen">
                    <div className="static"></div>
                    <div className="error-text">ERROR</div>
                </div>
                <div className="tv-stand"></div>
            </div>

        </main>
    )
}

export default Error