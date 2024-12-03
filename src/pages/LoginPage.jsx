import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sun, Moon, LogIn, UserPlus, Upload } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';
import Logo from '../assets/logo.png';
import * as jwtDecode from 'jwt-decode';

const LoginPage = ({ setIsAuthenticated, setUsername: setAppUsername }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) { // 5MB limit
                setError('Image size should be less than 20MB');
                return;
            }
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                setError('Only JPG, JPEG, and PNG files are allowed');
                return;
            }
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLoginMode) {
                const response = await axios.post('http://localhost:7001/api/v1/users/signin', {
                    username,
                    password
                }, {
                    withCredentials: true
                });

                if (response.data.accessToken) {
                    try {
                        const decodedToken = jwtDecode.jwtDecode(response.data.accessToken);
                        if (!decodedToken.userId || !decodedToken.username) {
                            throw new Error('Token missing required fields');
                        }

                        sessionStorage.setItem('accessToken', response.data.accessToken);
                        sessionStorage.setItem('userId', decodedToken.userId);
                        sessionStorage.setItem('username', decodedToken.username);
                        sessionStorage.setItem('profileImage', response.data.profileImage);
                        setIsAuthenticated(true);
                        setAppUsername(decodedToken.username);
                        navigate('/games');
                    } catch (decodeError) {
                        console.error("Token decode error:", decodeError);
                        setError('Error processing login response. Please try again.');
                        return;
                    }
                }
            } else {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);
                formData.append('fName', fName);
                formData.append('lName', lName);
                formData.append('email', email);
                if (profileImage) {
                    formData.append('profileImage', profileImage);
                }

                const response = await axios.post('http://localhost:7001/api/v1/users/signup', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 201) {
                    setError('Sign-up successful. Please log in.');
                    setIsLoginMode(true);
                    setUsername('');
                    setPassword('');
                    setFName('');
                    setLName('');
                    setEmail('');
                    setProfileImage(null);
                    setPreviewUrl(null);
                }
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

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setProfileImage(null);
        setPreviewUrl(null);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-400">
                                <img src={Logo} alt="Logo" />
                            </span>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 transition-colors duration-300"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                        {isLoginMode ? 'Login to your account' : 'Create an account'}
                    </h2>
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
                        {!isLoginMode && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="fName">
                                        First Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700 transition-colors duration-300"
                                        id="fName"
                                        type="text"
                                        placeholder="First Name"
                                        value={fName}
                                        onChange={(e) => setFName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="lName">
                                        Last Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700 transition-colors duration-300"
                                        id="lName"
                                        type="text"
                                        placeholder="Last Name"
                                        value={lName}
                                        onChange={(e) => setLName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700 transition-colors duration-300"
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                        Profile Image
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <label className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 flex items-center">
                                            <Upload className="mr-2" size={20} />
                                            Choose Image
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/jpeg,image/jpg,image/png"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        {previewUrl && (
                                            <div className="w-16 h-16 relative">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Max size: 20MB. Allowed formats: JPG, JPEG, PNG
                                    </p>
                                </div>
                            </>
                        )}
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 flex items-center"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoginMode ? <LogIn className="mr-2" size={20} /> : <UserPlus className="mr-2" size={20} />}
                                {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
                            </button>
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                            >
                                {isLoginMode ? 'Create an account' : 'Back to Login'}
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