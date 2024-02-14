function searchWord() {
  const word = document.getElementById("searchInput").value.trim();
  if (!word) {
    alert("Please enter a word.");
    return;
  }
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayResult(data);
      clearInput(); // Clear input box after displaying results
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      document.getElementById("result").innerHTML =
        '<p class="text-danger">Error fetching data. Please try again later.</p>';
    });
}

function displayResult(data) {
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = ""; // Clear previous results
  const entriesByPartOfSpeech = {};
  data.forEach((entry) => {
    const word = entry.word;
    const meanings = entry.meanings;
    meanings.forEach((meaning) => {
      const partOfSpeech = meaning.partOfSpeech;
      if (!entriesByPartOfSpeech[partOfSpeech]) {
        entriesByPartOfSpeech[partOfSpeech] = [];
      }
      entriesByPartOfSpeech[partOfSpeech].push({
        word,
        definitions: meaning.definitions,
      });
    });
  });
  for (const partOfSpeech in entriesByPartOfSpeech) {
    const entries = entriesByPartOfSpeech[partOfSpeech];
    const card = document.createElement("div");
    card.classList.add("card", "mb-4");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = partOfSpeech.toUpperCase();
    cardBody.appendChild(title);
    entries.forEach((entry) => {
      const word = entry.word;
      const definitions = entry.definitions;
      const wordTitle = document.createElement("h6");
      wordTitle.textContent = word;
      cardBody.appendChild(wordTitle);
      let defCount = 0; // Counter for definitions
      let exampleCount = 0; // Counter for examples
      definitions.forEach((definition) => {
        if (defCount >= 3 && exampleCount >= 3) {
          return; // Exit loop if both definitions and examples limits are reached
        }
        const def = document.createElement("p");
        def.textContent = `Definition: ${definition.definition}`;
        cardBody.appendChild(def);
        defCount++;
        if (definition.example && exampleCount < 3) {
          const example = document.createElement("p");
          example.textContent = `Example: ${definition.example}`;
          cardBody.appendChild(example);
          exampleCount++;
        }
        if (defCount >= 3 && exampleCount >= 3) {
          return; // Exit loop if both definitions and examples limits are reached
        }
        if (definition.synonyms && definition.synonyms.length > 0) {
          const synonyms = document.createElement("p");
          synonyms.textContent = `Synonyms: ${definition.synonyms.join(", ")}`;
          cardBody.appendChild(synonyms);
        }
        if (definition.antonyms && definition.antonyms.length > 0) {
          const antonyms = document.createElement("p");
          antonyms.textContent = `Antonyms: ${definition.antonyms.join(", ")}`;
          cardBody.appendChild(antonyms);
        }
      });
    });
    card.appendChild(cardBody);
    resultContainer.appendChild(card);
  }
}

function clearInput() {
  document.getElementById("searchInput").value = "";
}

function reloadPage() {
  location.reload(); // Reload the page
}
