# Autocomplete Component

A custom [WeWeb](https://www.weweb.io/) element that provides a text input with a dropdown of selectable options — combo box / autocomplete style. Options can be plain strings or objects (e.g. bound to a collection), with support for two label paths and a separate value path.

Filtering of the option list itself is left to the app builder: this component emits `typing`/`change` events with the current input text, so you can filter the bound `options` list externally (e.g. with a WeWeb workflow or a filtered variable) and feed the result back in. The component always renders whatever `options` array it currently receives.

## Installation

```bash
npm install
```

## Development

```bash
npm run serve
```

Runs the component locally via the WeWeb CLI for local development/preview.

## Build

```bash
npm run build
```

Builds the component for publishing with the WeWeb CLI.

## Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `initialValue` | Text | `''` | Initial selected value. |
| `required` | OnOff | `false` | Marks the field as required (form input). |
| `name` | Text | `''` | Form field name for the hidden input carrying the selected value. |
| `inputName` | Text | `''` | Form field name for the hidden input carrying the raw typed text. |
| `placeholder` | Text | `'Search...'` | Placeholder text for the input. |
| `options` | Array | `['Option 1', 'Option 2', 'Option 3']` | List of options; each item can be a string or an object. |
| `label1Path` | Text | `'label'` | Object property path used as the primary option label (shown when options are objects). |
| `label2Path` | Text | `''` | Object property path used as a secondary/subtitle label. |
| `valuePath` | Text | `'value'` | Object property path used as the option's value. |
| `clearable` | OnOff | `true` | Shows a clear (×) button when the input has text. |
| `noResultsText` | Text | `'No results found'` | Text shown when there are no options to display for the current input. |
| `debounceDelay` | Number | `300` | Debounce delay (ms, 0–5000) applied to the `typing` and `change` events. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `select` | `{ value, option }` | Fired when an option is selected, or when the input is cleared (`value: ''`). |
| `change` | `{ value, option }` | Fired on selection/clear, and (debounced) while typing. |
| `input` | `{ value }` | Fired immediately on every keystroke. |
| `typing` | `{ value }` | Debounced event fired while typing. |
| `initValueChange` | `{ value }` | Fired when the `initialValue` property changes. |

## Exposed variables

The component exposes these internal variables (usable in bindings/workflows):

- `value` — the currently selected value.
- `inputText` — the raw text currently in the input.
- `selectedItem` — the full selected option object (or `{}`).

## Keyboard support

- `ArrowDown` / `ArrowUp` — open the dropdown / move the active option.
- `Enter` — select the active option.
- `Escape` — close the dropdown.

## Tech stack

- Vue 3 (Composition API)
- [lodash](https://lodash.com/) (`debounce`)
- Built with the [WeWeb CLI](https://developer.weweb.io/)
