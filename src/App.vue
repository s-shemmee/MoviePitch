<!-- App.vue -->
<template>
  <div>
    <header>
      <img src="./assets/logo-movie.png" alt="MoviePitch">
      <a href="/"><span>Movie</span>Pitch</a>
    </header>
    <main>
      <SetupComponent @submit="handleSubmit" />
      <OutputComponent :title="title" :stars="stars" :text="text" :imageUrl="imageUrl" @viewPitch="handleViewPitch" />
    </main>
    <footer>
      &copy; 2023 MoviePitch All rights reserved
    </footer>
  </div>
</template>

<script>

</script>
