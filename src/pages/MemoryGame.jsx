import React, { useState, useEffect } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { Zap, Award, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [iq, setIQ] = useState(null);
    const [userId, setUserId] = useState(null);
    const [initialReveal, setInitialReveal] = useState(true);
    const [totalPairs, setTotalPairs] = useState(0);
    const { darkMode } = useTheme();

    useEffect(() => {
        setUserId('60f5e8b7d5ab7a1234567890'); // Replace with actual user authentication
        initializeGame();
    }, []);

    const initializeGame = async () => {
        try {
            const response = await fetch('http://localhost:7001/api/v1/memory-game/initialize');
            const data = await response.json();
            setCards(data.cards);
            setTotalPairs(data.totalPairs);
            setInitialReveal(true);
            setFlippedCards([]);
            setMatchedPairs([]);
            setMoves(0);
            setGameOver(false);

            setTimeout(() => {
                setInitialReveal(false);
                setCards(cards => cards.map(card => ({ ...card, flipped: false })));
                setStartTime(Date.now());
            }, 2000);
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    };

    const handleCardClick = (clickedCard) => {
        if (initialReveal || flippedCards.length === 2 || clickedCard.flipped || clickedCard.matched) return;

        const newFlippedCards = [...flippedCards, clickedCard];
        setFlippedCards(newFlippedCards);
        setCards(cards.map(card =>
            card.id === clickedCard.id ? { ...card, flipped: true } : card
        ));

        if (newFlippedCards.length === 2) {
            setMoves(moves + 1);
            if (newFlippedCards[0].symbol === newFlippedCards[1].symbol) {
                setMatchedPairs([...matchedPairs, newFlippedCards[0].symbol]);
                setCards(cards.map(card =>
                    card.symbol === newFlippedCards[0].symbol ? { ...card, matched: true, flipped: true } : card
                ));
                setFlippedCards([]);
            } else {
                setTimeout(() => {
                    setFlippedCards([]);
                    setCards(cards.map(card =>
                        card.matched ? card : { ...card, flipped: false }
                    ));
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (matchedPairs.length === totalPairs) {
            const endTime = Date.now();
            const timeSpent = (endTime - startTime) / 1000;
            calculateIQ(timeSpent);
        }
    }, [matchedPairs, totalPairs, startTime]);

    const calculateIQ = async (timeSpent) => {
        try {
            const response = await fetch('http://localhost:7001/api/v1/memory-game/calculate-iq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timeSpent,
                    moves,
                    userId
                })
            });

            const data = await response.json();
            setIQ(data.iq);
            setGameOver(true);
        } catch (error) {
            console.error('Error calculating IQ:', error);
        }
    };

    const particlesOptions = {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: darkMode ? "#ffffff" : "#000000" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out" }
        }
    };

    const particlesInit = async (main) => {
        await loadFull(main);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} relative overflow-hidden`}
        >
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={particlesOptions}
                className="absolute inset-0"
            />
            <div className="container mx-auto px-4 py-8 relative z-10">
                <motion.h1
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-4xl font-bold mb-8 text-center flex items-center justify-center"
                >
                    <Zap className="mr-2 text-yellow-500" />
                    Memory Match IQ Challenge
                </motion.h1>

                {gameOver ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md mx-auto text-center backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90"
                    >
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            <Award className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-4">Challenge Complete!</h2>
                        <p className="text-2xl mb-2">You completed the game in {moves} moves</p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-xl mb-4"
                        >
                            Your estimated IQ: <span className="font-bold text-blue-500 dark:text-blue-400">{iq}</span>
                        </motion.p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={initializeGame}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                            Play Again
                        </motion.button>
                    </motion.div>
                ) : (
                    <>
                        <div className="mb-6 flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
                            <span className="text-xl font-bold">Moves: {moves}</span>
                            <span className="text-xl font-bold">Pairs: {matchedPairs.length}/{totalPairs}</span>
                        </div>
                        {initialReveal && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center mb-6 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-md"
                            >
                                <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">Memorize the cards!</p>
                                <p className="text-lg text-yellow-700 dark:text-yellow-300">Cards will be hidden in {Math.ceil((2000 - (Date.now() - startTime)) / 1000)} seconds</p>
                            </motion.div>
                        )}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-4 gap-4 md:gap-6"
                        >
                            <AnimatePresence>
                                {cards.map(card => (
                                    <motion.div
                                        key={card.id}
                                        initial={{ rotateY: 0 }}
                                        animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                                        exit={{ rotateY: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className={`aspect-square flex items-center justify-center text-5xl cursor-pointer
                                            ${card.matched ? 'bg-green-200 dark:bg-green-700' : 'bg-blue-200 dark:bg-blue-700'}
                                            rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105`}
                                        onClick={() => handleCardClick(card)}
                                        style={{
                                            perspective: '1000px',
                                            transformStyle: 'preserve-3d'
                                        }}
                                    >
                                        <motion.div
                                            className="w-full h-full flex items-center justify-center backface-hidden"
                                            style={{
                                                position: 'absolute',
                                                backfaceVisibility: 'hidden',
                                                transform: 'rotateY(180deg)'
                                            }}
                                        >
                                            {card.symbol}
                                        </motion.div>
                                        <motion.div
                                            className="w-full h-full flex items-center justify-center backface-hidden bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 text-white font-bold text-3xl"
                                            style={{
                                                position: 'absolute',
                                                backfaceVisibility: 'hidden'
                                            }}
                                        >
                                            ?
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default MemoryGame;