import React from 'react'
import { View, Text, StyleSheet, Button, Platform } from 'react-native'
import { PERMISSIONS, PermissionStatus, check, request } from 'react-native-permissions'

export const PermissionsScreen = () => {

  const requestLocationPermission = async() => {
    let permissionStatus: PermissionStatus;

    if( Platform.OS === 'ios'){
      // permissionStatus = await check( PERMISSIONS.IOS.LOCATION_WHEN_IN_USE ); => Check if App has permission for location
      permissionStatus = await request( PERMISSIONS.IOS.LOCATION_WHEN_IN_USE );
    } else {
      // permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    console.log({ permissionStatus });
  }

  return (
    <View style={ styles.container }>
        <Text>PermissionsScreen</Text>

        <Button
          title='Request Permission'
          onPress={ requestLocationPermission }
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
});