import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sun, Moon, LogIn } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';
import Logo from '../assets/logo.png';
const LoginPage = ({ setIsAuthenticated, setUsername: setAppUsername }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:7001/api/v1/users/signin', {
                username,
                password
            }, {
                withCredentials: true
            });

            if (response.data.accessToken) {
                sessionStorage.setItem('accessToken', response.data.accessToken);
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('userId', response.data.userId);
                setIsAuthenticated(true);
                setAppUsername(username);
                navigate('/games');
            }
        } catch (err) {
            if (err.response) {
                switch (err.response.data.code) {
                    case 0:
                        setError('Username does not exist.');
                        break;
                    case 1:
                        setError('Incorrect password.');
                        break;
                    default:
                        setError('An error occurred. Please try again.');
                }
            } else {
                setError('Network error. Please check your connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className={`flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-400"><img src={Logo} /></span>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 transition-colors duration-300"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Login to your account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700 transition-colors duration-300"
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700 transition-colors duration-300"
                                id="password"
                                type="password"
                                placeholder="******************"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 flex items-center"
                                type="submit"
                                disabled={isLoading}
                            >
                                <LogIn className="mr-2" size={20} />
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>

                        </div>
                    </form>
                    {error && (
                        <div className="mt-4 text-center text-red-500 dark:text-red-400">
                            {error}
                        </div>
                    )}
                </div>
                <p className="text-center text-gray-500 dark:text-gray-400 text-xs">
                    &copy;2024 Hina. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;