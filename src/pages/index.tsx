import { GetServerSideProps } from "next";
import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import React, { useState } from "react";
import styles from "../styles/pages/Home.module.css";
import Challenges from "./challenges";

interface IHomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: IHomeProps) {
  const [session, loading] = useSession();
  const [inputName, setInputName] = useState<string>();
  const [guestUser, setGuestUser] = useState<string>();

  const handleGuestUserName = (event: any) => {
    setInputName(event.target.value);
  };

  const loginAsGuest = () => {
    if (inputName) {
      setGuestUser(inputName);
    }
  };

  const handleLogout = () => {
    setGuestUser(undefined);
    signOut();
  };

  return (
    <>
      {!session && !guestUser && (
        <div className={styles.containerNotLogged}>
          <Head>
            <title>getUp-standUp</title>
          </Head>
          <img
            src="icons/up-arrow.png"
            alt="Logo"
            className={styles.backgroundLogo}
          />
          <div className={styles.notLoggedContent}>
            <p>getUP standUP</p>
            <div>
              <h3>Bem-vindo</h3>
              <button
                onClick={() => signIn("github")}
                className={styles.githubButton}
              >
                <img src="icons/Github.png" alt="Github Logo" />
                Login com Github
                <div>
                  <img src="icons/arrow-right.png" alt="Entrar" />
                </div>
              </button>
              <div>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={inputName}
                  onChange={handleGuestUserName}
                />
                <button onClick={loginAsGuest}>
                  <img src="icons/arrow-right.png" alt="Entrar" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {(session || guestUser) && (
        <>
          <div className={styles.container}>
            <Head>
              <title>getUp standUp</title>
            </Head>
            <Challenges
              {...props}
              guestName={guestUser}
              logout={handleLogout}
            />
          </div>
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { level, currentExperience, challengesCompleted } = context.req.cookies;

  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
    },
  };
};
