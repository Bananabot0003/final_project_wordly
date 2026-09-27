const searchForm = document.querySelector("#search-form");
const wordInput = document.querySelector("#word-input");
const wordResult = document.querySelector("#word-result");


async function getWord(word) {

  const url =
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

  wordResult.textContent = "Searching...";

  try {

    const response = await fetch(url);

    if (!response.ok) {

      if (response.status === 404) {
        wordResult.textContent =
          "Sorry, we could not find that word.";
      } else {
        wordResult.textContent =
          "Sorry, something went wrong. Please try again.";
      }

      return;
    }


    const data = await response.json();

    const wordData = data[0];

    const wordName = wordData.word;

    const partOfSpeech =
      wordData.meanings[0].partOfSpeech;

    const definition =
      wordData.meanings[0].definitions[0].definition;


    // SYNONYMS

    const synonyms =
      wordData.meanings[0].synonyms;

    let synonymText = "No synonyms found.";

    if (synonyms.length > 0) {
      synonymText = synonyms.join(", ");
    }


    // PRONUNCIATION

    let pronunciation =
      "Pronunciation not available.";

    if (wordData.phonetic) {
      pronunciation = wordData.phonetic;
    }


    // FIND AUDIO

    let audioURL = "";

    for (let phonetic of wordData.phonetics) {

      if (phonetic.audio) {
        audioURL = phonetic.audio;
        break;
      }

    }


    // CLEAR OLD RESULTS

    wordResult.textContent = "";


    // WORD

    const wordHeading =
      document.createElement("h3");

    wordHeading.textContent = wordName;

    wordResult.appendChild(wordHeading);


    // PART OF SPEECH

    const part =
      document.createElement("p");

    part.textContent =
      "Part of Speech: " + partOfSpeech;

    wordResult.appendChild(part);


    // PRONUNCIATION

    const pronunciationText =
      document.createElement("p");

    pronunciationText.textContent =
      "Pronunciation: " + pronunciation;

    wordResult.appendChild(pronunciationText);


    // DEFINITION

    const definitionText =
      document.createElement("p");

    definitionText.textContent =
      "Definition: " + definition;

    wordResult.appendChild(definitionText);


    // SYNONYMS

    const synonymResult =
      document.createElement("p");

    synonymResult.textContent =
      "Synonyms: " + synonymText;

    wordResult.appendChild(synonymResult);


    // AUDIO

    if (audioURL !== "") {

      const audioTitle =
        document.createElement("p");

      audioTitle.textContent =
        "Listen to pronunciation:";

      wordResult.appendChild(audioTitle);


      const audio =
        document.createElement("audio");

      audio.controls = true;
      audio.src = audioURL;

      wordResult.appendChild(audio);

    } else {

      const noAudio =
        document.createElement("p");

      noAudio.textContent =
        "Audio pronunciation not available.";

      wordResult.appendChild(noAudio);

    }

  }

  catch (error) {

    wordResult.textContent =
      "Unable to connect to the dictionary. Please try again.";

    console.log(error);

  }

}


searchForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    const word =
      wordInput.value.trim();

    if (word === "") {

      wordResult.textContent =
        "Please enter a word.";

      return;

    }

    getWord(word);

  }
);