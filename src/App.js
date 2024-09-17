import React, { useState } from 'react';
import Lottie from 'react-lottie';
import './App.css';
import logo1 from './assets/logo1.png';
import tickets from './assets/tickets.png';
import duckAnimation from './assets/duckcard.json';
import loadingAnimation from './assets/animation.json';

const cardsData = Array.from({ length: 12 }, (_, i) => ({ id: i + 1 }));

const App = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [cards, setCards] = useState(cardsData);
  const [flippedCards, setFlippedCards] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Function to handle play
  const handlePlay = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowAnimation(false);
      setCardsVisible(true);
    }, 1000); // Ensure this matches the fade-out duration
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length < 3 && !gameOver && !flippedCards.includes(cardId)) {
      const newCards = cards.map(card => {
        if (card.id === cardId) {
          return { ...card, isFlipped: true, coinAmount: generateRandomCoins() };
        }
        return card;
      });

      setCards(newCards);
      setFlippedCards([...flippedCards, cardId]);
      setAttemptsLeft(attemptsLeft - 1);
    }
  };

  const generateRandomCoins = () => {
    const coins = [1, 2, 3, 5];
    return coins[Math.floor(Math.random() * coins.length)];
  };

  const totalCoins = cards.reduce((sum, card) => sum + (card.isFlipped ? card.coinAmount || 0 : 0), 0);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: duckAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="App">
      {showAnimation && (
        <div
          className={`animation-container ${fadeOut ? 'fade-out' : ''}`}
          onClick={handlePlay}
        >
          <Lottie 
            options={loadingOptions} 
            height={200} 
            width={200} 
            isClickToPauseDisabled={true} 
          />
          <div className="tap-text">Tap me please...</div>
        </div>
      )}
      <div className={`main-content ${showAnimation ? 'hidden' : ''}`}>
        {gameOver ? (
          <div className="game-over">Game Over!</div>
        ) : (
          <>
            {cardsVisible && (
              <div className="status-bar">
                <div className="status-item">
                  <img src={logo1} alt="Total Ton" className="status-icon" />
                  <span className="status-value">{totalCoins}</span>
                </div>
                <div className="status-item">
                  <img src={tickets} alt="Attempts Left" className="status-icon" />
                  <span className="status-value">{attemptsLeft}</span>
                </div>
              </div>
            )}
            <div className="card-grid-container">
              <div className="card-grid">
                {cards.map(card => (
                  <div
                    key={card.id}
                    className={`card ${card.isFlipped ? 'flipped' : ''}`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    {card.isFlipped && (
                      <div className="card-back">
                        <p>{card.coinAmount || 0}</p>
                      </div>
                    )}
                    {!card.isFlipped && (
                      <Lottie options={defaultOptions} height={60} width={60} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
