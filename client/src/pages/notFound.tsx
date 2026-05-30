import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';
const NotFound = () => {
    const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-950 flex items-center justify-center text-white'>
        <motion.div 
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            className='text-center'>
                <p className="text-6xl font-bold text-indigo-500/20 mb-4">404</p>
                <h1 className="text-2xl font-bold text-white mb-2">Page not Found</h1>
                <p className="text-gray-500 mb-8">The Page you're looking for doesn't exist</p>
                <button onClick={()=>navigate('/')} className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition'>Go Home</button>
            </motion.div>
    </div>
  )
}

export default NotFound
