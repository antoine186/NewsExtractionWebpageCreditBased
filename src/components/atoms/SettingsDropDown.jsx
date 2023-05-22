import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useNavigate, Navigate } from 'react-router-dom'
import ClearEntireStore from '../../utils/session_helpers/ClearEntireStore'
import ManualStoreClearing from '../../utils/session_helpers/ManualStoreClearing'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
const { vw, vh, vmin, vmax } = require('react-native-viewport-units')

function SettingsDropDown () {
  const [setting, setSettings] = React.useState('')
  const [manualClearStore, setManualClearStore] = React.useState(false)

  const navigate = useNavigate()

  const userSession = useSelector(state => state.userSession)

  useEffect(() => {
    if (userSession.validated === false) {
      console.log('Logged out')
    }
  }, [userSession])

  const handleChange = (event) => {
    setSettings(event.target.value)

    if (event.target.value === 'subscription') {
      navigate('/payment')
    } else if (event.target.value === 'log-out') {
      console.log('Attempting to logout')
      setManualClearStore(true)
      ClearEntireStore()
    }
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel style={{ position: 'float', transform: 'none' }}>{'Settings'}</InputLabel>
        <Select
          value={setting}
          label="Setting"
          onChange={handleChange}
        >
          <MenuItem value={'log-out'}>Log Out</MenuItem>
          {manualClearStore &&
          <View>
            <ManualStoreClearing />
            <Navigate to='/' />
          </View>
          }
        </Select>
      </FormControl>
    </Box>
  )
}

export default SettingsDropDown
