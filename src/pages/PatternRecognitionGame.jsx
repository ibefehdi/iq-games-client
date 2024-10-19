import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../utils/ThemeContext';
import { ChevronRight, Award, Brain } from 'lucide-react';

const PatternRecognitionGame = () => {
    const [patterns, setPatterns] = useState([]);
    const [currentPattern, setCurrentPattern] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [iq, setIQ] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [userId, setUserId] = useState(null);
    const { darkMode } = useTheme();

    useEffect(() => {
        setUserId('60f5e8b7d5ab7a1234567890'); // Replace with actual user authentication
        generatePatterns();
        setStartTime(Date.now());
    }, []);

    const generatePatterns = () => {
        const newPatterns = [];
        for (let i = 0; i < 10; i++) {
            newPatterns.push(generateSinglePattern());
        }
        setPatterns(newPatterns);
    };

    const generateSinglePattern = () => {
        const types = ['number', 'shape'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'number') {
            const start = Math.floor(Math.random() * 10);
            const step = Math.floor(Math.random() * 5) + 1;
            return {
                type: 'number',
                sequence: [start, start + step, start + 2 * step, start + 3 * step],
                options: [
                    start + 4 * step,
                    start + 4 * step + 1,
                    start + 4 * step - 1,
                    start + 3 * step + 2
                ],
                correctAnswer: start + 4 * step
            };
        } else {
            const shapes = ['circle', 'square', 'triangle', 'star'];
            const sequence = [];
            for (let i = 0; i < 4; i++) {
                sequence.push(shapes[Math.floor(Math.random() * shapes.length)]);
            }
            const correctAnswer = shapes[Math.floor(Math.random() * shapes.length)];
            const options = [...new Set([...shapes, correctAnswer])].slice(0, 4);
            return { type: 'shape', sequence, options, correctAnswer };
        }
    };

    const handleAnswerClick = (selectedAnswer) => {
        if (selectedAnswer === patterns[currentPattern].correctAnswer) {
            setScore(score + 1);
        }

        const nextPattern = currentPattern + 1;
        if (nextPattern < patterns.length) {
            setCurrentPattern(nextPattern);
        } else {
            const endTime = Date.now();
            const timeSpent = (endTime - startTime) / 1000;
            calculateIQ(timeSpent);
        }
    };

    const calculateIQ = (timeSpent) => {
        // This is a placeholder calculation. Replace with your actual IQ calculation logic.
        const baseIQ = 100;
        const scoreFactor = (score / patterns.length) * 30;
        const timeFactor = Math.max(0, 20 - (timeSpent / patterns.length));
        const calculatedIQ = Math.round(baseIQ + scoreFactor + timeFactor);
        setIQ(calculatedIQ);
        setShowScore(true);
    };

    const renderShape = (shape) => {
        switch (shape) {
            case 'circle':
                return <div className="w-8 h-8 rounded-full bg-blue-500" />;
            case 'square':
                return <div className="w-8 h-8 bg-red-500" />;
            case 'triangle':
                return <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-green-500" />;
            case 'star':
                return <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-yellow-500 rotate-180 relative">
                    <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-yellow-500 absolute top-[9px] left-[-16px]" />
                </div>;
            default:
                return null;
        }
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
                    <Brain className="mr-2 text-purple-500" />
                    Pattern Recognition Challenge
                </motion.h1>

                {showScore ? (
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
                        <p className="text-xl mb-2">You scored {score} out of {patterns.length}</p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-lg mb-4"
                        >
                            Your estimated IQ: <span className="font-bold text-purple-500 dark:text-purple-400">{iq}</span>
                        </motion.p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Your result has been saved!</p>
                    </motion.div>
                ) : patterns.length > 0 ? (
                    <motion.div
                        key={currentPattern}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl mx-auto"
                    >
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Pattern {currentPattern + 1} of {patterns.length}</span>
                                <motion.span
                                    key={score}
                                    initial={{ scale: 1.5, color: "#4CAF50" }}
                                    animate={{ scale: 1, color: "#8B5CF6" }}
                                    className="text-sm font-medium text-purple-500 dark:text-purple-400"
                                >
                                    Score: {score}
                                </motion.span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <motion.div
                                    initial={{ width: `${((currentPattern) / patterns.length) * 100}%` }}
                                    animate={{ width: `${((currentPattern + 1) / patterns.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-purple-500 h-2.5 rounded-full"
                                />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-4">What comes next in the sequence?</h2>
                        <div className="flex justify-center items-center space-x-4 mb-6">
                            {patterns[currentPattern].sequence.map((item, index) => (
                                <div key={index} className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    {patterns[currentPattern].type === 'number' ? (
                                        <span className="text-2xl font-bold">{item}</span>
                                    ) : (
                                        renderShape(item)
                                    )}
                                </div>
                            ))}
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg">
                                <span className="text-3xl font-bold text-gray-400">?</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {patterns[currentPattern].options.map((option, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleAnswerClick(option)}
                                    className="p-4 rounded-lg transition-colors duration-200 flex items-center justify-center
                                               bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900
                                               focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {patterns[currentPattern].type === 'number' ? (
                                        <span className="text-2xl font-bold">{option}</span>
                                    ) : (
                                        renderShape(option)
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block h-8 w-8 border-t-2 border-b-2 border-purple-500 rounded-full"
                        />
                        <p className="mt-2">Generating patterns...</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default PatternRecognitionGame;