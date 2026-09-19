<template>
  <section class="output-container">
    <div class="output-img-container">
      <img :src="imageUrl" :alt="`Movie poster for ${title}`" />
    </div>

    <h1>{{ title }}</h1>

    <div class="cast-block" v-if="cast.length">
      <span class="cast-label">Starring</span>
      <p class="cast-names">{{ cast.join(" · ") }}</p>
    </div>

    <p class="synopsis">{{ synopsis }}</p>

    <button class="new-pitch-btn" @click="startOver" aria-label="Create another pitch">
      New Pitch
    </button>
  </section>
</template>

<script setup>
import { useMoviePitch } from "@/composables/useMoviePitch.js";

const { title, synopsis, cast, imageUrl, startOver } = useMoviePitch();
</script>

<style scoped>

.output-container {
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    "poster title"
    "poster cast"
    "poster synopsis"
    "button button";
  column-gap: 32px;
  row-gap: 16px;

  padding: 32px;

  background-color: var(--light);
  color: var(--dark);

  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(36, 37, 38, 0.35);
  cursor: pointer;
  user-select: none;
}

/* Poster */

.output-img-container {
  grid-area: poster;
  align-self: start;
}

.output-img-container > img {
  display: block;

  width: 300px;
  aspect-ratio: 2 / 3;
  object-fit: cover;

  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(36, 37, 38, 0.35);
}

/* Title */

.output-container h1 {
  grid-area: title;
  align-self: end;

  margin: 0;

  font-family: "Playfair Display SC", serif;
  font-size: 36px;
  line-height: 1.1;
  text-align: left;
  cursor: pointer;
  user-select: none;
}

/* Cast */

.cast-block {
  grid-area: cast;
  margin: 8px 0 4px;
}

.cast-label {
  display: block;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  color: var(--pink-accessible);

  margin-bottom: 4px;
}

.cast-names {
  margin: 0;

  font-family: "Poppins", sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;

  color: var(--medium-dark);
  cursor: pointer;
  user-select: none;
}

/* Synopsis */

.synopsis {
  grid-area: synopsis;
  align-self: start;

  margin: 0;

  font-family: "Poppins", sans-serif;
  font-size: 16px;
  line-height: 1.7;
  cursor: pointer;
  user-select: none;
}

/* New pitch */

.new-pitch-btn {
  grid-area: button;
  justify-self: center;

  margin-top: 8px;

  border: none;
  border-radius: 12px;

  background-color: var(--pink-accessible);
  color: var(--white);

  padding: 13px 28px;

  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.3s,
    box-shadow 0.3s,
    transform 0.2s;
}

.new-pitch-btn:hover {
  background-color: var(--dark);
  box-shadow: 0 3px 8px rgba(36, 37, 38, 0.3);
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .new-pitch-btn:hover {
    transform: none;
  }
}

/* Mobile */

@media (max-width: 600px) {
  .output-container {
    max-width: 500px;

    grid-template-columns: 1fr;
    grid-template-areas:
      "poster"
      "title"
      "cast"
      "synopsis"
      "button";

    padding: 24px;
    row-gap: 12px;
  }

  .output-img-container {
    justify-self: center;
  }

  .output-img-container > img {
    width: 220px;
  }

  .output-container h1 {
    align-self: auto;
    text-align: center;
    font-size: 30px;
    margin-top: 8px;
  }

  .cast-block {
    text-align: center;
  }

  .synopsis {
    font-size: 15px;
    text-align: left;
  }

  .new-pitch-btn {
    margin-top: 4px;
  }
}
</style>