import React, {useEffect, useRef} from 'react';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import {useLocation} from '../hooks/useLocation';
import {LoadingScreen} from '../pages/LoadingScreen';
import {Fab} from './Fab';

interface Props {
  markers?: typeof Marker;
}

export const Map = ({markers}: Props) => {
  const {
    hasLocation,
    initialPosition,
    userLocation,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation
  } = useLocation();

  const mapViewRef = useRef<MapView>();
  const following = useRef<boolean>(true);

  const centerPosition = async () => {
    const location = await getCurrentLocation();

    following.current = true;

    mapViewRef.current?.animateCamera({
      center: location,
      zoom: 18,
    });
  };

  useEffect(() => {
    followUserLocation();
    return () => {
        stopFollowUserLocation()
    };
  }, []);

  useEffect(() => {
    if (!following.current) return;

    mapViewRef.current?.animateCamera({
        center: userLocation,
        zoom: 18,
      });
  }, [ userLocation ])
  

  if (!hasLocation) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MapView
        ref={el => (mapViewRef.current = el!)}
        style={{flex: 1}}
        // Set Maps' provider Apple or Google
        provider={PROVIDER_DEFAULT}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude: initialPosition.latitude,
          longitude: initialPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onTouchStart={() => following.current = false }
        ></MapView>

      <Fab
        iconName="locate-outline"
        onPress={centerPosition}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
      />
    </>
  );
};
