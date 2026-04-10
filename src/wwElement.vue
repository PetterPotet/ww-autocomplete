<template>
<div class="ww-autocomplete" :class="{ 'is-open': isOpen }">
<input v-if="content.name" type="hidden" :name="content.name" :value="selectedValue" />
<input v-if="content.inputName" type="hidden" :name="content.inputName" :value="inputValue" />
<div class="ww-autocomplete__input-wrapper">
<input
ref="inputRef"
type="text"
class="ww-autocomplete__input"
:placeholder="content.placeholder || ''"
:value="inputValue"
@input="onInput"
@focus="onFocus"
@blur="onBlur"
@keydown="onKeyDown"
/>
<div 
v-if="inputValue && content.clearable" 
class="ww-autocomplete__clear-btn"
@mousedown.prevent="clearInput"
>
<span>×</span>
</div>
</div>

<div v-if="isOpen && filteredOptions.length > 0" class="ww-autocomplete__dropdown">
<div
v-for="(option, index) in filteredOptions"
:key="index"
class="ww-autocomplete__option"
:class="{ 'is-active': activeIndex === index }"
@mousedown.prevent="selectOption(option)"
@mouseover="activeIndex = index"
>
<span class="ww-autocomplete__option-label1">{{ getOptionLabel(option) }}</span>
<span v-if="getOptionLabel2(option)" class="ww-autocomplete__option-label2">{{ getOptionLabel2(option) }}</span>
</div>
</div>

<div v-if="isOpen && filteredOptions.length === 0 && inputValue" class="ww-autocomplete__no-results">
{{ content.noResultsText || 'No results found' }}
</div>
</div>
</template>

<script>
import { ref, computed, watch, inject, nextTick, onMounted } from 'vue';
import { debounce } from 'lodash';

export default {
props: {
content: { type: Object, required: true },
uid: { type: String, required: true },
wwElementState: { type: Object, default: () => ({}) },
},

emits: ['trigger-event'],

setup(props, { emit }) {
// Editor state
const isEditing = computed(() => {
// eslint-disable-next-line no-unreachable
return false;
});

// Create debounced typing handler
const emitTyping = (value) => {
if (isEditing.value) return;
emit('trigger-event', {
name: 'typing',
event: { value }
});
};

// Create debounced change handler (fires on input, not on select)
const emitChange = (value) => {
if (isEditing.value) return;
emit('trigger-event', {
name: 'change',
event: { value, option: {} }
});
};

// Create debounced versions using the same debounceDelay setting
const debouncedEmitTyping = computed(() => {
const delay = props.content?.debounceDelay ?? 300;
return debounce(emitTyping, delay);
});

const debouncedEmitChange = computed(() => {
const delay = props.content?.debounceDelay ?? 300;
return debounce(emitChange, delay);
});

// Component state
const inputRef = ref(null);
const isOpen = ref(false);
const activeIndex = ref(-1);
const inputValue = ref('');

// Internal variable for the selected value
const { value: selectedValue, setValue: setSelectedValue } = wwLib.wwVariable.useComponentVariable({
uid: props.uid,
name: 'value',
type: 'string',
defaultValue: computed(() => props.content.initialValue || ''),
});

// Internal variable for the current input text
const { value: inputTextVar, setValue: setInputTextVar } = wwLib.wwVariable.useComponentVariable({
uid: props.uid,
name: 'inputText',
type: 'string',
defaultValue: '',
});

// Internal variable for the full selected item object
const { value: selectedItem, setValue: setSelectedItem } = wwLib.wwVariable.useComponentVariable({
uid: props.uid,
name: 'selectedItem',
type: 'object',
defaultValue: {},
});

// WeWeb Form element integration
const useForm = inject('_wwForm:useForm', () => {});
useForm(
selectedValue,
{
fieldName: computed(() => props.content?.name || ''),
validation: null,
customValidation: null,
required: computed(() => props.content?.required || false),
initialValue: computed(() => props.content?.initialValue || ''),
},
{
elementState: props.wwElementState,
emit,
sidepanelFormPath: 'settings',
setValue: setSelectedValue,
}
);

// Options handling
const options = computed(() => {
return Array.isArray(props.content.options) ? props.content.options : [];
});

const filteredOptions = computed(() => {
// Always return all options regardless of input value
return props.content?.options || [];
});

const getOptionLabel = (option) => {
if (typeof option === 'string') {
return option;
}

if (option && typeof option === 'object') {
const label1Path = props.content?.label1Path || 'label';
return wwLib.wwUtils.resolveObjectPropertyPath(option, label1Path) || '';
}

return '';
};

const getOptionValue = (option) => {
if (typeof option === 'string') {
return option;
}

if (option && typeof option === 'object') {
const valuePath = props.content.valuePath || 'value';
return wwLib.wwUtils.resolveObjectPropertyPath(option, valuePath) || '';
}

return '';
};

const getOptionLabel2 = (option) => {
if (!option || typeof option !== 'object') return '';
const label2Path = props.content?.label2Path;
if (!label2Path) return '';
return wwLib.wwUtils.resolveObjectPropertyPath(option, label2Path) || '';
};

// Input handling
const onInput = (event) => {
inputValue.value = event.target.value;
setInputTextVar(event.target.value);
setSelectedValue('');
setSelectedItem({});
isOpen.value = true;
activeIndex.value = -1;

// Emit the debounced typing and change events
debouncedEmitTyping.value(inputValue.value);
debouncedEmitChange.value(inputValue.value);

emit('trigger-event', {
name: 'input',
event: { value: event.target.value }
});
};

const onFocus = () => {
if (!isEditing.value) {
isOpen.value = true;
}
};

const onBlur = () => {
// Delay closing to allow click events on options
setTimeout(() => {
isOpen.value = false;
}, 200);
};

const onKeyDown = (event) => {
if (isEditing.value) return;

switch (event.key) {
case 'ArrowDown':
event.preventDefault();
if (!isOpen.value) {
isOpen.value = true;
} else {
activeIndex.value = Math.min(activeIndex.value + 1, filteredOptions.value.length - 1);
}
break;

case 'ArrowUp':
event.preventDefault();
activeIndex.value = Math.max(activeIndex.value - 1, -1);
break;

case 'Enter':
event.preventDefault();
if (isOpen.value && activeIndex.value >= 0) {
selectOption(filteredOptions.value[activeIndex.value]);
}
break;

case 'Escape':
event.preventDefault();
isOpen.value = false;
break;
}
};

const selectOption = (option) => {
if (isEditing.value) return;

const value = getOptionValue(option);
const label = getOptionLabel(option);

inputValue.value = label;
setInputTextVar(label);
setSelectedValue(value);
setSelectedItem(option || {});
isOpen.value = false;

emit('trigger-event', {
name: 'select',
event: { value, option: option || {} }
});

emit('trigger-event', {
name: 'change',
event: { value, option: option || {} }
});
};

const clearInput = () => {
if (isEditing.value) return;

inputValue.value = '';
setInputTextVar('');
setSelectedValue('');
setSelectedItem({});

emit('trigger-event', {
name: 'select',
event: { value: '', option: {} }
});

emit('trigger-event', {
name: 'change',
event: { value: '', option: {} }
});

nextTick(() => {
inputRef.value?.focus();
});
};

// Watch for initialValue changes
watch(() => props.content.initialValue, (newValue) => {
if (newValue !== selectedValue.value) {
setSelectedValue(newValue || '');

// Find the option that matches the new value
const matchingOption = options.value.find(option => 
getOptionValue(option) === newValue
);

if (matchingOption) {
inputValue.value = getOptionLabel(matchingOption);
} else {
inputValue.value = newValue || '';
}

emit('trigger-event', {
name: 'initValueChange',
event: { value: newValue }
});
}
}, { immediate: true });

// Initialize input value from initialValue
onMounted(() => {
const initialValue = props.content.initialValue;
if (initialValue) {
const matchingOption = options.value.find(option => 
getOptionValue(option) === initialValue
);

if (matchingOption) {
inputValue.value = getOptionLabel(matchingOption);
} else {
inputValue.value = initialValue;
}
}
});

const debounceDelay = computed(() => props.content?.debounceDelay ?? 300);

return {
inputRef,
isOpen,
activeIndex,
inputValue,
filteredOptions,
selectedValue,
selectedItem,
inputTextVar,
isEditing,
onInput,
onFocus,
onBlur,
onKeyDown,
selectOption,
clearInput,
getOptionLabel,
getOptionLabel2,
debouncedEmitTyping,
debouncedEmitChange,
debounceDelay,
};
}
};
</script>

<style lang="scss" scoped>
.ww-autocomplete {
position: relative;
width: 100%;

&__input-wrapper {
position: relative;
width: 100%;
}

&__input {
width: 100%;
padding: 8px 12px;
font-size: 14px;
border: 1px solid #ddd;
border-radius: 4px;
outline: none;

&:focus {
border-color: #4a90e2;
box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}
}

&__clear-btn {
position: absolute;
right: 10px;
top: 50%;
transform: translateY(-50%);
cursor: pointer;
color: #999;
font-size: 16px;
font-weight: bold;

&:hover {
color: #666;
}
}

&__dropdown {
position: absolute;
top: 100%;
left: 0;
width: 100%;
max-height: 200px;
overflow-y: auto;
background: white;
border: 1px solid #ddd;
border-radius: 0 0 4px 4px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
z-index: 1000;
}

&__option {
padding: 8px 12px;
cursor: pointer;
display: flex;
flex-direction: column;
gap: 2px;

&:hover, &.is-active {
background-color: #f5f5f5;
}
}

&__option-label1 {
font-size: 14px;
line-height: 1.3;
}

&__option-label2 {
font-size: 12px;
font-style: italic;
color: #888;
line-height: 1.3;
}

&__no-results {
position: absolute;
top: 100%;
left: 0;
width: 100%;
padding: 8px 12px;
background: white;
border: 1px solid #ddd;
border-radius: 0 0 4px 4px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
color: #999;
z-index: 1000;
}
}
</style>