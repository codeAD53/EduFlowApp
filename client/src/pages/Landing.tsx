import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Sparkles, Target } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { motion } from "framer-motion"

const features = [
    {
        icon: <Sparkles size={22} className="text-indigo-400"/>,
        title: 'AI-Generated Roadmaps',
        description: 'Enter a topic and goal - get a complete structured learning path built by AI instantly.'
    },
    {
        icon: <Target size={22} className="text-purple-400"/>,
        title: "Goal Oriented",
        description: "Every roadmap is tailored to your specific goal, level, and available time."
    },
    {
        icon: <BarChart3 size={22} className="text-green-400"/>,
        title: 'Track Progress',
        description: "Mark topics as in progress or completed. Watch your progress bar grow week by week."
    },{
        icon: <BookOpen size={22} className="text-yellow-400"/>,
        title: 'Curated Resources',
        description: 'Each topic comes with videos, articles, docs and exercise - all in one place.'
    }
]

    const steps = [
        { step: '01', title: 'Enter your topic', description: 'Tell us what you want to learn and your goal' },
        { step: '02', title: 'AI builds the path', description: "Get a week-by-week structured roadmap instantly" },
        { step: '03', title: 'Learn and track', description: 'Follow the roadmap and mark your progress' }
    ]
const Landing = () => {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    const handleGetStarted = () => {
        if(isAuthenticated){
            navigate('/dashboard')
        }else{
            navigate('/register')
        }
    }
return (
    <div className="min-h-screen bg-gray-950 text-white">
        <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">EduFlow</h1>
            {isAuthenticated ? (
                <button onClick={()=>navigate('/dashboard')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm">Go to DashBoard</button>
            ): (
                <div className="flex items-center gap-3">
                    <button onClick={()=>navigate('/login')} className="text-gray-400 hover:text-white transition text-sm font-medium">Sign in</button>

                    <button onClick={()=>navigate('/register')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm">Get Started</button>
                </div>
            )}
        </div>
        </nav>

        {/* Hero  */}
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
            <motion.div 
                initial={{opacity: 0, y: 30}}
                animate={{opacity:1, y:0}}
                transition={{duration: 0.5}}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
                    <Sparkles size={14} className="text-indigo-400"/>
                    <span className="text-indigo-400 text-sm font-medium">AI-Powered Learning</span>
                    </div>

                    {/* Headline  */}
                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                        Learn anything with a{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                            personalized roadmap
                        </span>
                    </h1>

                    {/* SubHeadline  */}
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        EduFlow uses AI to generate structured, week-by-week learning roadmaps tailored to your goal, level, and schedule.
                    </p>

                    {/* CTA buttons  */}
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <button onClick={handleGetStarted} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition text-lg">Get Started Free <ArrowRight size={20} /></button>
                        <button onClick={()=> navigate('/login')} className="text-gray-400 hover:text-white font-semibold px-8 py-3.5 rounded-xl border border-gray-700 hover:border-gray-500 transition text-lg">
                            Sign in
                        </button>
                    </div>
                </motion.div>
        </section>

        {/* Features  */}
        <section className="max-w-6xl mx-auto px-6 py-16">
            <motion.div
                initial={{opacity: 0, y:20 }}
                animate={{opacity: 1, y:0 }}
                transition={{delay: 0.2}}
                className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-3">
                        Everything you need to learn faster
                    </h2>
                    <p className="text-gray-400">
                        Stop wasting time figuring out what to learn next.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {features.map((feature, index)=> (
                        <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-gray-900 border border-gray-800 rounded-2xl p-6
                         hover:border-indigo-500/30 transition">
                            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">{feature.icon}</div>

                            <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                         </motion.div>
                    ))}
                </div>
        </section>

        {/* How it works  */}
        <section className="max-w-6xl mx-auto px-6 py-16">
            <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
                    <p className="text-gray-400">Three steps to your personalized learning path</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step, index)=>(
                        <motion.div 
                             key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="text-center p-6">
                                <div className="text-5xl font-bold text-indigo-500/20 mb-4">{step.step}</div>
                                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                            </motion.div>
                    ))}
                </div>
        </section>

        {/* CTA section  */}
        <section className="max-w-6xl mx-auto px-6 py-16">
            <motion.div
                 initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-linear-to-r from-indigo-500/10 to-purple-500/10
                     border border-indigo-500/20 rounded-3xl p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to start learning?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Join EduFlow and get your first AI-generated roadmap in seconds.
                        </p>

                        <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
                            {['Free to use', 'No credit card', 'Instant roadmap'].map(item=>(
                                <div key={item} className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-green-400" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleGetStarted} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition mx-auto">Get Started Free
                            <ArrowRight size={20} />
                        </button>
                     </motion.div>
        </section>

        {/* Footer  */}
        <footer className="border-t border-gray-800 py-8">
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <p className="text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} EduFlow. Built By Aditya
                </p>
                <p className="text-gray-700 text-sm">
                    AI-Powered Learning Platform
                </p>
            </div>
        </footer>
    </div>
)
}
export default Landing