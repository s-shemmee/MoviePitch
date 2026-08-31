<template>
  <section class="setup-container">
    <div class="setup-inner">
      <img src="@/assets/boss.png" alt="MovieBoss" />

      <div class="speech-bubble-ai" aria-live="polite">
        <p>{{ bossMessage }}</p>
      </div>
    </div>

    <div class="setup-inner setup-input-container">
      <label for="setup-textarea" class="sr-only">Your movie idea</label>
      <textarea
        ref="textareaRef"
        v-model="userInput"
        id="setup-textarea"
        placeholder="An evil genius wants to take over the world using AI."
        :disabled="isLoading"
        rows="1"
        @input="autoGrow"
      ></textarea>
      <button
        @click="submitIdea"
        class="send-btn"
        aria-label="Send"
        :aria-busy="isLoading"
        :disabled="isLoading"
      >
        <img v-if="!isLoading" src="@/assets/send.png" alt="" />
        <img v-else src="@/assets/loading.svg" alt="" class="loading-icon" />
      </button>
    </div>

    <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
  </section>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useMoviePitch } from "@/composables/useMoviePitch.js";

const { userInput, bossMessage, isLoading, errorMessage, submitIdea } = useMoviePitch();

const textareaRef = ref(null);

function autoGrow() {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

onMounted(() => {
  autoGrow();
  window.addEventListener("resize", autoGrow);
});

onUnmounted(() => {
  window.removeEventListener("resize", autoGrow);
});

watch(userInput, async (val) => {
  await nextTick();
  if (!textareaRef.value) return;
  if (!val) {
    autoGrow();
  } else {
    autoGrow();
  }
});
</script>

<style scoped>

.setup-container {
  position: relative;

  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 520px;
  box-sizing: border-box;

  padding: 32px;

  background-color: var(--light);

  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(36, 37, 38, 0.35);

  margin: 0 auto;
}

.setup-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0;

  min-height: 320px;
  gap: 24px;
}

.setup-inner > img {
  width: 40%;
  max-width: 190px;

  filter: drop-shadow(3px 2px 3px var(--medium-dark));
}

.speech-bubble-ai {
  position: relative;

  flex: 1;
  min-height: 120px;

  display: flex;
  align-items: center;

  margin: 0;

  border: 3px solid var(--medium-dark);
  border-radius: 18px;

  background-color: var(--white);
}

.speech-bubble-ai > p {
  padding: 0 20px;

  color: var(--dark);

  font-family: "Poppins", sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

.setup-input-container {
  min-height: 60px; 
  align-items: stretch; 
  gap: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

textarea {
  width: 100%;
  min-height: 60px;
  max-height: 120px;

  box-sizing: border-box;

  padding: 12px;

  border: none;
  border-radius: 15px 0 0 15px;

  background-color: var(--light-grey);

  resize: none;
  overflow-y: auto;

  font-family: "Poppins", sans-serif;
  font-size: 15px;
  line-height: 1.4;
}

textarea::placeholder {
  color: var(--medium-dark);
  font-size: 15px;
  opacity: 0.8;
}

textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  min-width: 52px;

  border: none;
  border-radius: 0 15px 15px 0;

  background-color: var(--pink-accessible);

  cursor: pointer;

  transition: background-color 0.3s, opacity 0.2s;
}

.send-btn:hover:not(:disabled) {
  background-color: var(--dark);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn > img {
  width: 25px;
  height: 25px;

  vertical-align: middle;
}

.loading-icon {
  width: 32px;
  height: auto;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-message {
  margin: 12px 4px 0;

  color: #b00020;

  font-family: "Poppins", sans-serif;
  font-size: 14px;
  text-align: center;
}

/* Small screens */

@media (max-width: 600px) {
  .setup-container {
    padding: 24px;
  }

  .setup-inner {
    gap: 16px;
    min-height: 280px;
  }

  .setup-inner > img {
    width: 35%;
  }

  .speech-bubble-ai > p {
    padding: 0 16px;
    font-size: 15px;
  }
}

@media (max-width: 379px) {
  .setup-container {
    padding: 20px;
  }

  .setup-inner {
    min-height: 240px;
    gap: 12px;
  }

  .speech-bubble-ai {
    min-height: 100px;
  }

  .speech-bubble-ai > p {
    padding: 0 12px;
    font-size: 14px;
  }

  textarea::placeholder {
    font-size: 14px;
  }
}

</style>