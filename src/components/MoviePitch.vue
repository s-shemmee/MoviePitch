<template>
  <div class="pitch-wrapper">
    <PitchForm v-if="!showOutput" />
    <PitchResult v-else />
  </div>
</template>

<script setup>
import PitchForm from '@/components/PitchForm.vue';
import PitchResult from '@/components/PitchResult.vue';
import { useMoviePitch } from '@/composables/useMoviePitch.js';

const { showOutput } = useMoviePitch();
</script>

<style scoped>
.pitch-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>