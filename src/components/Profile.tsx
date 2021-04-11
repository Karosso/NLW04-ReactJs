import { useSession } from "next-auth/client";
import { useChallenges } from "../contexts/ChallengesContext";
import styles from "../styles/components/Profile.module.css";

interface IProfileProps {
  guestName: string | undefined;
  logout: () => void;
}

export const Profile: React.FC<IProfileProps> = ({ guestName, logout }) => {
  const [session] = useSession();
  const { level } = useChallenges();

  return (
    <div className={styles.profileContainer}>
      <img
        src={session ? session.user.image : "icons/guest.png"}
        alt={session ? session.user.name : guestName}
      />
      <div>
        <strong style={{ textTransform: "capitalize" }}>
          {session ? session.user.name : guestName}
        </strong>
        <p>
          <img src="icons/level.svg" alt="Level" />
          Level {level}
        </p>
      </div>
      <button onClick={logout}>
        <img
          className={styles.logoutImage}
          src="icons/logout.png"
          alt="logout"
        />
      </button>
    </div>
  );
};
