import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import taxiAnimation from './assets/taxi.json';
import './App.css';

const App = () => {
  const [taxiCount, setTaxiCount] = useState(0);
  const [tonCount, setTonCount] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [miningStartTime, setMiningStartTime] = useState(0);

  useEffect(() => {
    const storedTaxiCount = parseFloat(localStorage.getItem('taxiCount')) || 0;
    const storedTonCount = parseFloat(localStorage.getItem('tonCount')) || 0;
    const storedMiningStartTime = parseInt(localStorage.getItem('miningStartTime')) || 0;

    setTaxiCount(storedTaxiCount);
    setTonCount(storedTonCount);

    // Проверяем, идет ли майнинг
    if (storedMiningStartTime) {
      const elapsedTime = Math.floor((Date.now() - storedMiningStartTime) / 1000);
      const totalTime = 8 * 60 * 60; // 8 часов в секундах
      const taxiPerSecond = 10000 / totalTime * 2;
      const tonPerSecond = 0.001 / totalTime * 2;

      const newTaxiCount = Math.min(storedTaxiCount + Math.floor(elapsedTime * taxiPerSecond), 10000);
      const newTonCount = Math.min(storedTonCount + (elapsedTime * tonPerSecond), 0.001);

      setTaxiCount(newTaxiCount);
      setTonCount(newTonCount);
    }

    if (storedMiningStartTime && !isMining) {
      setIsMining(true);
      startMining(storedMiningStartTime);
    }
  }, []);

  const startMining = (startTime) => {
    const totalTime = 8 * 60 * 60; // 8 часов в секундах
    const taxiPerSecond = 10000 / totalTime * 2;
    const tonPerSecond = 0.001 / totalTime * 2;

    const miningInterval = setInterval(() => {
      setTaxiCount(prev => {
        const newCount = Math.min(prev + taxiPerSecond, 10000);
        localStorage.setItem('taxiCount', newCount);
        return newCount;
      });

      setTonCount(prev => {
        const newCount = Math.min(prev + tonPerSecond, 0.001);
        localStorage.setItem('tonCount', newCount);
        return newCount;
      });
    }, 500);

    // Остановка через 8 часов
    setTimeout(() => {
      clearInterval(miningInterval);
      localStorage.removeItem('miningStartTime'); // Убираем время майнинга после окончания
      setIsMining(false);
    }, totalTime * 1000);

    localStorage.setItem('miningStartTime', startTime);
  };

  return (
    <div className="app">
      <div className="counters">
        <div className="counter">
          <h2>$TAXI: {taxiCount.toFixed(2)}</h2>
        </div>
        <div className="counter">
          <h2>TON: {tonCount.toFixed(6)}</h2>
        </div>
      </div>
      <div className="animation-container">
        <Lottie 
          animationData={taxiAnimation} 
          loop 
          style={{ width: '60%', height: 'auto' }} 
        />
      </div>
      <div className="button-container">
        <button className="button" onClick={() => startMining(Date.now())} disabled={isMining}>Start a working day</button>
        <button className="button" disabled={!isMining}>Stop Mining</button>
        <button className="button" disabled={!isMining}>Check Earnings</button>
      </div>
    </div>
  );
};

export default App;
