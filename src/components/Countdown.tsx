import { useEffect, useState } from 'react';
import { useChallenges } from '../contexts/ChallengesContext';
import { useCountdown } from '../contexts/CountDownContext';
import styles from '../styles/components/Countdown.module.css';


export function Countdown() {

  const {
    hasFinished,
    isActive,
    minutes,
    resetCountdown,
    seconds,
    startCountdown
  } = useCountdown();

  const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
  const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

  return (
    <div>
      <div className={styles.countdownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRight}</span>
        </div>
        <span>:</span>
        <div>
          <span>{secondLeft}</span>
          <span>{secondRight}</span>
        </div>
      </div>

      {
        hasFinished
          ?
          <button
            disabled
            className={styles.countdownButton}
          >
            Ciclo Encerrado
            <img
              src="icons/check_circle.png"
              alt="Ciclo encerrado"
              className={styles.checkIcon}
            />
          </button>
          :
          <>
            {
              isActive
                ?
                <button
                  type="button"
                  className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
                  onClick={resetCountdown}
                >
                  Abandonar ciclo
                </button>
                :
                <button
                  type="button"
                  className={`${styles.countdownButton} ${styles.countdownButtonInactive}`}
                  onClick={startCountdown}
                >
                  Iniciar ciclo
                </button>
            }
          </>
      }


    </div>
  )
}

