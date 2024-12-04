import React from 'react';
import { useNavigate } from 'react-router-dom';
const Games = () => {
    const navigate = useNavigate();

    // Static array of games
    const games = [
        {
            id: 1,
            title: 'Trivia Challenge',
            description: 'Test your knowledge with our exciting trivia game!',
            imagePath: 'trivia.svg', // Placeholder image
            route: '/games/trivia'
        },
        {
            id: 2,
            title: 'Memory Challenge',
            description: 'Test your knowledge with our exciting trivia game!',
            imagePath: 'memory-match.jpeg', // Placeholder image
            route: '/games/memory'
        },
        {
            id: 3,
            title: 'Pattern Challenge',
            description: 'Test your knowledge with our exciting trivia game!',
            imagePath: 'pattern-recognition-1.jpeg', // Placeholder image
            route: '/games/pattern'
        },
        {
            id: 4,
            title: 'Word Association Challenge',
            description: 'Test your knowledge with our exciting trivia game!',
            imagePath: 'word-association.jpeg', // Placeholder image
            route: '/games/wordassociation'
        },
    ];

    const handlePlayNow = (route) => {
        navigate(route);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Available Games</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <div key={game.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-300">
                            <img src={"https://usc1.contabostorage.com/b76bfe0a0d0b46dfa7533e11a296e100:iq-games/games-images/" + game.imagePath} alt={game.title} className="w-full h-48 object-cover" />
                            <div className="p-5">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                    {game.title}
                                </h3>
                                <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                                    {game.description}
                                </p>
                                <div className="mt-3">
                                    <button
                                        onClick={() => handlePlayNow(game.route)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Play Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Games;