import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMoviePitch } from './useMoviePitch.js';

describe('useMoviePitch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows an error when the user submits an empty pitch', async () => {
    const pitch = useMoviePitch();

    pitch.userInput.value = '   ';
    await pitch.submitIdea();

    expect(pitch.errorMessage.value).toBe('Please enter a movie concept.');
    expect(pitch.isLoading.value).toBe(false);
  });

  it('stores the bot rejection message when the idea is invalid', async () => {
    const pitch = useMoviePitch();
    pitch.userInput.value = 'How to hack a bank';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        isValidPitch: false,
        botReply: 'This is not a movie idea. Try again with a story concept.',
      }),
    });

    await pitch.submitIdea();

    expect(pitch.bossMessage.value).toBe('This is not a movie idea. Try again with a story concept.');
    expect(pitch.showOutput.value).toBe(false);
  });

  it('produces a valid pitch and poster when the API accepts the idea', async () => {
    vi.useFakeTimers();

    const pitch = useMoviePitch();
    pitch.userInput.value = 'A clever thief steals the moon';

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          isValidPitch: true,
          botReply: 'That is a strong premise.',
          title: 'Moon Heist',
          synopsis: 'A thief tries to steal the moon before sunrise.',
          cast: ['Kai', 'Maya', 'Dr. Vale'],
          imagePrompt: 'a futuristic city at night',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ imageUrl: 'https://example.com/poster.png' }),
      });

    const submitPromise = pitch.submitIdea();
    await vi.advanceTimersByTimeAsync(2200);
    await submitPromise;

    expect(pitch.title.value).toBe('Moon Heist');
    expect(pitch.synopsis.value).toContain('steal the moon');
    expect(pitch.cast.value).toHaveLength(3);
    expect(pitch.imageUrl.value).toBe('https://example.com/poster.png');
    expect(pitch.showOutput.value).toBe(true);

    vi.useRealTimers();
  });
});
