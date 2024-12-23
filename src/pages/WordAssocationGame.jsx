import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { Clock, Award, BookOpen, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const WordAssociationGame = () => {
    const [currentWord, setCurrentWord] = useState('');
    const [relatedWords, setRelatedWords] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameOver, setGameOver] = useState(false);
    const [iq, setIQ] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { darkMode } = useTheme();
    const inputRef = useRef(null);
    const startTime = useRef(Date.now());
    const [userId, setUserId] = useState();
    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        setUserId(storedUserId);
    }, []);
    useEffect(() => {
        if (userId) { // Ensure userId is set
            getNewWord();
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        endGame();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [userId]); // Depend on userId

    const getNewWord = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:7001/api/v1/word-game/challenge');
            const data = await response.json();
            setCurrentWord(data.word);
            setRelatedWords(data.relatedWords);
            setIsLoading(false);
        } catch (error) {
            console.error('Error getting new word:', error);
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:7001/api/v1/word-game/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submittedWord: userInput,
                    currentWord: currentWord,
                }),
            });

            const data = await response.json();

            if (data.correct) {
                setScore((prev) => prev + 1);
            }

            setCurrentWord(data.nextWord);
            setRelatedWords(data.nextRelatedWords);
            setUserInput('');
            setIsLoading(false);
        } catch (error) {
            console.error('Error submitting word:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        setUserId(userId);
    }, []);

    const endGame = async () => {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        try {
            const response = await fetch('http://localhost:7001/api/v1/word-game/calculate-iq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    score,
                    timeSpent,
                    userId: userId,
                }),
            });
            console.log(response)
            const data = await response.json();
            setIQ(data.iq);
            setGameOver(true);
        } catch (error) {
            console.error('Error calculating IQ:', error);
        }
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`min-h-screen flex items-center justify-center ${darkMode
                ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white'
                : 'bg-gradient-to-r from-green-100 via-white to-green-100 text-gray-900'
                }`}
        >
            <div className="container mx-auto px-4 py-8">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="text-4xl font-extrabold mb-8 text-center flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-400"
                >
                    <BookOpen className="mr-2 text-green-500 animate-pulse" />
                    Word Association Speed Challenge
                </motion.h1>

                {gameOver ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md mx-auto text-center"
                    >
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, ease: 'easeInOut' }}
                        >
                            <Award className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-4">Challenge Complete!</h2>
                        <p className="text-2xl mb-2">Your score: <span className="font-bold">{score}</span></p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-xl mb-4"
                        >
                            Your estimated IQ:{' '}
                            <span className="font-bold text-green-500 dark:text-green-400">{iq}</span>
                        </motion.p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Your result has been saved!</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto"
                    >
                        <div className="mb-6 flex justify-between items-center">
                            <motion.span
                                key={score}
                                initial={{ scale: 1.5, color: '#4CAF50' }}
                                animate={{ scale: 1, color: '#10B981' }}
                                className="text-lg font-medium text-green-500 dark:text-green-400"
                            >
                                Score: {score}
                            </motion.span>
                            <div className="flex items-center">
                                <Clock className="w-6 h-6 mr-2 text-red-500 animate-pulse" />
                                <span className="text-lg font-medium text-red-500">{timeLeft}s</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            Associate a word with:
                        </h2>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-16">
                                <Loader className="w-12 h-12 animate-spin text-green-500" />
                            </div>
                        ) : (
                            <div className="text-5xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-400">
                                {currentWord}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="flex items-center justify-center">
                            <input
                                type="text"
                                ref={inputRef}
                                value={userInput}
                                onChange={handleInputChange}
                                className="w-full p-4 text-center text-xl text-gray-800 dark:text-black border-2 border-green-300 dark:border-green-600 rounded-full mr-4 focus:outline-none focus:ring-4 focus:ring-green-500 dark:focus:ring-green-400 shadow-md"
                                placeholder="Type your association..."
                                required
                                disabled={isLoading}
                            />
                            <motion.button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white font-bold rounded-full focus:outline-none focus:ring-4 focus:ring-green-500 dark:focus:ring-green-400 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isLoading}
                            >
                                Submit
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default WordAssociationGame;
