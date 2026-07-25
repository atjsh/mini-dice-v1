import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import ReactDOM from 'react-dom/client';
import App from './App';
import { queryClient } from './query-client';
import './styles/index.css';

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>,
);
