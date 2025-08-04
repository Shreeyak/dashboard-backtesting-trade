// src/main.ts
import { mount } from 'svelte';     // Svelte 5 imperative mount API
import App from './App.svelte';     // or replace with './Chart.svelte'
import './app.css';                 // Tailwind v4 + DaisyUI styles

mount(App, {
  target: document.getElementById('app')!   // non-null assertion for TypeScript
});
