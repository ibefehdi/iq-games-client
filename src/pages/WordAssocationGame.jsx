import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { Clock, Award, BookOpen, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

    useEffect(() => {
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
    }, []);

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
                    currentWord: currentWord
                })
            });

            const data = await response.json();

            if (data.correct) {
                setScore(prev => prev + 1);
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
                    userId: '60f5e8b7d5ab7a1234567890' // Replace with actual user ID
                })
            });

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
            className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
        >
            <div className="container mx-auto px-4 py-8">
                <motion.h1
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-3xl font-bold mb-8 text-center flex items-center justify-center"
                >
                    <BookOpen className="mr-2 text-green-500" />
                    Word Association Speed Challenge
                </motion.h1>

                {gameOver ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md mx-auto text-center"
                    >
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            <Award className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-4">Challenge Complete!</h2>
                        <p className="text-xl mb-2">Your score: {score}</p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-lg mb-4"
                        >
                            Your estimated IQ: <span className="font-bold text-green-500 dark:text-green-400">{iq}</span>
                        </motion.p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Your result has been saved!</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl mx-auto"
                    >
                        <div className="mb-6 flex justify-between items-center">
                            <motion.span
                                key={score}
                                initial={{ scale: 1.5, color: "#4CAF50" }}
                                animate={{ scale: 1, color: "#10B981" }}
                                className="text-lg font-medium text-green-500 dark:text-green-400"
                            >
                                Score: {score}
                            </motion.span>
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-red-500" />
                                <span className="text-lg font-medium text-red-500">{timeLeft}s</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-4 text-center">Associate a word with:</h2>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-16">
                                <Loader className="w-8 h-8 animate-spin text-green-500" />
                            </div>
                        ) : (
                            <div className="text-4xl font-bold text-center mb-6">{currentWord}</div>
                        )}
                        <form onSubmit={handleSubmit} className="flex items-center justify-center">
                            <input
                                type="text"
                                ref={inputRef}
                                value={userInput}
                                onChange={handleInputChange}
                                className="w-full p-2 text-center text-lg text-black border-2 border-green-300 dark:border-green-600 rounded-lg mr-4 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                                placeholder="Type your association..."
                                required
                                disabled={isLoading}
                            />
                            <motion.button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg transition-colors duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
}

export default WordAssociationGame;