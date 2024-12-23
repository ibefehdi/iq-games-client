import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Hash, Brain, Calendar, Trophy, ChevronDown, Edit2, X, Save } from 'lucide-react';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [iqResults, setIqResults] = useState([]);
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const [resultsLoading, setResultsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        fName: '',
        lName: '',
        email: '',
        password: '',
        profileImage: null
    });
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                const response = await axios.get(`http://localhost:7001/api/v1/users/${userId}`);
                setUser(response.data);
                setEditForm({
                    fName: response.data.fName,
                    lName: response.data.lName,
                    email: response.data.email,
                    password: '',
                    profileImage: null
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch user data');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setUpdateMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setEditForm(prev => ({
            ...prev,
            profileImage: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setUpdateMessage('');

        try {
            const userId = sessionStorage.getItem('userId');
            const formData = new FormData();

            // Append all fields from the editForm
            Object.keys(editForm).forEach(key => {
                if (editForm[key]) {
                    formData.append(key, editForm[key]);
                }
            });

            const response = await axios.put(
                `http://localhost:7001/api/v1/edituser/${userId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setUser({
                ...user,
                ...response.data, // Update user data with the response
            });
            setUpdateMessage('Profile updated successfully!');
            setTimeout(() => {
                setIsEditing(false);
                setUpdateMessage('');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchIQResults = async () => {
        if (!isResultsOpen && iqResults.length === 0) {
            setResultsLoading(true);
            try {
                const userId = sessionStorage.getItem('userId');
                const response = await axios.get(`http://localhost:7001/api/v1/iq-results/user/${userId}`);
                setIqResults(response.data);
            } catch (err) {
                console.error('Failed to fetch IQ results:', err);
            } finally {
                setResultsLoading(false);
            }
        }
        setIsResultsOpen(!isResultsOpen);
    };

    const getTestTypeBadgeColor = (testType) => {
        const colors = {
            'Full': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
            'Quick': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
            'Practice': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
        };
        return colors[testType] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!user) return <div className="text-center mt-8">No user data found</div>;

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="relative">
                <button
                    onClick={handleEditToggle}
                    className="absolute top-0 right-0 p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                    {isEditing ? <X className="h-6 w-6" /> : <Edit2 className="h-6 w-6" />}
                </button>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center mb-8">
                            <div className="mb-4 relative">
                                {editForm.profileImage ? (
                                    <img
                                        src={URL.createObjectURL(editForm.profileImage)}
                                        alt="Profile Preview"
                                        className="h-36 w-36 rounded-full object-cover border-4 border-blue-500"
                                    />
                                ) : user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        className="h-36 w-36 rounded-full object-cover border-4 border-blue-500"
                                    />
                                ) : (
                                    <div className="h-36 w-36 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="profileImage"
                                    name="profileImage"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                            </div>

                            <div className="w-full max-w-md space-y-4">
                                <div>
                                    <label htmlFor="fName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fName"
                                        name="fName"
                                        value={editForm.fName}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lName"
                                        name="lName"
                                        value={editForm.lName}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        New Password (leave blank to keep current)
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={editForm.password}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                                    disabled={loading}
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>

                                {updateMessage && (
                                    <p className="text-green-500 text-center mt-2">{updateMessage}</p>
                                )}
                            </div>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="flex flex-col items-center mb-8">
                            <div className="mb-4">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        className="h-36 w-36 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400"
                                    />
                                ) : (
                                    <div className="h-36 w-36 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <User className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                    </div>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{`${user.fName} ${user.lName}`}</h1>
                            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center">
                                <Hash className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                                    <p className="text-lg font-medium text-gray-800 dark:text-white">{user.username}</p>
                                </div>
                            </div>
                            {user.email && (
                                <div className="flex items-center">
                                    <Mail className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="text-lg font-medium text-gray-800 dark:text-white">{user.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="space-y-4">
                    <button
                        onClick={fetchIQResults}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        <Brain className="h-5 w-5" />
                        View IQ Test Results
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isResultsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isResultsOpen && (
                        <div className={`transition-all duration-300 ${resultsLoading ? 'opacity-50' : 'opacity-100'}`}>
                            {resultsLoading ? (
                                <div className="text-center py-4">Loading results...</div>
                            ) : iqResults.length > 0 ? (
                                <div className="space-y-4">
                                    {iqResults.map((result, index) => (
                                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                            <div className="grid gap-4">
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTestTypeBadgeColor(result.testType)}`}>
                                                        {result.testType} Test
                                                    </span>
                                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {new Date(result.date).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-center bg-white dark:bg-gray-600 py-3 rounded-lg">
                                                    <div className="text-center">
                                                        <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-1" />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">IQ Score</p>
                                                        <p className="text-3xl font-bold text-gray-800 dark:text-white">{result.score}</p>
                                                    </div>
                                                </div>

                                                {result.details && (
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-center">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Verbal</p>
                                                            <p className="text-lg font-semibold text-gray-800 dark:text-white">{result.details.verbalScore}</p>
                                                        </div>
                                                        <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-center">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mathematical</p>
                                                            <p className="text-lg font-semibold text-gray-800 dark:text-white">{result.details.mathematicalScore}</p>
                                                        </div>
                                                        <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-center">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Spatial</p>
                                                            <p className="text-lg font-semibold text-gray-800 dark:text-white">{result.details.spatialScore}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                    No IQ test results found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;