import React from "react"
import { useNavigate } from "react-router-dom";
import { BarChart3, BookIcon, Clock, Sparkles, Target } from "lucide-react";
import { motion } from 'framer-motion'
import Loader from "../components/common/Loader";
import { useGenerateRoadmap } from "../hooks/useGenerateRoadmap";
import PageHeader from "../components/layout/PageHeader";
const levels = ['beginner', 'intermediate', 'advanced'];
const durations = ['1 week', '2 weeks', '4 weeks', '6 weeks', '8 weeks', '3 months'];

const Generate = () => {
    const navigate = useNavigate();
    const { formData, isLoading, handleChange, handleSelect, generate } = useGenerateRoadmap();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const roadmap = await generate();
        if (roadmap) {
            navigate(`/roadmap/${roadmap.roadmap_id}`);
        }
    }
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <PageHeader
                title="Generate Roadmap"
                onBack={() => navigate("/dashboard")}
            />
            <div className="max-w-3xl mx-auto px-6 py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 ">
                        <Sparkles size={24} className="text-indigo-400" />
                        AI Roadmap Generator
                    </h2>
                    <p className="text-gray-400 mt-2">
                        Tell us what you want to learn - AI will build a structured roadmap for you.
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Topic */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                                <BookIcon />
                                What do you want to learn?
                            </label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. React, Machine Learning, System Design" required disabled={isLoading} maxLength={100} minLength={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed" />
                        </div>

                        {/* Goal */}
                        <div>
                            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-400">
                                <Target size={14} />
                                What is your goal?
                            </label>
                            <textarea name="goal" value={formData.goal} onChange={handleChange} placeholder="e.g. Build production ready React apps with TypeScript" required disabled={isLoading} rows={3} maxLength={300} minLength={10} className="w-full bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 rounded-lg
                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:cursor-not-allowed" />
                        </div>

                        {/* Level */}
                        <div>
                            <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-400">
                                <BarChart3 size={14} />
                                Your current level
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {levels.map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => handleSelect('level', level)}
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
                                <Clock size={14} />
                                How long do you have?
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {durations.map(duration => (
                                    <button key={duration} type="button"
                                        onClick={() => handleSelect('duration', duration)} disabled={isLoading} className={`py-3 rounded-lg border text-sm font-semibold transition disabled:cursor-not-allowed ${formData.duration === duration ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-indigo-500/50'}`}>{duration}</button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition flex items-center justify-center gap-2">{
                            isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader inline size='sm' />
                                    Generating your roadmap...
                                </div>

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