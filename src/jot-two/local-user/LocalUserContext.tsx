import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import { getUsername } from "../../app/(two)/files/user-helpers";

export interface ColorSet {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}
const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
];
// Color sets based on the same colors as in the list "colors"
const colorSets: ColorSet[] = [
  {
    primaryColor: "#AEC6CF", // Pastel blue
    secondaryColor: "#CFE0E8", // Lighter pastel blue
    tertiaryColor: "#7F9BA6", // Darker pastel blue
  },
  {
    primaryColor: "#F49AC2", // Pastel pink
    secondaryColor: "#FADADD", // Lighter pastel pink
    tertiaryColor: "#C07A9E", // Darker pastel pink
  },
  {
    primaryColor: "#FFB347", // Pastel orange
    secondaryColor: "#FFE1A6", // Lighter pastel orange
    tertiaryColor: "#CC9138", // Darker pastel orange
  },
  {
    primaryColor: "#B3E3B5", // Pastel green
    secondaryColor: "#D7F2DA", // Lighter pastel green
    tertiaryColor: "#85B38A", // Darker pastel green
  },
  {
    primaryColor: "#FFD1DC", // Pastel red
    secondaryColor: "#FFE4E8", // Lighter pastel red
    tertiaryColor: "#CC9FA4", // Darker pastel red
  },
  {
    primaryColor: "#C3B1E1", // Pastel purple
    secondaryColor: "#E1D5F5", // Lighter pastel purple
    tertiaryColor: "#9A87BD", // Darker pastel purple
  },
];

const getRandomElement = (list: any) =>
  list[Math.floor(Math.random() * list.length)];

function getRandomColor(): ColorSet {
  return getRandomElement(colorSets);
}

function createLocalUser(localId: string): LocalUser {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    return JSON.parse(currentUser);
  }

  const newUser = {
    name: localId,
    username: localId,
    avatar: null,
    ...getRandomColor(),
  };
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  return newUser;
}

function createFromUser(user: UserResource, localId: string): LocalUser {
  const latestUserData = {
    name: user.fullName ?? user.username ?? localId,
    username: getUsername({
      id: user.id,
      primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
      username: user.username,
      fullName: user.fullName,
    }),
    avatar: user.imageUrl,
    primaryColor: getRandomColor().primaryColor,
    secondaryColor: getRandomColor().secondaryColor,
    tertiaryColor: getRandomColor().tertiaryColor,
  };
  localStorage.setItem("currentUser", JSON.stringify(latestUserData));

  return latestUserData;
}

export interface LocalUser {
  name: string;
  username: string;
  avatar: string | null;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

const LocalUserContext = createContext<{
  localUser: LocalUser;
  setLocalUser(user: LocalUser): void;
} | null>(null);

export function useLocalUserContext() {
  const context = useContext(LocalUserContext);
  if (!context) {
    throw new Error(
      "useLocalUserContext must be used within a LocalUserProvider"
    );
  }

  return context;
}

export function LocalUserProvider({
  localId,
  children,
}: {
  localId: string;
  children: ReactNode;
}) {
  const { user } = useUser();
  const [localUser, setLocalUser] = useState(
    user ? createFromUser(user, localId) : createLocalUser(localId)
  );

  return (
    <LocalUserContext.Provider value={{ localUser, setLocalUser }}>
      {children}
    </LocalUserContext.Provider>
  );
}
