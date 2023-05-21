import React from 'react'
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand
} from 'mdb-react-ui-kit'
import styles from '../../utils/style_guide/TopBarStyle'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
const { vw, vh, vmin, vmax } = require('react-native-viewport-units')
import SettingsDropDown from '../atoms/SettingsDropDown'

export default function TopBar (prop) {
  return (
    <View style={styles.container}>
      <MDBNavbar light bgColor='light' style={styles.allowOverflow}>
        <MDBContainer style={styles.allowOverflow}>
          <MDBNavbarBrand href='#' style={styles.allowOverflow}>
            <View style={styles.rowContainer}>
              <Image
                  style={styles.image}
                  source={require('../../assets/images/EMOfficialLogo.png')}
                  href={`${window.location.origin}`}
              />
              {prop.settingsEnabled &&
                <SettingsDropDown style={styles.settings}/>
              }
            </View>
          </MDBNavbarBrand>
        </MDBContainer>
      </MDBNavbar>
    </View>
  )
}