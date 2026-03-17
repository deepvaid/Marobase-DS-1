<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MbWysiwygEditorProps, MbWysiwygEditorState } from './MbWysiwygEditor.types';
import '../styles/mb-wysiwyg-editor.css';

const defaultContent = `<h1>Headline 1</h1><p>Text</p><ul><li>List item</li><li>List item</li><li>List item</li><li>List item</li></ul>`;

const props = withDefaults(defineProps<MbWysiwygEditorProps>(), {
  modelValue: defaultContent,
  label: 'Label',
  hint: 'Hint text',
  errorMessage: 'Error message',
  required: false,
  state: 'default',
  disabled: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'focus', payload: FocusEvent): void;
  (event: 'blur', payload: FocusEvent): void;
  (event: 'command', payload: { command: string; event: MouseEvent }): void;
}>();

const hasFocus = ref(false);
const internalValue = ref(props.modelValue ?? defaultContent);
const messageId = `mb-wy-msg-${Math.random().toString(36).slice(2, 10)}`;

watch(
  () => props.modelValue,
  (next) => {
    internalValue.value = next ?? '';
  }
);

const state = computed<MbWysiwygEditorState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const isError = computed(() => state.value === 'error');
const isDisabled = computed(() => state.value === 'disabled');

const visualState = computed<MbWysiwygEditorState>(() => {
  if (state.value !== 'default') return state.value;
  if (hasFocus.value) return 'focus';
  return 'default';
});

const toolbarButtons = [
  { command: 'bold', label: 'Bold', icon: 'bold' },
  { command: 'italic', label: 'Italic', icon: 'italic' },
  { command: 'more', label: 'More', icon: 'more' },
  { command: 'align-left', label: 'Align left', icon: 'align-left', selected: true },
  { command: 'align-center', label: 'Align center', icon: 'align-center' },
  { command: 'align-right', label: 'Align right', icon: 'align-right' },
  { command: 'link', label: 'Insert link', icon: 'link' },
  { command: 'image', label: 'Insert image', icon: 'image' },
  { command: 'code', label: 'Code', icon: 'code' },
  { command: 'mention', label: 'Mention', icon: 'mention' }
] as const;

const displayValue = computed(() => internalValue.value ?? '');

function onInput(event: Event) {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  const value = target.innerHTML;
  internalValue.value = value;
  emit('update:modelValue', value);
}

function onFocus(event: FocusEvent) {
  hasFocus.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  hasFocus.value = false;
  emit('blur', event);
}

function onCommand(command: string, event: MouseEvent) {
  if (isDisabled.value) return;
  emit('command', { command, event });
}
</script>

<template>
  <div class="mb-wy" :data-state="visualState">
    <label class="mb-wy__label" :aria-label="ariaLabel ?? label">
      <span>{{ label }}</span>
      <span v-if="required" class="mb-wy__required">*</span>
    </label>

    <div class="mb-wy__container">
      <div class="mb-wy__toolbar">
        <label class="mb-wy__toolbar-select-wrap">
          <select class="mb-wy__toolbar-select" :disabled="isDisabled" aria-label="Text style">
            <option>Regular text</option>
            <option>Headline</option>
            <option>Subheading</option>
          </select>
          <span class="mb-wy__toolbar-select-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </label>

        <span class="mb-wy__divider" />

        <button
          v-for="button in toolbarButtons"
          :key="button.command"
          type="button"
          class="mb-wy__toolbar-btn"
          :data-selected="button.selected ? 'true' : 'false'"
          :disabled="isDisabled"
          :aria-label="button.label"
          @click="onCommand(button.command, $event)"
        >
          <span class="mb-wy__toolbar-icon" :class="`mb-wy__toolbar-icon--${button.icon}`" aria-hidden="true">
            <svg
              v-if="button.icon === 'align-left'"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M4 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M4 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg
              v-else-if="button.icon === 'align-center'"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M7 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M4 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg
              v-else-if="button.icon === 'align-right'"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M8 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M4 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg
              v-else-if="button.icon === 'link'"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.5 14.5L14.5 9.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 17C4.8 14.8 4.8 11.2 7 9L9 7C11.2 4.8 14.8 4.8 17 7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 7C19.2 9.2 19.2 12.8 17 15L15 17C12.8 19.2 9.2 19.2 7 17"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else-if="button.icon === 'image'"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" stroke-width="2" />
              <circle cx="9" cy="10" r="1.5" fill="currentColor" />
              <path
                d="M5.5 17L10.5 12L13.5 15L17.5 11L20.5 14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else-if="button.icon === 'code'"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 7L4 12L9 17" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15 7L20 12L15 17" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span v-else>{{ button.icon === 'more' ? '...' : button.icon === 'mention' ? '@' : button.icon === 'italic' ? 'I' : 'B' }}</span>
          </span>
        </button>
      </div>

      <div
        class="mb-wy__editor"
        :contenteditable="(!isDisabled).toString()"
        :aria-disabled="isDisabled ? 'true' : 'false'"
        :aria-label="ariaLabel ?? label"
        :aria-invalid="isError ? 'true' : 'false'"
        :aria-describedby="messageId"
        spellcheck="false"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        v-html="displayValue"
      />
    </div>

    <p v-if="!isError" :id="messageId" class="mb-wy__hint">{{ hint }}</p>
    <p v-else :id="messageId" class="mb-wy__error">{{ errorMessage }}</p>
  </div>
</template>
