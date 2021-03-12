import React, { createContext, useContext, useEffect, useState } from 'react';
import { useChallenges } from './ChallengesContext';

let countdownTimeout: NodeJS.Timeout;


interface ICountdownContextProps {
  minutes: number;
  seconds: number;
  hasFinished: boolean
  isActive: boolean
  startCountdown: () => void;
  resetCountdown: () => void;
}

export const CountdownContext = createContext<ICountdownContextProps>({} as ICountdownContextProps);

export const CountdownProvider: React.FC = ({ children }) => {

  const { startNewChallenge } = useChallenges()

  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const startCountdown = () => {
    setIsActive(true);
  }

  const resetCountdown = () => {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setHasFinished(false);
    setTime(25 * 60)
  }

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1 * 1000);
    } else if (isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time])



  return (
    <CountdownContext.Provider
      value={
        {
          minutes,
          seconds,
          hasFinished,
          isActive,
          startCountdown,
          resetCountdown
        }
      }
    >
      {children}
    </CountdownContext.Provider>
  )
}

export const useCountdown = () => {
  const context = useContext(CountdownContext);
  return context;
};