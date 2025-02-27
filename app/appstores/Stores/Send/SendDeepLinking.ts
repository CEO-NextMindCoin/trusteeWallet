/**
 * @version 0.41
 */
import Log from '@app/services/Log/Log'

import { decodeTransactionQrCode } from '@app/services/UI/Qr/QrScan'
import { SendActionsStart } from './SendActionsStart'

import branch from 'react-native-branch'


let CACHE_ALREADY_INITED = false
export namespace SendDeepLinking {

    export const initDeepLinking = function(): boolean {
        Log.log('SendDeepLinking.initDeepLinking start')
        if (CACHE_ALREADY_INITED) return false
        branch.subscribe(({error, params}) => {
            if (error) {
                Log.log('SendDeepLinking.initDeepLinking branch error ', JSON.stringify(error))
            }

            handleInitialURL(false, params)
        })
        CACHE_ALREADY_INITED = true
        Log.log('SendDeepLinking.initDeepLinking finished')
        return true
    }

    const handleInitialURL = async (needGetUrl: boolean, data : any) => {
        let initialURL = (typeof data !== 'undefined' && typeof data.$desktop_url !== 'undefined') ? data.$desktop_url : ''
        await Log.log('SendDeepLinking.handleInitialURL ' + JSON.stringify(data))
        try {
            if (needGetUrl || typeof initialURL === 'undefined' || initialURL === null || initialURL === '') {
                // initialURL = await NativeLinking.getInitialURL()
                const branchData = await branch.getLatestReferringParams()
                initialURL = branchData ? branchData.$desktop_url : ''
            }
        } catch (e) {
            Log.err('SendDeepLinking.handleInitialURL get error ' + e.message, initialURL)
            return
        }
        await Log.log('SendDeepLinking.handleInitialURL get success ' + JSON.stringify(initialURL))

        if (typeof initialURL === 'undefined' || initialURL === null) return
        try {

            let type = initialURL.split('//')[1]

            if (typeof type === 'undefined') return

            const data = type.split('/')[1]
            type = type.split('/')[0]
            if (typeof data === 'undefined' || typeof type === 'undefined') return

            if (type !== 'pay') return

            const res = await decodeTransactionQrCode({ data: data })
            if (typeof res.data === 'undefined') {
                throw new Error('res.data is empty')
            }

            const parsed = res.data as {
                needToDisable?: boolean,
                address: string,
                amount: string | number,
                currencyCode: string,
                label: string
            }
            await Log.log('SendDeepLinking.handleInitialURL decode parsed', parsed)

            if (initialURL.indexOf('trustee.page.link') !== -1) return

            await Log.log('SendDeepLinking.handleInitialURL decode success and will go to Send')
            await SendActionsStart.startFromDeepLinking(parsed)

        } catch (e) {
            Log.err('SendDeepLinking.handleInitialURL decode error ' + e.message)
        }
    }
}
