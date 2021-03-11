import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { challenges, IChallenges } from '../../challenges';

interface IChallengesContextProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  levelUp: () => void;
  startNewChallenge: () => void;
  activeChallenge: IChallenges;
  resetChallenge: () => void;
  experienceToNextLevel: number;
  completeChallenge: () => void;
}

export const ChallengesContext = createContext<IChallengesContextProps>({} as IChallengesContextProps);

export const ChallengesProvider: React.FC = ({ children }) => {

  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<IChallenges>(null);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

  useEffect(() => {
    Notification.requestPermission();
  }, [])

  const levelUp = () => {
    setLevel(level + 1);
  }

  const startNewChallenge = () => {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];
    
    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted') {
      new Notification('Novo desafio!', {
        body: `Valendo ${challenge.amount} xp!`
      })
    }
  }

  const resetChallenge = () => {
    setActiveChallenge(null)
  }

  const completeChallenge = () => {
    if (!activeChallenge) {
      return;
    }

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if (finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1);
  }

  return (
    <ChallengesContext.Provider
      value={
        {
          level,
          currentExperience,
          challengesCompleted,
          levelUp,
          startNewChallenge,
          activeChallenge,
          resetChallenge,
          experienceToNextLevel,
          completeChallenge
        }
      }
    >
      {children}
    </ChallengesContext.Provider>
  )
}

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  return context;
};