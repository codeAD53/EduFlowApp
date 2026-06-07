import { type ReactNode } from 'react'
import {motion} from 'framer-motion'

interface EmptyStateProps {
   icon: ReactNode,
   title: string,
   description: string,
   buttonText?: string,
   onButtonClick?: () => void;
}
const EmptyState = ({
    icon, 
    title, 
    description,
    buttonText,
    onButtonClick
}: EmptyStateProps) => {
  return (
    <motion.div
                         initial = {{ opacity: 0, y: 20}}
                         animate = {{opacity: 1, y: 0}}
                         className="text-center py-20"
                         >
                            <div className="flex justify-center mb-4">
                                {icon}
                            </div>
                        
                            <h3 className="text-gray-300 text-lg font-medium">{title}</h3>
                            <p className="text-gray-500 text-sm mt-1 mb-6">
                                {description}
                            </p>
                            {buttonText && onButtonClick && (
                                <button onClick={onButtonClick} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition">{buttonText}</button>
                            )}
    </motion.div>
      
    
  );
};

export default EmptyState
