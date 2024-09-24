import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Hash } from 'lucide-react';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = sessionStorage.getItem('userId'); // Assume we store userId in sessionStorage
                const response = await axios.get(`http://localhost:7001/api/v1/users/${userId}`);
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch user data');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!user) return <div className="text-center mt-8">No user data found</div>;

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">User Profile</h1>
            <div className="space-y-4">
                <div className="flex items-center">
                    <User className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="text-lg font-medium text-gray-800 dark:text-white">{`${user.fName} ${user.lName}`}</p>
                    </div>
                </div>
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
        </div>
    );
};

export default UserProfile;