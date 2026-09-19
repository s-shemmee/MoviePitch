import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PitchForm from './PitchForm.vue';

describe('PitchForm', () => {
  it('renders the textarea and send button', () => {
    const wrapper = mount(PitchForm);

    expect(wrapper.find('textarea').exists()).toBe(true);
    expect(wrapper.find('button[aria-label="Send"]').exists()).toBe(true);
  });
});
