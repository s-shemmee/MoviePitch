<template>
  <div>
    <header>
      <img src="@/assets/logo.png" alt="MoviePitch">
      <a href="/"><span>Movie</span>Pitch</a>
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
import { ref } from 'vue';
import MoviePitch from '@/components/MoviePitch.vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
header {
  background-color: var(--dark);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  z-index: 1000;
}

header > img {
  height: 26px;
}

header > a {
  color: var(--light);
  font-size: 24px;
  text-decoration: none;
  padding: 16px 0;
}

header span {
  font-weight: 700;
}

main {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--dark);
  color: var(--light);
  padding: 8px;
  font-size: 14px;
  text-align: center;
  z-index: 1000;
}
</style>
