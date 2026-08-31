import { ref } from "vue";

const userInput = ref("");
const bossMessage = ref(
  "Give me a one-sentence concept, and I'll give you an eye-catching title, a synopsis the studios will love, a movie poster... AND choose the cast!"
);
const isLoading = ref(false);
const showOutput = ref(false);
const errorMessage = ref("");

const title = ref("");
const synopsis = ref("");
const cast = ref([]);
const imageUrl = ref("");

const DEFAULT_BOSS_MESSAGE =
  "Give me a one-sentence concept, and I'll give you an eye-catching title, a synopsis the studios will love, a movie poster... AND choose the cast!";

export function useMoviePitch() {
  const resetOutput = () => {
    title.value = "";
    synopsis.value = "";
    cast.value = [];
    imageUrl.value = "";
    showOutput.value = false;
  };

  const submitIdea = async () => {
    errorMessage.value = "";
    const idea = userInput.value.trim();

    if (!idea) {
      errorMessage.value = "Please enter a movie concept.";
      return;
    }

    isLoading.value = true;
    bossMessage.value = "Hold tight! Movie magic in progress...";

    try {
      const pitchRes = await fetch("/api/generate-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!pitchRes.ok) {
        const { error } = await pitchRes.json().catch(() => ({}));
        throw new Error(error || "Couldn't generate a pitch.");
      }

      const pitch = await pitchRes.json();

      if (!pitch.isValidPitch) {
        bossMessage.value = pitch.botReply;
        return;
      }

      bossMessage.value = pitch.botReply;
      title.value = pitch.title;
      synopsis.value = pitch.synopsis;
      cast.value = pitch.cast;

      await new Promise((resolve) => setTimeout(resolve, 2200));

      const imageRes = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePrompt: pitch.imagePrompt }),
      });

      if (!imageRes.ok) {
        const { error } = await imageRes.json().catch(() => ({}));
        throw new Error(error || "Couldn't generate the poster.");
      }

      const { imageUrl: url } = await imageRes.json();
      imageUrl.value = url;
      showOutput.value = true;
    } catch (error) {
      console.error(error);
      errorMessage.value = error.message || "Something went wrong. Please try again.";
      bossMessage.value = "Oops! Something went wrong on my end. Try again?";
    } finally {
      isLoading.value = false;
    }
  };

  const startOver = () => {
    userInput.value = "";
    bossMessage.value = DEFAULT_BOSS_MESSAGE;
    errorMessage.value = "";
    resetOutput();
  };

  return {
    userInput,
    bossMessage,
    isLoading,
    showOutput,
    errorMessage,
    title,
    synopsis,
    cast,
    imageUrl,
    submitIdea,
    startOver,
  };
}