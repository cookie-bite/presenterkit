import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    scroll-behavior: smooth;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  html {
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.colors.background.primary}; //#79A0D3;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  div {
    display: flex;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  input {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  a {
    all: unset;
    color: ${({ theme }) => theme.colors.accent.blue};
    cursor: pointer;
  }

  hr {
    all: unset;
  }

  button {
    display: flex;
    cursor: pointer;
    border: none;
    padding: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: transparent;
  }

  input {
    border: none;
    background-color: transparent;
  }

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  input::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  @font-face {
    font-family: 'Inter';
    src: url('/public/fonts/woff2/InterVariable.woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }

  *,
  *:after {
    font-family: -apple-system, BlinkMacSystemFont, "Apple Color Emoji", Inter, Roboto, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Apple Color Emoji", Inter, Roboto, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  }
`;
