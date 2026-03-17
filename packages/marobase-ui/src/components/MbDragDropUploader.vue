<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  MbDragDropUploaderProps,
  MbDragDropUploaderState
} from './MbDragDropUploader.types';
import '../styles/mb-drag-drop-uploader.css';

const props = withDefaults(defineProps<MbDragDropUploaderProps>(), {
  label: 'Label',
  browseLabel: 'browse file',
  helperText: 'PDF, XLS, DOCX, JPG, PNG up to 5 MB',
  accept: '.pdf,.xls,.xlsx,.doc,.docx,.jpg,.jpeg,.png',
  multiple: false,
  disabled: false,
  state: 'default',
  hint: 'Hint text',
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'files-selected', files: File[]): void;
  (event: 'drop', files: File[]): void;
  (event: 'focus', payload: FocusEvent): void;
  (event: 'blur', payload: FocusEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const hasFocus = ref(false);

const state = computed<MbDragDropUploaderState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const isDisabled = computed(() => state.value === 'disabled');

const visualState = computed<MbDragDropUploaderState>(() => {
  if (state.value !== 'default') return state.value;
  if (isDragging.value || hasFocus.value) return 'focus';
  return 'default';
});

function toFileArray(files: FileList | null | undefined): File[] {
  if (!files) return [];
  return Array.from(files);
}

function emitFiles(files: File[], source: 'input' | 'drop') {
  if (files.length === 0) return;
  emit('files-selected', files);
  if (source === 'drop') {
    emit('drop', files);
  }
}

function openPicker() {
  if (isDisabled.value) return;
  inputRef.value?.click();
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) return;
  emitFiles(toFileArray(target.files), 'input');
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  if (isDisabled.value) return;
  isDragging.value = true;
}

function onDragLeave(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (isDisabled.value) return;

  isDragging.value = false;
  emitFiles(toFileArray(event.dataTransfer?.files), 'drop');
}

function onFocus(event: FocusEvent) {
  hasFocus.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  hasFocus.value = false;
  emit('blur', event);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  openPicker();
}
</script>

<template>
  <div class="mb-dd" :data-state="visualState">
    <label class="mb-dd__label" :aria-label="ariaLabel ?? label">{{ label }}</label>

    <div
      class="mb-dd__field"
      role="button"
      :tabindex="isDisabled ? -1 : 0"
      :aria-disabled="isDisabled ? 'true' : 'false'"
      :aria-label="ariaLabel ?? label"
      @click="openPicker"
      @keydown="onKeydown"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @focus="onFocus"
      @blur="onBlur"
    >
      <span class="mb-dd__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 18H6C4.34315 18 3 16.6569 3 15C3 13.5259 4.06251 12.2999 5.46447 12.0464C5.81295 8.60771 8.71384 6 12.25 6C15.6572 6 18.4724 8.41803 18.9739 11.6808C20.7076 11.8256 22.0712 13.2813 22.0712 15.0526C22.0712 16.9198 20.5576 18.4333 18.6904 18.4333H17"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 19V11"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 14L12 11L15 14"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>

      <p class="mb-dd__title">
        <span>Drag and drop or </span>
        <button
          type="button"
          class="mb-dd__browse"
          :disabled="isDisabled"
          @click.stop.prevent="openPicker"
        >
          {{ browseLabel }}
        </button>
      </p>

      <p class="mb-dd__helper">{{ helperText }}</p>
    </div>

    <input
      ref="inputRef"
      class="mb-dd__input"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="isDisabled"
      @change="onInput"
    />

    <p v-if="hint" class="mb-dd__hint">{{ hint }}</p>
  </div>
</template>
