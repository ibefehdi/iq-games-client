import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../utils/ThemeContext';
import { ChevronRight, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Trivia = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [iq, setIQ] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [userId, setUserId] = useState(null);
    const { darkMode } = useTheme();

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');

        setUserId(userId); // Replace with actual user authentication

        axios.get('http://localhost:7001/api/v1/questions')
            .then(response => {
                setQuestions(response.data);
                setStartTime(Date.now());
            })
            .catch(error => console.error('Error fetching questions:', error));
    }, []);

    const handleAnswerClick = (selectedAnswer) => {
        if (selectedAnswer === questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            const endTime = Date.now();
            const timeSpent = (endTime - startTime) / 1000;
            calculateIQ(timeSpent);
        }
    };

    const calculateIQ = (timeSpent) => {
        axios.post('http://localhost:7001/api/v1/calculate-iq', { score, timeSpent, userId })
            .then(response => {
                setIQ(response.data.iq);
                setShowScore(true);
            })
            .catch(error => console.error('Error calculating IQ:', error));
    };

    function decodeHTML(html) {
        var txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

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
                    <Zap className="mr-2 text-yellow-500" />
                    Mindflex Trivia Challenge
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
                        <p className="text-xl mb-2">You scored {score} out of {questions.length}</p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-lg mb-4"
                        >
                            Your estimated IQ: <span className="font-bold text-blue-500 dark:text-blue-400">{iq}</span>
                        </motion.p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Your result has been saved!</p>
                    </motion.div>
                ) : questions.length > 0 ? (
                    <motion.div
                        key={currentQuestion}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl mx-auto"
                    >
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
                                <motion.span
                                    key={score}
                                    initial={{ scale: 1.5, color: "#4CAF50" }}
                                    animate={{ scale: 1, color: "#3B82F6" }}
                                    className="text-sm font-medium text-blue-500 dark:text-blue-400"
                                >
                                    Score: {score}
                                </motion.span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <motion.div
                                    initial={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-blue-500 h-2.5 rounded-full"
                                />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-4">{decodeHTML(questions[currentQuestion].question)}</h2>
                        <AnimatePresence>
                            <motion.div className="space-y-3">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        onClick={() => handleAnswerClick(index)}
                                        className="w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center justify-between
                                                   bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900
                                                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span>{decodeHTML(option)}</span>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </motion.button>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"
                        />
                        <p className="mt-2">Loading questions...</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default Trivia;