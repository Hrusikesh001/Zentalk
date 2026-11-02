import React from 'react'
import Lottie from 'lottie-react';
import animationData from '../assets/loading.json'; 

function Loading() {
  return (
    <>
      <div className='flex h-screen items-center justify-center bg-gray-900'>
        <div style={{ width: 250, height: 250 }}>
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{
              width: 250,
              height: 250,
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Loading