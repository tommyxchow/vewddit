import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Bricolage_Grotesque } from 'next/font/google';
import '../styles/globals.css';

const queryClient = new QueryClient();

const defaultFont = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-default',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${defaultFont.variable} font-sans`}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute='class' disableTransitionOnChange>
          <Component {...pageProps} />
        </ThemeProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>

      {/* Workaround for next fonts not being applied to react portal/dialogs. */}
      <style jsx global>{`
        :root {
          --font-default: ${defaultFont.style.fontFamily};
        }
      `}</style>
    </div>
  );
}

export default MyApp;
