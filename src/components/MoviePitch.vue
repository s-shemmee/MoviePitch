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
        <textarea v-model="userInput" id="setup-textarea" placeholder="An evil genius wants to take over the world using AI."></textarea>
        <button @click="submitSetup" class="send-btn" id="send-btn" aria-label="send">
          <img src="@/assets/send.png" alt="send" />
        </button>
      </div>
    </section>

    <!-- Output Section -->
    <section class="output-container" id="output-container" v-if="showOutput">
      <div id="output-img-container" class="output-img-container">
        <img :src="imageUrl" alt="Movie Poster" />
      </div>
      <h1 id="output-title">{{ title }}</h1>
      <h2 id="output-stars">{{ stars }}</h2>
      <p id="output-text">{{ text }}</p>
      <button class="view-pitch-btn" @click="viewPitch" aria-label="View Pitch">
        View Pitch
      </button>
    </section>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import OpenAI from 'openai';

  // Load the API key from the environment variable
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // Initialize OpenAI client
  const openai = new OpenAI(apiKey);

  // Reactive Variables
  const userInput = ref("");
  const imageUrl = ref("");
  const title = ref("");
  const stars = ref("");
  const text = ref("");
  const showOutput = ref(false);
  const setupInputContainer = ref(null);
  const movieBossText = ref(null);
  const speechBubble = ref(null);

  // Show Loading Indicator
  const showLoadingIndicator = () => {
    setupInputContainer.value.innerHTML = `<img src="@/assets/loading.svg" class="loading" id="loading">`;
    movieBossText.value.innerText = `Ok, just wait a second while my digital brain digests that...`;
  };

  // Submit User Input
  const submitSetup = async () => {
    if (userInput.value) {
      showLoadingIndicator();
      await fetchBotReply(userInput.value);
      await fetchSynopsis(userInput.value);
    }
  };

  // Fetch Bot Reply
  const fetchBotReply = async (outline) => {
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it.
            ###
            outline: ${outline}
            message: `,
          },
        ],
        max_tokens: 60,
      });

      movieBossText.value.innerText = response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error fetching bot reply:', error);
    }
  };

  // Fetch Synopsis
  const fetchSynopsis = async (outline) => {
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Generate an engaging, professional and marketable movie synopsis based on an outline. The synopsis should include actors names in brackets after each character. Choose actors that would be ideal for this role. 
            ###
            outline: ${outline}
            synopsis: `,
          },
        ],
        max_tokens: 700,
      });

      const synopsis = response.data.choices[0].message.content.trim();
      text.value = synopsis;
      await fetchTitle(synopsis);
      await fetchStars(synopsis);
      await fetchImagePrompt(title.value, synopsis);
    } catch (error) {
      console.error('Error fetching synopsis:', error);
    }
  };

  // Fetch Movie Title
  const fetchTitle = async (synopsis) => {
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Generate a catchy movie title for this synopsis: ${synopsis}`,
          },
        ],
        max_tokens: 25,
        temperature: 0.7,
      });

      title.value = response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error fetching title:', error);
    }
  };

  // Fetch Cast Stars
  const fetchStars = async (synopsis) => {
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Extract the names in brackets from the synopsis.
            ###
            synopsis: ${synopsis}
            names: `,
          },
        ],
        max_tokens: 30,
      });

      stars.value = response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error fetching stars:', error);
    }
  };

  // Fetch Image Prompt and URL
  const fetchImagePrompt = async (title, synopsis) => {
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Give a short description of an image which could be used to advertise a movie based on a title and synopsis. The description should be rich in visual detail but contain no names.
            ###
            title: ${title}
            synopsis: ${synopsis}
            image description: `,
          },
        ],
        temperature: 0.8,
        max_tokens: 100,
      });

      await fetchImageUrl(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error fetching image prompt:', error);
    }
  };

  // Fetch Image URL
  const fetchImageUrl = async (imagePrompt) => {
    try {
      const response = await openai.createImage({
        prompt: `${imagePrompt}. There should be no text in this image.`,
        n: 1,
        size: '256x256',
        response_format: 'b64_json',
      });

      imageUrl.value = `data:image/png;base64,${response.data.data[0].b64_json}`;
      showOutput.value = true;
    } catch (error) {
      console.error('Error fetching image URL:', error);
    }
  };

  // Switch to Output View
  const viewPitch = () => {
    document.getElementById('setup-container').style.display = 'none';
    document.getElementById('output-container').style.display = 'flex';
    movieBossText.value.innerText = `This idea is so good I'm jealous! It's gonna make you rich for sure! Remember, I want 10% 💰`;
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
  max-width: 55%;
  min-height: 124px;
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
