import React from "react";
import NotesEntry from "../components/NotesEntry";
import { getOrCreateFile } from "../db/files";
import { cookies } from "next/headers";
import { getFile } from "../db/file";

const animals = [
  "fox",
  "dog",
  "cat",
  "lion",
  "tiger",
  "bear",
  "wolf",
  "elephant",
  "zebra",
  "giraffe",
  "horse",
  "cow",
  "pig",
  "goat",
  "sheep",
  "fish",
  "whale",
  "shark",
  "dolphin",
  "squid",
  "octopus",
  "eagle",
  "hawk",
  "sparrow",
  "parrot",
  "dove",
  "penguin",
  "chicken",
  "seagull",
  "crocodile",
  "alligator",
  "lizard",
  "snake",
  "turtle",
  "frog",
  "toad",
  "newt",
  "salamander",
  "monkey",
  "gorilla",
  "chimp",
  "lemur",
  "sloth",
  "koala",
  "kangaroo",
  "wallaby",
  "opossum",
  "rat",
  "mouse",
  "squirrel",
  "chipmunk",
  "rabbit",
  "hare",
  "hedgehog",
  "porcupine",
  "skunk",
  "badger",
  "beaver",
  "otter",
  "weasel",
  "ferret",
  "raccoon",
  "manatee",
  "dugong",
  "platypus",
  "antelope",
  "gazelle",
  "oryx",
  "impala",
  "deer",
  "elk",
  "moose",
  "caribou",
  "buffalo",
  "bison",
  "bull",
  "cow",
  "ox",
  "giraffe",
  "zebra",
  "hippo",
  "rhino",
  "warthog",
  "pig",
  "boar",
  "peccary",
  "camel",
  "llama",
  "alpaca",
  "ant",
  "bee",
  "wasp",
  "hornet",
  "spider",
  "scorpion",
  "mosquito",
  "fly",
  "butterfly",
  "moth",
  "caterpillar",
  "centipede",
  "millipede",
];
const adjectives = [
  "abandoned",
  "abhorrent",
  "abiding",
  "abject",
  "abnormal",
  "aboriginal",
  "abrasive",
  "abrupt",
  "absent",
  "absorbed",
  "absurd",
  "abundant",
  "acceptable",
  "accidental",
  "accurate",
  "ad hoc",
  "adamant",
  "adaptable",
  "addicted",
  "adhesive",
  "adorable",
  "adventurous",
  "afraid",
  "agreeable",
  "alert",
  "alive",
  "alleged",
  "amazing",
  "ambiguous",
  "ambitious",
  "amused",
  "amusing",
  "ancient",
  "angry",
  "animated",
  "annoyed",
  "annoying",
  "apathetic",
  "aquatic",
  "aromatic",
  "arrogant",
  "ashamed",
  "aspiring",
  "astonishing",
  "attractive",
  "automatic",
  "available",
  "average",
  "aware",
  "awesome",
  "awful",
  "bad",
  "beautiful",
  "befitting",
  "beneficial",
  "bent",
  "berserk",
  "bewildered",
  "big",
  "bite-sized",
];

const adjectiveAnimal =
  adjectives[Math.floor(Math.random() * adjectives.length)] +
  " " +
  animals[Math.floor(Math.random() * animals.length)];

let initialClientId = adjectiveAnimal;

export default async function Notes({
  params,
  searchParams,
}: {
  params: {
    key: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const file = await getOrCreateFile(params.key);
  const content = await getFile(file);

  const customName = searchParams["name"]?.toString() ?? null;

  return (
    <NotesEntry
      file={file}
      content={content}
      localId={
        cookies().get("local-id")?.value ?? customName ?? initialClientId
      }
    />
  );
}
