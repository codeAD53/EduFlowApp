import { LogOut } from "lucide-react";

interface NavbarProps {
  userName?: string;
  onLogout?: () => void;
  showLogout?: boolean;
}

const Navbar = ({userName, onLogout, showLogout = false}: NavbarProps) => {
    return (
            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">EduFlow</h1>
                <div className="flex items-center gap-4">
                    {userName && (
                    <span className="text-gray-400 text-sm">
                        Hey, {" "}<span className="text-white font-medium">{userName}</span>
                    </span>   
                    )}

                    {showLogout && onLogout && (
                         <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
                        <LogOut size={16} />
                        Logout
                        </button>
                    )
                    }
                   
                </div>
            </div>
            </nav>
        
    )
}

export default Navbar