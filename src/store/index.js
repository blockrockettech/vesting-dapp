import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // Network
        networkId: 1,
        networkName: 'Mainnet',
        etherscanBase: 'https://etherscan.io',

        // Account
        account: null,

        web3: null,
        notifyInstance: null,

        // Countracts
        cudosTokenContract: null,
        cudosVestingContract: null,
    },
    mutations: {
        networkDetails(state, {networkId, networkName, etherscanBase}) {
            state.networkId = networkId;
            state.networkName = networkName;
            state.etherscanBase = etherscanBase;
            // state.notifyInstance = notifier(networkId);

            // state.tokenLandiaContract = new state.web3.eth.Contract(TokenlandiaJson.abi, TokenlandiaJson.networks[state.networkId].address);
        },

        account(state, account) {
            state.account = account;
        },

        web3(state, web3) {
            state.web3 = web3;
        },
    },
    getters: {
        isConnected() {
            // @ts-ignore
            return window.web3 !== undefined;
        },

        etherscanTokenLink: state => (tokenId) => {
            // const networkAddress = TokenlandiaJson.networks[state.networkId].address;
            // return `${state.etherscanBase}/token/${networkAddress}?a=${tokenId}`;
        },

        validateAddress: state => (address) => {
            return state.web3.utils.isAddress(address);
        },
        checksumAddress: state => (address) => {
            try {
                return state.web3.utils.toChecksumAddress(address);
            } catch (e) {
                return address;
            }
        },
    },
    actions: {
        bootstrap({dispatch}, provider) {
            dispatch('loginWeb3', provider);
        },

        /////////////////////////
        // Web3 initialisation //
        /////////////////////////

        async loginWeb3({dispatch, state}, provider) {
            if (!state.account) {
                window.web3 = new Web3(provider);
                dispatch('initWeb3', window.web3);
            }
        },

        initWeb3({commit, dispatch}, web3) {
            commit('web3', web3);

            dispatch('getNetwork').then(() => {
                web3.eth.getAccounts((error, accounts) => {
                    if (!error) {
                        const account = accounts[0];
                        commit('account', account);
                    } else {
                        console.log(`Error getting accounts`, error);
                    }
                });
            });
        },

        async getNetwork({commit, dispatch}) {
            const networkId = await dispatch('getNetworkId');
            const networkName = await dispatch('getNetworkName', networkId);
            const etherscanBase = await dispatch('getEtherscanAddress', networkId);
            return commit('networkDetails', {networkId, networkName, etherscanBase});
        },

        getNetworkId({state}) {
            return 4//state.web3.eth.net.getId();
        },

        getEtherscanAddress({}, networkId) {
            switch (networkId) {
                case 1:
                    return 'https://etherscan.io';
                case 4:
                    return 'https://rinkeby.etherscan.io';
                default:
                    return '';
            }
        },

        getNetworkName({}, networkId) {
            switch (networkId) {
                case 1:
                    return 'MAINNET';
                case 4:
                    return 'RINKEBY';
                case 3:
                    return 'ROPSTEN';
                default:
                    return 'UNKNOWN';
            }
        },
    },
    modules: {}
});