import React, { useState, useEffect } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
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
    const [initialRevealTimeLeft, setInitialRevealTimeLeft] = useState(0);
    const [totalPairs, setTotalPairs] = useState(0);
    const { darkMode } = useTheme();

    useEffect(() => {
        const userIdFromSession = sessionStorage.getItem('userId');
        setUserId(userIdFromSession); // Replace with actual user authentication
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
            setStartTime(null);

            const revealDuration = 4000; // 4 seconds
            const revealStartTime = Date.now();

            setInitialRevealTimeLeft(Math.ceil(revealDuration / 1000));

            setTimeout(() => {
                setInitialReveal(false);
                setCards((prevCards) => prevCards.map((card) => ({ ...card, flipped: false })));
                setStartTime(Date.now());
            }, revealDuration);

            // Update the countdown timer every second
            const countdownInterval = setInterval(() => {
                const timeLeft = Math.ceil((revealDuration - (Date.now() - revealStartTime)) / 1000);
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    setInitialRevealTimeLeft(0);
                } else {
                    setInitialRevealTimeLeft(timeLeft);
                }
            }, 1000);

            // Clear the interval when component unmounts
            return () => clearInterval(countdownInterval);
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    };

    const handleCardClick = (clickedCard) => {
        if (initialReveal || flippedCards.length === 2 || clickedCard.flipped || clickedCard.matched) return;

        setCards((prevCards) =>
            prevCards.map((card) => (card.id === clickedCard.id ? { ...card, flipped: true } : card))
        );

        const newFlippedCards = [...flippedCards, { ...clickedCard, flipped: true }];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            setMoves((prevMoves) => prevMoves + 1);
            if (newFlippedCards[0].symbol === newFlippedCards[1].symbol) {
                setMatchedPairs((prevMatched) => [...prevMatched, newFlippedCards[0].symbol]);
                setCards((prevCards) =>
                    prevCards.map((card) =>
                        card.symbol === newFlippedCards[0].symbol ? { ...card, matched: true, flipped: true } : card
                    )
                );
                setFlippedCards([]);
            } else {
                setTimeout(() => {
                    setCards((prevCards) =>
                        prevCards.map((card) => (card.matched ? card : { ...card, flipped: false }))
                    );
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (matchedPairs.length === totalPairs && startTime) {
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
                    // Include authentication headers if necessary
                },
                body: JSON.stringify({
                    timeSpent,
                    moves,
                    userId,
                    totalPairs,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setIQ(data.iq);
                setGameOver(true);
            } else {
                console.error('Error calculating IQ:', data.error);
            }
        } catch (error) {
            console.error('Error calculating IQ:', error);
        }
    };

    const particlesOptions = {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: darkMode ? '#ffffff' : '#000000' },
            shape: { type: 'circle' },
            opacity: { value: 0.3, random: true },
            size: { value: 2, random: true },
            move: {
                enable: true,
                speed: 0.5,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
            },
        },
        interactivity: {
            events: {
                onHover: { enable: true, mode: 'repulse' },
                onClick: { enable: true, mode: 'push' },
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 },
            },
        },
        background: {
            color: darkMode ? '#1A202C' : '#EDF2F7',
        },
    };

    const particlesInit = async (main) => {
        await loadFull(main);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`min-h-screen flex items-center justify-center ${darkMode
                    ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white'
                    : 'bg-gradient-to-r from-blue-100 via-white to-blue-100 text-gray-900'
                } relative overflow-hidden`}
        >
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={particlesOptions}
                className="absolute inset-0 z-0"
            />
            <div className="container mx-auto px-4 py-8 relative z-10">
                <motion.h1
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="text-3xl sm:text-4xl font-extrabold mb-8 text-center flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400"
                >
                    <Zap className="mr-2 text-yellow-500 animate-pulse" />
                    Memory Match IQ Challenge
                </motion.h1>

                {gameOver ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md mx-auto text-center backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90"
                    >
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, ease: 'easeInOut' }}
                        >
                            <Award className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-4">Challenge Complete!</h2>
                        <p className="text-2xl mb-2">
                            You completed the game in <span className="font-bold">{moves}</span> moves
                        </p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-xl mb-4"
                        >
                            Your estimated IQ:{' '}
                            <span className="font-bold text-blue-500 dark:text-blue-400">{iq}</span>
                        </motion.p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={initializeGame}
                            className="mt-4 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                            Play Again
                        </motion.button>
                    </motion.div>
                ) : (
                    <>
                        <div className="mb-6 flex justify-between items-center bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80">
                            <span className="text-xl font-bold">
                                Moves: <span className="text-blue-500">{moves}</span>
                            </span>
                            <span className="text-xl font-bold">
                                Pairs: <span className="text-green-500">{matchedPairs.length}</span> /{' '}
                                <span className="text-green-500">{totalPairs}</span>
                            </span>
                        </div>
                        {initialReveal && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center mb-6 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-2xl shadow-md"
                            >
                                <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                                    Memorize the cards!
                                </p>
                                <p className="text-lg text-yellow-700 dark:text-yellow-300">
                                    Cards will be hidden in {initialRevealTimeLeft} seconds
                                </p>
                            </motion.div>
                        )}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-5 sm:grid-cols-8 gap-2"
                        >
                            {cards.map((card) => (
                                <motion.div
                                    key={card.id}
                                    className={`aspect-square relative cursor-pointer ${card.matched
                                            ? 'bg-green-200 dark:bg-green-700 shadow-glow'
                                            : 'bg-blue-200 dark:bg-blue-700'
                                        } rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105`}
                                    onClick={() => handleCardClick(card)}
                                    style={{
                                        perspective: '1000px',
                                    }}
                                >
                                    <motion.div
                                        className="absolute inset-0 w-full h-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl rounded-xl"
                                        animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
                                        transition={{ duration: 0.6 }}
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            position: 'absolute',
                                            transformStyle: 'preserve-3d',
                                            color: darkMode ? '#fff' : '#000',
                                        }}
                                    >
                                        {card.symbol}
                                    </motion.div>
                                    <motion.div
                                        className="absolute inset-0 w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl bg-gradient-to-br from-blue-500 to-teal-500 dark:from-blue-600 dark:to-teal-700 text-white font-bold rounded-xl"
                                        animate={{ rotateY: card.flipped || card.matched ? -180 : 0 }}
                                        transition={{ duration: 0.6 }}
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            position: 'absolute',
                                            transformStyle: 'preserve-3d',
                                        }}
                                    >
                                        ?
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default MemoryGame;
