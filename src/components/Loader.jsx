import React from 'react';
import styled from 'styled-components';
import "./Loader.css";

const Loader = () => {
    return (
        <main className='grow flex items-center justify-center w-full min-h-[240px] h-[70vh]'>
            <div className="terminal-loader">
                <div className="terminal-header">
                    <div className="terminal-title">Status</div>
                    <div className="terminal-controls">
                        <div className="control close"></div>
                        <div className="control minimize"></div>
                        <div className="control maximize"></div>
                    </div>
                </div>
                <div className="content">
                    <div className="text">Loading...</div>
                </div>
            </div>

        </main>
    );
}

export default Loader;
