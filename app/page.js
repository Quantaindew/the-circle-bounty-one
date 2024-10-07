'use client';
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import backgroundImage from "@/public/Clip path group.png";
import brick from "@/public/element.png";
import brick1 from "@/public/brick1.png";
import brick2 from "@/public/brick2.png";
import brick3 from "@/public/brick3.png";

const multipliers = [1.2, 2.5, 5, 10, 25, 50];

export default function Home() {
  const [clickedBricks, setClickedBricks] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [brickTypes, setBrickTypes] = useState(Array(18).fill('brick'));
  const [brick2Indexes, setBrick2Indexes] = useState([]); // Store the indexes of the two brick2s
  const [foundBrick2, setFoundBrick2] = useState(0); // Track how many brick2s were found
  const [gameStarted, setGameStarted] = useState(false);
  const [betAmount, setBetAmount] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Set last 3 bricks as brick1 (fixed)
    const newBrickTypes = [...brickTypes];
    newBrickTypes[15] = 'brick1';
    newBrickTypes[16] = 'brick1';
    newBrickTypes[17] = 'brick1';
    setBrickTypes(newBrickTypes);
  }, []);

  const startGame = () => {
    if (betAmount === '') {
      alert('Please enter a bet amount before starting the game.');
      return;
    }
    setGameStarted(true);
    setGameOver(false);
    
    // Randomly select two brick indexes for brick2
    const brickIndexes = Array.from({ length: 15 }, (_, index) => index);
    const randomIndexes = [];
    while (randomIndexes.length < 2) {
      const randomIndex = Math.floor(Math.random() * brickIndexes.length);
      const selected = brickIndexes.splice(randomIndex, 1)[0];
      randomIndexes.push(selected);
    }
    
    setBrick2Indexes(randomIndexes);
  };

  const handleBrickClick = (index) => {
    if (index >= 15 || brickTypes[index] !== 'brick' || gameOver) return; // Ignore clicks on last 3 bricks or already changed bricks

    if (!gameStarted) {
      startGame();
      if (!gameStarted) return; // If startGame didn't set gameStarted to true, exit
    }

    setClickedBricks(prevState => {
      const newState = new Set(prevState);
      if (!newState.has(index)) {
        newState.add(index);
      }
      return newState;
    });

    setBrickTypes(prevTypes => {
      const newBrickTypes = [...prevTypes];
      if (brick2Indexes.includes(index)) {
        newBrickTypes[index] = 'brick2';
        setFoundBrick2(prevFound => {
          const newFound = prevFound + 1;
          if (newFound === 2) {
            setGameOver(true); // End the game if both brick2s are found
          }
          return newFound;
        });
      } else {
        newBrickTypes[index] = 'brick3';
      }
      return newBrickTypes;
    });

    setProgress(prevProgress => {
      const newProgress = prevProgress + (100 / 15);
      return Math.min(newProgress, 100);
    });

    const multiplierIndex = Math.floor((clickedBricks.size / 15) * multipliers.length);
    setCurrentMultiplier(multipliers[multiplierIndex] || multipliers[multipliers.length - 1]);
  };

  const getBrickImage = (index) => {
    if (brickTypes[index] === 'brick1') return brick1;
    if (brickTypes[index] === 'brick2') return brick2;
    if (brickTypes[index] === 'brick3') return brick3;
    return brick; // Default to brick image
  };

  const resetGame = () => {
    setClickedBricks(new Set());
    setProgress(0);
    setCurrentMultiplier(1);
    setGameStarted(false);
    setBetAmount('');
    setFoundBrick2(0); // Reset the count of found brick2s
    setGameOver(false);

    // Reset all bricks except last 3 to 'brick'
    const newBrickTypes = Array(18).fill('brick');
    newBrickTypes[15] = 'brick1';
    newBrickTypes[16] = 'brick1';
    newBrickTypes[17] = 'brick1';
    setBrickTypes(newBrickTypes);
  };

  const handleAutoPick = () => {
    if (!gameStarted) {
      startGame();
      if (!gameStarted) return; // If startGame didn't set gameStarted to true, exit
    }

    const availableIndexes = brickTypes
      .map((type, index) => (type === 'brick' && index < 15 ? index : null))
      .filter(index => index !== null);

    if (availableIndexes.length > 0) {
      const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      handleBrickClick(randomIndex);
    }
  };

  return (
    <div className="relative h-screen">
      <Image
        src={backgroundImage}
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />
     
      <div className="relative z-10 flex items-center justify-center h-screen">
      <div className="bg-purple-950 h-16 absolute top-0 w-full bg">
        <div className="bg-yellow-300 w-5 text-3xl  px-6 m-3">=</div>
      </div>
        <div className="w-[80%] h-[90%] pt-16 flex">
          <div className="bg-black h-full w-[30%] px-6 flex flex-col justify-between">
            <div>
              <div className="flex pt-6">
                <button className="bg-slate-500 mx-2 text-white w-[50%] py-4 px-6 rounded">
                  Manual
                </button>
                <button 
                  className="bg-slate-800 mx-2 text-white w-[50%] py-4 px-6 rounded"
                  onClick={handleAutoPick}
                >
                  Autopic
                </button>
              </div>
              <h1 className="text-xl text-white p-3 font-semibold">Bet Amount</h1>
              <input
                type="text"
                className="w-full py-2 px-3 rounded"
                placeholder="Enter bet amount"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={gameStarted}
              />
              {!gameStarted ? (
                <button 
                  className="bg-green-400 my-5 text-white w-full px-3 rounded"
                  onClick={startGame}
                >
                  <h1 className="text-xl text-white p-3 font-semibold">Play</h1>
                </button>
              ) : (
                <button 
                  className="bg-red-400 my-5 text-white w-full px-3 rounded"
                  onClick={resetGame}
                >
                  <h1 className="text-xl text-white p-3 font-semibold">Reset Game</h1>
                </button>
              )}
            </div>
            <div className="text-white bg-slate-500 rounded-lg px-4 py-4 my-6 mb-4 text-center">
              <h1 className="text-4xl font-bold  text-green-500"> {currentMultiplier}x </h1>
              <h1 className="font-semibold">cashout available : {currentMultiplier} tokens</h1>
            </div>
          </div>
          <div className="h-full w-[50%] px-3 grid grid-cols-3 items-center">
            {Array.from({ length: 18 }).map((_, index) => (
              <div key={index} className="w-40 h-10" onClick={() => handleBrickClick(index)}>
                <Image
                  src={getBrickImage(index)}
                  alt="brick"
                  layout="responsive"
                  width={40}
                  height={40}
                  className={`transition-all duration-300 
                    ${gameStarted && index < 15 ? 'hover:opacity-80' : ''}
                    ${gameStarted && index >= 15 ? 'animate-pulse' : ''}
                    ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
            ))}
          </div>
          <div className="h-full w-[20%] flex flex-col justify-center items-center p-4">
            <div className="w-8 h-[80%] bg-gray-200 rounded-full relative">
              <div 
                className="absolute bottom-0 w-full bg-green-600 rounded-full transition-all duration-300 ease-out"
                style={{height: `${progress}%`}}
              ></div>
            </div>
            <div className="mt-4 text-white font-bold text-xl">
              {currentMultiplier}x
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}