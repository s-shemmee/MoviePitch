<!-- SetupComponent.vue -->
<template>
  <section id="setup-container">
    <div class="setup-inner">
      <img src="@/assets/movieboss.png" alt="MovieBoss">
      <div class="speech-bubble-ai" id="speech-bubble-ai">
        <p id="movie-boss-text">
          Give me a one-sentence concept, and I'll give you an eye-catching title, a synopsis the studios will love, a movie poster...
          AND choose the cast!
        </p>
      </div>
    </div>
    <div class="setup-inner setup-input-container" id="setup-input-container">
      <textarea v-model="userInput" id="setup-textarea" placeholder="An evil genius wants to take over the world using AI."></textarea>
      <button @click="submitSetup" class="send-btn" id="send-btn" aria-label="send">
        <img src="@/assets/send-btn-icon.png" alt="send">
      </button>
    </div>
  </section>
</template>

<script>

</script>