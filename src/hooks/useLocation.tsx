import {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {ILocation} from '../interfaces/AppInterfaces';

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState<boolean>(false);
  const [routeLines, setRouteLines] = useState<ILocation[]>([]);
  const [initialPosition, setInitialPosition] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [ userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  const watchId = useRef<number>();
  const isMoutend = useRef(true);

  useEffect(() => {
    isMoutend.current = true;
  
    return () => {
      isMoutend.current = false;
    }
  }, [])
  

  useEffect(() => {
    getCurrentLocation().then((location: ILocation) => {
      if (!isMoutend.current) return;

      setInitialPosition(location);
      setUserLocation(location);
      setRouteLines(routes => [...routes, location]);
      setHasLocation(true);
    });
  }, []);

  const getCurrentLocation = (): Promise<ILocation> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        ({coords}) => {
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        },
        err => reject(err),
        {
          enableHighAccuracy: true,
        },
      );
    });
  };

  const followUserLocation = () => {
    watchId.current = Geolocation.watchPosition(
      ({coords}) => {
        if (!isMoutend.current) return;

        const location: ILocation = {
          latitude: coords.latitude,
          longitude: coords.longitude
        }

        setUserLocation(location);
        setRouteLines(routes => [...routes, location]);
      },
      err => console.log(err),
      {enableHighAccuracy: true, distanceFilter: 10},
    );
  };

  const stopFollowUserLocation = () => {
    if(watchId.current) Geolocation.clearWatch( watchId.current );
  }

  return {
    hasLocation,
    initialPosition,
    userLocation,
    routeLines,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation
  };
};
