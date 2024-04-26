import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useMemo, useRef, useState } from 'react';

// src: https://github.com/JustFly1984/react-google-maps-api/blob/develop/packages/react-google-maps-api/src/useJsApiLoader.tsx

interface UseMapsJSLoaderOptions {
  // extends LoaderOptions {
  id?: string;
  version?: string;
  apiKey: string;
  // libraries?: Library[];
  // library: Library;
  mapIds?: string[];
  language?: string;
  region?: string;
  nonce?: string;
  // authReferrerPolicy?: string;
}

export const useMapsJSLoader = ({
  id,
  version,
  apiKey,
  // library,
  mapIds,
  language,
  region,
  nonce,
}: UseMapsJSLoaderOptions) => {
  const service = useRef<any>(); // TODO: type
  const isMounted = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>();

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const loader = useMemo(() => {
    console.log('new Loader()');
    return new Loader({
      id,
      apiKey,
      version,
      // libraries,
      language: language || 'en',
      region: region || 'US',
      mapIds: mapIds || [],
      nonce: nonce || '',
      // authReferrerPolicy: authReferrerPolicy || 'origin',
    });
  }, [
    id,
    apiKey,
    version,
    // libraries,
    language,
    region,
    mapIds,
    nonce,
  ]);

  useEffect(() => {
    if (isLoaded) return;
    console.log('importLibrary');
    loader
      .importLibrary('places') // library
      .then((srv) => {
        // TODO: save ref to library ?? service.current = srv ??
        // service.current = new srv.AutocompleteService();
        service.current = srv;
        if (isMounted.current) setIsLoaded(true);
        console.log('lib loaded');
        return;
      })
      .catch((e) => {
        setLoadError(e);
      });
  }, []); // [library]

  return { service: service.current, isLoaded, loadError };
};
