import React, {useState, type ChangeEvent} from "react"
import { useNavigate } from "react-router-dom";
import { generateRoadmap } from "../services/roadmap.services";
import toast from "react-hot-toast";
import { ArrowLeft, BarChart3, BookIcon, Clock, Sparkles, Target } from "lucide-react";
import {motion} from 'framer-motion'
const levels = ['beginner', 'intermediate', 'advanced'];
const durations = ['1 week', '2 weeks', '4 weeks', '6 weeks', '8 weeks','3 months'];
const initialForm = {
    title: '',
    goal: '',
    level: '',
    duration: ''
}

const Generate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialForm);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev)=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleSelect = (field: string, value: string) => {
        setFormData((prev)=>({...prev, [field]: [value]}));
    }
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        if(isLoading) return;
        if(!formData.level){
            toast.error("Please select a level");
            return
        }
        if(!formData.goal){
            toast.error("Please select a goal");
            return
        }
        if(!formData.duration){
            toast.error("Please select a duration");
            return
        }
        setIsLoading(true);
        try {
            const roadmap = await generateRoadmap(formData);
            toast.success('Roadmap generated successfully!')
            navigate(`/roadmap/${roadmap.roadmap_id}`)
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate the roadmap. Try again");
        } finally {
            setIsLoading(false);
        }
    }
return (
<div className="min-h-screen bg-gray-950 text-white">
    <nav className="border border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
            <button onClick={()=> navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
                <ArrowLeft size={20} /> </button>
                <h1 className="text-xl font-bold text-white">Generate Roadmap</h1>
        </div>
    </nav>
    <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div 
            initial={{opacity: 0, y:20}}
            animate={{opacity: 0, y:0}}
            className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 ">
                    <Sparkles size={24} className="text-indigo-400"/>
                    AI Roadmap Generator
                </h2>
                <p className="text-gray-400 mt-2">
                    Tell us what you want to learn - AI will build a structured roadmap for you.
                </p>
        </motion.div>

        {/* Form */}
        <motion.div 
        initial={{ opacity: 0, y:20 }}
        animate={{ opacity: 1, y:0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Topic */}
                <div> 
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <BookIcon />
                    What do you want to learn?
                    </label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. React, Machine Learning, System Design" required disabled={isLoading} className="w-full bg-gray-800 border-gray-700 rounded-lg ox-4 py-3 text-white placeholder-gray-500  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed" /> 
                </div>

                {/* Goal */}
                <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-400">
                        <Target size={14}/>
                        What is your goal?
                    </label>
                    <textarea name="goal" value={formData.goal} onChange={handleChange} placeholder="e.g. Build production ready React apps with TypeScript" required disabled={isLoading} rows={3} className="w-full bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 rounded-lg
                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:cursor-not-allowed" />
                </div>

                {/* Level */}
                <div> 
                    <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-400">
                        <BarChart3 size={14} />
                        Your current level
                    </label> 
                    <div className="grid grid-cols-3 gap-3">
                        {levels.map(level=>(
                            <button
                                key={level}
                                type="button"
                                onClick={()=>handleSelect('level',level)}
                                disabled={isLoading}
                                className={`py-3 rounded-lg border text-sm font-medium capitalize transition disabled:cursor-not-allowed ${formData.level === level ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-indigo-500/50'}`}>
                                    {level}
                                </button>
                        ))}
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-400 mb-3 gap-2">
                        <Clock size={14}/>
                        How long do you have?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {durations.map(duration=>(
                            <button key={duration}type="button"
                            onClick={() => handleSelect('duration',duration)} disabled={isLoading} className={`py-3 rounded-lg border text-sm font-semibold transition disabled:cursor-not-allowed ${formData.duration ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-indigo-500/50'}`}>{duration}</button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition flex items-center justify-center gap-2">{
                    isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            </svg>
                            Generating your roadmap...
                        </>
                    ) : (
                        <>
                        <Sparkles size={18} />
                        Generate Roadmap
                        </>
                    )
                    }</button>

                    {isLoading && (
                        <p className="text-center text-gray-500 text-sm">
                            AI is building your personalized roadmap. This takes 10-15 seconds...
                        </p>
                    )}
            </form>
        </motion.div>
    </div>
</div>
)
}

export default Generate