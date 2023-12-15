<!-- OutputComponent.vue -->
<template>
  <section class="output-container" id="output-container">
    <div id="output-img-container" class="output-img-container">
      <img :src="imageUrl" alt="Movie Poster">
    </div>
    <h1 id="output-title">{{ title }}</h1>
    <h2 id="output-stars">{{ stars }}</h2>
    <p id="output-text">{{ text }}</p>
    <button class="view-pitch-btn" @click="viewPitch" aria-label="View Pitch">
      View Pitch
    </button>
  </section>
</template>

<script>

</script>
