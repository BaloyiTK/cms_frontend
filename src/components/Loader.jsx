import React from 'react'
import { BallTriangle } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
    <BallTriangle color="blue" height={80} width={80} />
  </div>
  )
}

export default Loader