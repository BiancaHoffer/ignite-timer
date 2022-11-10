import { BrowserRouter } from 'react-router-dom'

import { ThemeProvider } from 'styled-components';
import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/global";

import { Router } from './Router';
import { CyclesProvider } from './context/CyclesContext';

export function App() {
  return (
    <BrowserRouter>
      <CyclesProvider>
        <ThemeProvider theme={defaultTheme}>
            <Router />
          <GlobalStyle />
        </ThemeProvider>
      </CyclesProvider>
    </BrowserRouter>
  )}

































































































