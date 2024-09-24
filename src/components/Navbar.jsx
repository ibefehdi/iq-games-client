import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';
import Logo from '../assets/logo.png';

const Navbar = ({ username }) => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem('accessToken');
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };


    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img className="h-8 w-8" src={Logo} alt="Logo" />
                        </div>
                        <div className="ml-4 text-xl font-bold text-gray-800 dark:text-white">
                            Mindflex Arcade
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                            >
                                <User className="h-5 w-5" />
                                <span>{username}</span>
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md overflow-hidden shadow-xl z-10">
                                    <button
                                        onClick={handleProfileClick}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        User Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 transition-colors duration-300"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;