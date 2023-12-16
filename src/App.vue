<template>
  <div>
    <header>
      <img src="@/assets/logo-movie.png" alt="MoviePitch">
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

<script>
import { defineComponent } from 'vue';
import MoviePitch from '@/components/MoviePitch.vue';

export default defineComponent({
  components: {
    MoviePitch,
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
});
</script>
