import {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {ILocation} from '../interfaces/AppInterfaces';

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState<boolean>(false);
  const [initialPosition, setInitialPosition] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    getCurrentLocation()
      .then( location => {
        setInitialPosition(location);
        setHasLocation(true);
      });
  }, []);

  const getCurrentLocation = (): Promise<ILocation> => {
    return new Promise ((resolve, reject) => {
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
    })
  }

  return {
    hasLocation,
    initialPosition,
    getCurrentLocation
  };
};
