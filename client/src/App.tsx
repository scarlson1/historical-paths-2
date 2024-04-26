import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeButton } from 'elements';
import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';

import { LoadingSpinner, RQLoadingIndicator } from 'components';
import { Map } from 'views';
import './App.css';
import {
  ReactFireAppContext,
  ReactFireServicesContext,
  ThemeProvider,
  queryClient,
} from './context';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary FallbackComponent={LastResortErrorBoundary}>
        <Suspense fallback={<LoadingSpinner />}>
          <ReactFireAppContext>
            <ReactFireServicesContext>
              <QueryClientProvider client={queryClient}>
                <Map />
                <Toaster />
                <RQLoadingIndicator />
                <ThemeButton />
                <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
              </QueryClientProvider>
            </ReactFireServicesContext>
          </ReactFireAppContext>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;

function LastResortErrorBoundary({ error }: FallbackProps) {
  // useEffect(() => {
  //   Sentry.captureException(error);
  // }, [error]);

  console.log('Last Error Boundary');
  let msg =
    error && error.message ? (
      <div>
        <pre>{error.message}</pre>
      </div>
    ) : null;

  if (error && error.message && error.message.indexOf('query requires an index') !== -1) {
    msg = (
      <p>
        Indexing error. Our team has been notified and the issue should be resolved within the hour.
        Apologies for the inconvenience. Please also try a hard refresh of the page (ctrl/cmd +
        shift + R).
      </p>
    );
  }
  return (
    <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }} role='alert'>
      <p>An error occurred. See console for details.</p>
      {msg}
    </div>
  );
}
