<template>
  <div class="app">
    <header>
      <h1>
        <a href="/">
          <img src="@/assets/logo.png" alt="" />
          <span>Movie</span>Pitch
        </a>
      </h1>
    </header>

    <main>
      <MoviePitch />
    </main>

    <footer>
      &copy; {{ currentYear }} MoviePitch All rights reserved
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MoviePitch from "@/components/MoviePitch.vue";

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */

header {
  flex-shrink: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: var(--dark);
}

header h1 {
  margin: 0;
  font-family: "Poppins", sans-serif; /* was inheriting global h1 → Playfair; brand lockup should stay Poppins per spec §12 */
}

header a {
  display: flex;
  align-items: center;
  gap: 4px;

  color: var(--light);
  font-size: 24px;
  font-weight: 400;
  text-decoration: none;
  padding: 16px 0;
}

header img {
  height: 26px;
  width: auto;
}

header span {
  font-weight: 700;
}

/* Main */

main {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 24px 16px;
}

/* Footer */

footer {
  flex-shrink: 0;

  background-color: var(--dark);
  color: var(--light);

  padding: 16px 8px;

  font-size: 14px;
  text-align: center;
}
</style>