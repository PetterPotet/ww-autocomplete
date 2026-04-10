export default {
editor: {
label: {
en: 'Autocomplete',
},
icon: 'search',
formInput: true,
},
properties: {
initialValue: {
label: {
en: 'Initial value',
},
type: 'Text',
bindable: true,
section: 'settings',
defaultValue: '',
},
name: {
label: {
en: 'Form field name (value)',
},
type: 'Text',
bindable: true,
section: 'settings',
defaultValue: '',
},
inputName: {
label: {
en: 'Form field name (input text)',
},
type: 'Text',
bindable: true,
section: 'settings',
defaultValue: '',
},
placeholder: {
label: {
en: 'Placeholder',
},
type: 'Text',
bindable: true,
section: 'settings',
defaultValue: 'Search...',
},
options: {
label: {
en: 'Options',
},
type: 'Array',
section: 'settings',
bindable: true,
defaultValue: [
'Option 1',
'Option 2',
'Option 3',
],
options: {
expandable: true,
getItemLabel(item, index) {
if (typeof item === 'string') {
return item || `Option ${index + 1}`;
}
return item?.label || `Option ${index + 1}`;
},
item: {
type: 'Text',
defaultValue: '',
},
},
},
label1Path: {
label: {
en: 'Label 1 path',
},
type: 'Text',
bindable: true,
section: 'settings',
defaultValue: 'label',
hidden: (content) => {
return !Array.isArray(content.options) ||
content.options.length === 0 ||
typeof content.options[0] !== 'object';
},
},
label2Path: {
label: {
en: 'Label 2 path',
},
type: 'Text',
bindable: true,
section: 'settings',
defaultValue: '',
hidden: (content) => {
return !Array.isArray(content.options) ||
content.options.length === 0 ||
typeof content.options[0] !== 'object';
},
},
valuePath: {
label: {
en: 'Value path',
},
type: 'Text',
bindable: true,
section: 'settings',
defaultValue: 'value',
hidden: (content) => {
return !Array.isArray(content.options) ||
content.options.length === 0 ||
typeof content.options[0] !== 'object';
},
},
clearable: {
label: {
en: 'Clearable',
},
type: 'OnOff',
bindable: true,
section: 'settings',
defaultValue: true,
},
noResultsText: {
label: {
en: 'No results text',
},
type: 'Text',
bindable: true,
section: 'settings',
defaultValue: 'No results found',
},
debounceDelay: {
label: { en: 'Debounce Delay (ms)' },
type: 'Number',
section: 'settings',
bindable: true,
defaultValue: 300,
options: {
min: 0,
max: 5000,
step: 100
},
},
},
triggerEvents: [
{
name: 'select',
label: {
en: 'On select',
},
event: {
value: '',
option: {},
},
default: true,
},
{
name: 'change',
label: {
en: 'On change',
},
event: {
value: '',
option: {},
},
},
{
name: 'input',
label: {
en: 'On input',
},
event: {
value: '',
},
},
{
name: 'initValueChange',
label: {
en: 'On init value change',
},
event: {
value: '',
},
},
{
name: 'typing',
label: { en: 'On typing' },
event: { value: '' }
},
],
};
