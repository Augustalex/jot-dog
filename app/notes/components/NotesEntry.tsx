"use client";

import React from "react";
import styles from "./notes-entry.module.css";
import { Editor } from "./editor/Editor";
import { ClientSwrConfig } from "./ClientSwrConfig";
import { NoteFile } from "../utils/file-utils";
import { Cursors } from "./cursors/Cursors";
import { cookies } from "next/headers";

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

const adjectiveAnimal = () => {
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    "-" +
    animals[Math.floor(Math.random() * animals.length)]
  );
};

export default function NotesEntry({
  file,
  content,
  customName,
  localId: initialLocalId,
}: {
  file: NoteFile;
  content: string;
  customName: string | null;
  localId: string;
}) {
  const localId = initialLocalId ?? customName ?? adjectiveAnimal();
  return (
    <ClientSwrConfig fallback={{}}>
      <main className="main tomato">
        <div className={styles.window}>
          <Editor file={file} localId={localId} serverContent={content} />
          <Cursors localId={localId} />
        </div>
      </main>
    </ClientSwrConfig>
  );
}
