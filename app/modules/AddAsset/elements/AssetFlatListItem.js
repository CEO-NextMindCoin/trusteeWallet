/**
 * @version 0.50
 * @author Vadym
 */

import React from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native'

import { useTheme } from '@app/theme/ThemeProvider'

const AssetFlatListItem = (props) => {

    const {
        colors,
        GRID_SIZE
    } = useTheme()

    const {
        data,
        action,
        inverse,
        margin
    } = props

    return(
        <TouchableOpacity style={[
            styles.button, {
                marginRight: GRID_SIZE,
                marginLeft: margin ? GRID_SIZE : 0,
                backgroundColor: inverse ? colors.common.text1 : colors.common.button.disabledBg + '66',
                borderColor: inverse ? '' : colors.common.text1,
                borderWidth: inverse ? 0 : 2,
                paddingHorizontal: inverse ? 14 : 12,
            }]} onPress={action}>
            <Text style={{ ...styles.text, color: inverse ? colors.common.background : colors.common.text3 }} >{data}</Text>
        </TouchableOpacity>
    )
}

export default AssetFlatListItem

const styles = StyleSheet.create({
    button: {
        width: 'auto',
        height: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 10,
        letterSpacing: 0.5,
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#5C5C5C'
    }
})
