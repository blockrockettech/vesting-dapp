import Vue from 'vue';
import Vuex from 'vuex';

import * as Web3 from 'web3';

Vue.use(Vuex);

const CudosTokenJson = require("../truffle/CudosToken");

export default new Vuex.Store({
    state: {
        // Network
        networkId: 1,
        networkName: 'Mainnet',
        etherscanBase: 'https://etherscan.io',

        // Account
        account: null,
        accountBalance: null,

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

            state.cudosTokenContract = new state.web3.eth.Contract(CudosTokenJson.abi, CudosTokenJson.networks[state.networkId].address);
        },

        account(state, account) {
            state.account = account;
        },

        balanceOfAccount(state, balanceOfAccount) {
            state.accountBalance = balanceOfAccount;
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
            const networkAddress = CudosTokenJson.networks[state.networkId].address;
            return `${state.etherscanBase}/token/${networkAddress}?a=${tokenId}`;
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

        async initWeb3({commit, dispatch, state}, web3) {
            commit('web3', web3);

            await dispatch('getNetwork');

            state.web3.eth.getAccounts((error, accounts) => {
                if (!error) {
                    const account = accounts[0];
                    commit('account', account);

                    dispatch('balanceOfAccount');
                } else {
                    console.log(`Error getting accounts`, error);
                }
            });
        },

        async getNetwork({commit, dispatch}) {
            const networkId = await dispatch('getNetworkId');
            const networkName = await dispatch('getNetworkName', networkId);
            const etherscanBase = await dispatch('getEtherscanAddress', networkId);
            return commit('networkDetails', {networkId, networkName, etherscanBase});
        },

        getNetworkId({state}) {
            return state.web3.eth.net.getId();
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

        ////////////////////
        // Token Contract calls //
        ////////////////////

        async balanceOfAccount({commit, state}) {
            const balanceOfAccount = await state.cudosTokenContract.methods.balanceOf(state.account).call();
            commit('balanceOfAccount', balanceOfAccount);
        },
    },
    modules: {}
});
