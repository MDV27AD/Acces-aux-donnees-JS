import dotenv from "dotenv";
dotenv.config();

import { Distributor } from "./seed/types";
import { getDistributorMongoUrl } from "./helper";

export const DISTRIBUTORS: Distributor[] = [
  {
    name: "SPORT SALUT",
    categories: ["Sport", "Sport Sain"],
    mongoUrl: getDistributorMongoUrl("SPORT_SALUT"),
  },
  {
    name: "GameEZ",
    categories: ["Jeu vidéo", "Jeu de société"],
    mongoUrl: getDistributorMongoUrl("GAME_EZ"),
  },
  {
    name: "MEDIDONC",
    categories: ["Sport Sain", "Santé"],
    mongoUrl: getDistributorMongoUrl("MEDIDONC"),
  },
];

export const CATEGORIES = [
  "Sport",
  "Sport Sain",
  "Santé",
  "Jeu vidéo",
  "Jeu de société",
] as const;
