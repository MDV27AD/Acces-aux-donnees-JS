import dotenv from "dotenv";
dotenv.config();

import { Distributor } from "./seed/types";

const getDistributorMongoUrl = (identifier: string): string => {
  const key = `${identifier}_URL`;
  const url = process.env[key];
  if (!url) {
    throw new Error(`Missing distributor endpoint url for ${identifier}`);
  }

  return url;
};

export const distributors: Distributor[] = [
  {
    name: "SPORT SALUT",
    categories: ["Sport", "Sport Sain"],
    mongoUrl: getDistributorMongoUrl("SPORT_SALUT"),
  },
  {
    name: "GamEZ",
    categories: ["Jeu vidéo", "Jeu de société"],
    mongoUrl: getDistributorMongoUrl("GAME_EZ"),
  },
  {
    name: "MEDIDONC",
    categories: ["Sport Sain", "Santé"],
    mongoUrl: getDistributorMongoUrl("MEDIDONC"),
  },
];
