/**
 * @version 0.5
 * https://etherscan.io/apis#accounts
 */
import BlocksoftCryptoLog from '@crypto/common/BlocksoftCryptoLog'
import MarketingEvent from '@app/services/Marketing/MarketingEvent'
import { Web3Injected } from '@crypto/services/Web3Injected'
import config from '@app/config/config'

export default class EthBasic {
    /**
     * @type {Web3}
     * @public
     */
    _web3

    /**
     * @type {string}
     * @public
     */
    _etherscanSuffix

    /**
     * @type {string}
     * @public
     */
    _etherscanApiPath

    /**
     * @type {string}
     * @public
     */
    _etherscanApiPathInternal

    /**
     * @type {string}
     * @public
     */
    _trezorServer

    /**
     * @type {string}
     * @public
     */
    _trezorServerCode = 'ETH_TREZOR_SERVER'

    /**
     * @type {string}
     * @public
     */
    _tokenAddress

    /**
     * @type {string}
     * @public
     */
    _delegateAddress


    /**
     * @param {string} settings.network
     * @param {string} settings.currencyCode
     */
    constructor(settings) {
        if (typeof settings === 'undefined' || !settings) {
            throw new Error('EthNetworked requires settings')
        }
        if (typeof settings.network === 'undefined') {
            throw new Error('EthNetworked requires settings.network')
        }


        this._settings = settings
        this._etherscanApiPathDeposits = false
        this._isTestnet = false

        if (settings.currencyCode === 'BNB_SMART' || (typeof settings.tokenBlockchain !== 'undefined' && settings.tokenBlockchain === 'BNB')) {

            this._etherscanSuffix = ''
            this._etherscanApiPath = `https://api.bscscan.com/api?module=account&sort=desc&action=txlist&apikey=YourApiKeyToken`
            this._etherscanApiPathInternal = `https://api.bscscan.com/api?module=account&sort=desc&action=txlistinternal&apikey=YourApiKeyToken`

            this._trezorServer = false
            this._trezorServerCode = false

            this._mainCurrencyCode = 'BNB'
            this._mainTokenType = 'BNB_SMART_20'
            this._mainTokenBlockchain = 'Binance'
            this._mainChainId = 56

        } else if (settings.currencyCode === 'ETC') {

            this._etherscanSuffix = false
            this._etherscanApiPath = false
            this._etherscanApiPathInternal = false

            this._trezorServer = 'to_load'
            this._trezorServerCode = 'ETC_TREZOR_SERVER'

            this._mainCurrencyCode = 'ETC'
            this._mainTokenType = 'ETC_ERC_20'
            this._mainTokenBlockchain = 'Ethereum Classic'
            this._mainChainId = 61 // https://ethereumclassic.org/development/porting
        } else if (settings.currencyCode === 'OPTIMISM') {

            this._etherscanSuffix = ''
            this._etherscanApiPath = `https://api.optimistic.etherscan.io/api?module=account&sort=desc&action=txlist&apikey=YourApiKeyToken`
            this._etherscanApiPathInternal = `https://api.optimistic.etherscan.io/api?module=account&sort=desc&action=txlistinternal&apikey=YourApiKeyToken`
            this._etherscanApiPathDeposits = 'https://api-optimistic.etherscan.io/api?module=account&action=getdeposittxs'

            this._trezorServer = false
            this._trezorServerCode = false

            this._mainCurrencyCode = 'OPTIMISM'
            this._mainTokenType = 'OPTI_ERC_20'
            this._mainTokenBlockchain = 'Optimistic Ethereum'
            this._mainChainId = 10 // https://community.optimism.io/docs/developers/metamask.html#connecting-with-chainid-link
        } else if (settings.currencyCode === 'AMB') {

            this._etherscanSuffix = false
            this._etherscanApiPath = false
            this._etherscanApiPathInternal = false

            this._trezorServer = 'to_load'
            this._trezorServerCode = 'AMB_TREZOR_SERVER'

            this._mainCurrencyCode = 'AMB'
            this._mainTokenType = 'AMB_ERC_20'
            this._mainTokenBlockchain = 'Ambrosus Network'
            this._mainChainId = 16718 // 0x414e
        } else if (settings.currencyCode === 'MATIC' || (typeof settings.tokenBlockchain !== 'undefined' && settings.tokenBlockchain === 'MATIC')) {

            this._etherscanSuffix = ''
            this._etherscanApiPath = `https://api.polygonscan.com/api?module=account&sort=desc&action=txlist&apikey=YourApiKeyToken`
            this._etherscanApiPathInternal = `https://api.polygonscan.com/api?module=account&sort=desc&action=txlistinternal&apikey=YourApiKeyToken`


            this._trezorServer = false
            this._trezorServerCode = false

            this._mainCurrencyCode = 'MATIC'
            this._mainTokenType = 'MATIC_ERC_20'
            this._mainTokenBlockchain = 'Polygon Network'
            this._mainChainId = 137
        } else if (settings.currencyCode === 'FTM' || (typeof settings.tokenBlockchain !== 'undefined' && settings.tokenBlockchain === 'FTM')) {

            this._etherscanSuffix = ''
            this._etherscanApiPath = `https://api.ftmscan.com/api?module=account&sort=desc&action=txlist&apikey=YourApiKeyToken`
            this._etherscanApiPathInternal = `https://api.ftmscan.com/api?module=account&sort=desc&action=txlistinternal&apikey=YourApiKeyToken`


            this._trezorServer = false
            this._trezorServerCode = false

            this._mainCurrencyCode = 'FTM'
            this._mainTokenType = 'FTM_ERC_20'
            this._mainTokenBlockchain = 'Fantom Network'
            this._mainChainId = 250
        } else if (settings.currencyCode === 'RSK') {
            this._etherscanSuffix = false
            this._etherscanApiPath = false
            this._etherscanApiPathInternal = false

            this._trezorServer = false
            this._trezorServerCode = false

            this._mainCurrencyCode = 'RSK'
            this._mainTokenType = 'RSK_ERC_20'
            this._mainTokenBlockchain = 'RSK Network'
            this._mainChainId = 30
        } else {

            this._etherscanSuffix = (settings.network === 'mainnet') ? '' : ('-' + settings.network)
            this._etherscanApiPath = `https://api${this._etherscanSuffix}.etherscan.io/api?module=account&sort=desc&action=txlist&apikey=YourApiKeyToken`
            this._etherscanApiPathInternal = `https://api${this._etherscanSuffix}.etherscan.io/api?module=account&sort=desc&action=txlistinternal&apikey=YourApiKeyToken`

            if (settings.network === 'mainnet') {
                this._trezorServer = 'to_load'
                this._trezorServerCode = 'ETH_TREZOR_SERVER'
            } else if (settings.network === 'ropsten') {
                this._trezorServer = 'to_load'
                this._trezorServerCode = 'ETH_ROPSTEN_TREZOR_SERVER'
                this._isTestnet = true
            } else {
                this._trezorServer = false
                this._trezorServerCode = false
                this._isTestnet = true
            }

            this._mainCurrencyCode = 'ETH'
            this._mainTokenType = 'ETH_ERC_20'
            this._mainTokenBlockchain = 'Ethereum'
            this._mainChainId = false
        }

        const type = this._mainChainId ? this._mainChainId : settings.network
        this._web3 = Web3Injected(type)
        this._tokenAddress = false
    }

    checkError(e, data, txRBF = false, logData = {}) {
        if (config.debug.cryptoErrors) {
            console.log('EthBasic Error ' + e.message)
        }
        if (e.message.indexOf('Transaction has been reverted by the EVM') !== -1) {
            BlocksoftCryptoLog.log('EthBasic checkError0.0 ' + e.message + ' for ' + data.addressFrom, logData)
            throw new Error('SERVER_RESPONSE_REVERTED_BY_EVM')
        } else if (e.message.indexOf('nonce too low') !== -1) {
            BlocksoftCryptoLog.log('EthBasic checkError0.1 ' + e.message + ' for ' + data.addressFrom, logData)
            let e2
            if (txRBF) {
               e2 = new Error('SERVER_RESPONSE_TRANSACTION_ALREADY_MINED')
            } else {
               e2 = new Error('SERVER_RESPONSE_NONCE_ALREADY_MINED')
            }
            let nonce = logData.nonce || logData.setNonce
            if (typeof nonce === 'undefined') {
                nonce = ''
            }
            e2.logData = {nonce}
            throw e2
        } else if (e.message.indexOf('gas required exceeds allowance') !== -1) {
            BlocksoftCryptoLog.log('EthBasic checkError0.2 ' + e.message + ' for ' + data.addressFrom, logData)
            if (this._settings.tokenAddress === 'undefined' || !this._settings.tokenAddress) {
                throw new Error('SERVER_RESPONSE_TOO_MUCH_GAS_ETH')
            } else {
                throw new Error('SERVER_RESPONSE_TOO_MUCH_GAS_ETH_ERC20')
            }
        } else if (e.message.indexOf('insufficient funds') !== -1) {
            BlocksoftCryptoLog.log('EthBasic checkError0.3 ' + e.message + ' for ' + data.addressFrom, logData)
            if ((this._settings.currencyCode === 'ETH' || this._settings.currencyCode === 'BNB_SMART') && data.amount * 1 > 0) {
                throw new Error('SERVER_RESPONSE_NOTHING_LEFT_FOR_FEE')
            } else {
                throw new Error('SERVER_RESPONSE_NOT_ENOUGH_FEE')
            }
        } else if (e.message.indexOf('underpriced') !== -1) {
            BlocksoftCryptoLog.log('EthBasic checkError0.4 ' + e.message + ' for ' + data.addressFrom, logData)
            throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_FEE')
        } else if (e.message.indexOf('already known') !== -1) {
            BlocksoftCryptoLog.log('EthBasic checkError0.5 ' + e.message + ' for ' + data.addressFrom, logData)
            throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_FEE_FOR_REPLACEMENT')
        } else if (e.message.indexOf('infura') !== -1) {
            BlocksoftCryptoLog.log('EthBasic checkError0.6 ' + e.message + ' for ' + data.addressFrom, logData)
            throw new Error('SERVER_RESPONSE_BAD_INTERNET')
        } else {
            MarketingEvent.logOnlyRealTime('v20_' + this._mainCurrencyCode.toLowerCase() + '_tx_error ' + this._settings.currencyCode + ' ' + data.addressFrom + ' => ' + data.addressTo + ' ' + e.message, logData)
            throw e
        }
    }
}
