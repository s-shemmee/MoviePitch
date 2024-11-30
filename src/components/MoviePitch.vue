<template>
  <div>
    <!-- Setup Section -->
    <section id="setup-container" ref="setupInputContainer">
      <div class="setup-inner">
        <img src="@/assets/boss.png" alt="MovieBoss" />

        <div class="speech-bubble-ai" ref="speechBubble">
          <p ref="movieBossText">
            Give me a one-sentence concept, and I'll give you an eye-catching title, a synopsis the studios will love, a movie poster... AND choose the cast!
          </p>
        </div>
      </div>

      <div class="setup-inner setup-input-container">
        <textarea 
          v-model="userInput" 
          id="setup-textarea" 
          placeholder="An evil genius wants to take over the world using AI."
        ></textarea>
        <button 
          @click="submitSetup" 
          class="send-btn" 
          id="send-btn" 
          aria-label="send" 
          :disabled="isLoading"
        >
          <img 
            v-if="!isLoading" 
            src="@/assets/send.png" 
            alt="send" 
          />
          <img 
            v-else 
            src="@/assets/loading.svg" 
            alt="loading" 
            class="loading-icon"
          />
        </button>
      </div>
    </section>

    <!-- Output Section -->
    <section 
      class="output-container" 
      id="output-container" 
      v-if="showOutput"
    >
      <div class="output-img-container">
        <img :src="imageUrl" alt="Movie Poster" />
      </div>
      <h1>{{ title }}</h1>
      <h2>{{ stars }}</h2>
      <p>{{ text }}</p>
      <button 
        class="view-pitch-btn" 
        @click="viewPitch" 
        aria-label="View Pitch"
      >
        View Pitch
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
//import OpenAI from 'openai';

//const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
//const openai = new OpenAI(apiKey);

// Reactive Variables
const userInput = ref("");
const imageUrl = ref("");
const title = ref("");
const stars = ref("");
const text = ref("");
const showOutput = ref(false);
const isLoading = ref(false);
const movieBossText = ref(null);

// Helper Functions
const showLoading = (message) => {
  isLoading.value = true;
  movieBossText.value.innerText = message || "Processing your idea, give me a moment...";
};

const resetLoading = () => {
  isLoading.value = false;
};

const handleError = (error, userMessage) => {
  console.error(error);
  movieBossText.value.innerText = userMessage || "Something went wrong. Please try again.";
};

// Submit User Input
const submitSetup = async () => {
  if (!userInput.value.trim()) {
    alert("Please enter a valid movie concept.");
    return;
  }
  showLoading("Hold tight! Movie magic in progress...");
  try {
    await generateMoviePitch(userInput.value);
  } catch (error) {
    handleError(error, "Oops! I couldn't process your idea. Try again.");
  } finally {
    resetLoading();
  }
};

// Generate Full Movie Pitch
const generateMoviePitch = async (outline) => {
  try {
    await fetchBotReply(outline);
    const synopsis = await fetchSynopsis(outline);
    title.value = await fetchTitle(synopsis);
    stars.value = await fetchStars(synopsis);
    imageUrl.value = await fetchImage(synopsis);
    showOutput.value = true;
  } catch (error) {
    handleError(error, "Something went wrong while creating your pitch.");
    throw error; // Propagate to stop further execution.
  }
};

// Fetch Bot Reply
const fetchBotReply = async (outline) => {
  return await fetchFromAPI({
    prompt: `This outline sounds interesting: ${outline}. Give a short enthusiastic reply.`,
    maxTokens: 60,
    updateUI: (data) => {
      movieBossText.value.innerText = data.trim();
    },
    errorMessage: "Couldn't get a response. Please try again.",
  });
};

// Fetch Synopsis
const fetchSynopsis = async (outline) => {
  return await fetchFromAPI({
    prompt: `Generate a professional movie synopsis for: ${outline}. Include actors' names in brackets.`,
    maxTokens: 700,
    errorMessage: "Failed to fetch a synopsis. Please try again.",
  });
};

// Fetch Movie Title
const fetchTitle = async (synopsis) => {
  return await fetchFromAPI({
    prompt: `Suggest a catchy title for this movie synopsis: ${synopsis}`,
    maxTokens: 25,
    errorMessage: "Couldn't generate a title. Please try again.",
  });
};

// Fetch Stars
const fetchStars = async (synopsis) => {
  return await fetchFromAPI({
    prompt: `Extract actors' names in brackets from: ${synopsis}`,
    maxTokens: 30,
    errorMessage: "Failed to fetch cast details. Please try again.",
  });
};

// Fetch Image
const fetchImage = async (synopsis) => {
  try {
    const response = await openai.createImage({
      prompt: `${synopsis}. A detailed movie poster without text.`,
      n: 1,
      size: '512x512',
      response_format: 'b64_json',
    });
    return `data:image/png;base64,${response.data.data[0].b64_json}`;
  } catch (error) {
    throw new Error("Image generation failed.");
  }
};

// Generic Fetch Function
const fetchFromAPI = async ({ prompt, maxTokens, updateUI, errorMessage }) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    });
    const result = response.data.choices[0].message.content.trim();
    if (updateUI) updateUI(result);
    return result;
  } catch (error) {
    handleError(error, errorMessage);
    throw error;
  }
};

// Switch to Output View
const viewPitch = () => {
  document.getElementById('setup-container').style.display = 'none';
  document.getElementById('output-container').style.display = 'block';
};
</script>

<style scoped>
/* General Styles */
section {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--light);
  border-radius: var(--border-rad-lg);
  padding: 16px;
  box-shadow: 0px 1px 18px 3px var(--dark);
  max-width: 500px;
  width: calc(100% - 32px);
  z-index: 1000;
}

/* Setup Section */
.setup-inner {
  display: flex;
  justify-content: space-around;
  padding: 24px 8px;
  min-height: 234px;
}

.setup-inner > img {
  width: 40%;
  filter: drop-shadow(3px 2px 3px var(--medium-dark));
  align-self: center;
}

.setup-input-container {
  min-height: 74px;
}

.speech-bubble-ai {
  max-width: 100%;
  min-height: 120px;
  border-radius: var(--border-rad-lg);
  position: relative;
  margin: 0;
  border: 3px solid var(--medium-dark);
  background-color: var(--white);
  align-self: flex-start;
  display: flex;
  align-items: center;
}

.speech-bubble-ai:before {
  content: "";
  position: absolute;
  border-left: 9px solid transparent;
  border-right: 9px solid var(--medium-dark);
  border-top: 9px solid var(--medium-dark);
  border-bottom: 9px solid transparent;
  left: -21px;
  top: 64px;
}

.speech-bubble-ai:after {
  content: "";
  position: absolute;
  border-left: 7px solid transparent;
  border-right: 7px solid var(--white);
  border-top: 7px solid var(--white);
  border-bottom: 7px solid transparent;
  left: -11px;
  top: 68px;
}

.speech-bubble-ai > p {
  padding: 0 1.3em;
  color: var(--dark);
  font-size: 14px;
}

textarea {
  background-color: var(--light-grey);
  padding: 8px;
  border: none;
  border-top-right-radius: 0;
  border-top-left-radius: var(--border-rad-lg);
  border-bottom-right-radius: 0;
  border-bottom-left-radius: var(--border-rad-lg);
  width: 100%;
  resize: none;
  min-height: 40px;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

textarea::placeholder {
  color: var(--medium-dark);
  font-size: 14px;
  opacity: 0.8;
}

/* Larger Mobile Screens */
@media (min-width: 380px) {
  .setup-input-container {
    padding-top: 0;
  }

  .speech-bubble-ai:before {
    top: 92px;
  }

  .speech-bubble-ai:after {
    top: 96px;
  }

  .speech-bubble-ai > p {
    font-size: 16px;
  }

  textarea::placeholder {
    font-size: 16px;
    opacity: 0.8;
  }
}

/* Buttons and SVG */
button {
  border: none;
  background: var(--pink);
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: var(--dark);
}

button:focus {
  outline: 2px solid var(--medium-dark);
}

.send-btn {
  border-top-right-radius: var(--border-rad-lg);
  border-bottom-right-radius: var(--border-rad-lg);
  min-width: 50px;
}

.send-btn > img {
  width: 1.6em;
  vertical-align: middle;
}

.view-pitch-btn {
  color: var(--light);
  border-radius: var(--border-rad-lg);
  padding: 16px;
  margin: 4px auto;
  display: block;
  font-size: 18px;
  transition: box-shadow 0.3s;
}

.view-pitch-btn:hover {
  box-shadow: 1px 1px 5px 1px var(--medium-dark);
}

img.loading {
  max-width: 40px;
  filter: none;
}

/* Output Section */
.output-container {
  display: none;
  flex-direction: column;
  margin: 16px auto;
  color: var(--dark);
  padding: 16px;
}

.output-img-container > img {
  width: 100%;
  border-radius: var(--border-rad-lg);
  box-shadow: 1px 1px 5px 1px var(--dark);
}
</style>