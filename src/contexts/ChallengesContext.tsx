import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { challenges, IChallenges } from '../../challenges';
import { LevelUpModal } from '../components/LevelUpModal';

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
  closeLevelUpModal: () => void
}

interface IHomeProps {
  level: number,
  currentExperience: number,
  challengesCompleted: number
}

export const ChallengesContext = createContext<IChallengesContextProps>({} as IChallengesContextProps);

export const ChallengesProvider: React.FC<IHomeProps> = ({
  children,
  ...rest
}) => {

  const [level, setLevel] = useState(rest.level ?? 1);
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
  const [activeChallenge, setActiveChallenge] = useState<IChallenges>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

  useEffect(() => {
    Notification.requestPermission();
  }, [])

  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengesCompleted', String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted])

  const levelUp = () => {
    setLevel(level + 1);
    setShowLevelUpModal(true);
  }

  const closeLevelUpModal = () => {
    setShowLevelUpModal(false);
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
          completeChallenge,
          closeLevelUpModal
        }
      }
    >
      {children}

      {
        showLevelUpModal &&
        <LevelUpModal />
      }

    </ChallengesContext.Provider>
  )
}

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  return context;
};