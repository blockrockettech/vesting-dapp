import Vue from 'vue';
import Vuex from 'vuex';

import * as Web3 from 'web3';

import notifier from "../notifier"

Vue.use(Vuex);

const CudosTokenJson = require("../truffle/CudosToken");
const VestingContractJson = require("../truffle/VestingContract");

export default new Vuex.Store({
    state: {
        // Network
        networkId: 1,
        networkName: 'Mainnet',
        etherscanBase: 'https://etherscan.io',

        // Account
        account: null,
        accountBalance: null,

        // Vesting
        schedule: null,
        availableToDrawnDown: null,

        web3: null,
        notifyInstance: null,

        // Contracts
        cudosTokenContract: null,
        vestingContract: null,
    },
    mutations: {
        networkDetails(state, {networkId, networkName, etherscanBase}) {
            state.networkId = networkId;
            state.networkName = networkName;
            state.etherscanBase = etherscanBase;
            state.notifyInstance = notifier(networkId);

            state.cudosTokenContract = new state.web3.eth.Contract(CudosTokenJson.abi, CudosTokenJson.networks[state.networkId].address);
            state.vestingContract = new state.web3.eth.Contract(VestingContractJson.abi, VestingContractJson.networks[state.networkId].address);
        },

        account(state, account) {
            state.account = account;
        },

        balanceOfAccount(state, balanceOfAccount) {
            state.accountBalance = balanceOfAccount;
        },

        schedule(state, schedule) {
            state.schedule = schedule;
        },

        availableToDrawnDown(state, availableToDrawnDown) {
            state.availableToDrawnDown = availableToDrawnDown;
        },

        web3(state, web3) {
            state.web3 = web3;
        },
    },
    getters: {
        isConnected: () => {
            return window.web3 !== undefined;
        },

        etherscanTokenLink: state => (tokenId) => {
            const networkAddress = CudosTokenJson.networks[state.networkId].address;
            return `${state.etherscanBase}/token/${networkAddress}?a=${tokenId}`;
        },

        hasValidSchedule: state => () => {
            if (state.schedule) {
                return state.schedule._start && state.schedule._start > 0;
            }

            return false;
        },

        toEther: state => (wei) => state.web3.utils.fromWei(wei, 'ether'),

        toEtherFixed: state => (wei, dp) => parseFloat(state.web3.utils.fromWei(wei, 'ether')).toFixed(dp),

        toDate: state => (timestampInSecs) => new Date(timestampInSecs * 1000).toDateString()
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

            state.web3.eth.getAccounts(async (error, accounts) => {
                if (!error) {
                    const account = accounts[0];
                    commit('account', account);

                    dispatch('balanceOfAccount');

                    await dispatch('vestingScheduleForBeneficiary');

                    dispatch('availableDrawDownAmount');
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
                case 5777:
                    return 'LOCAL';
                default:
                    return 'UNKNOWN';
            }
        },

        /////////////////////
        // Token calls    //
        ////////////////////

        async balanceOfAccount({commit, state}) {
            const balanceOfAccount = await state.cudosTokenContract.methods.balanceOf(state.account).call();
            commit('balanceOfAccount', balanceOfAccount);
        },

        /////////////////////
        // Vesting calls   //
        ////////////////////

        async vestingScheduleForBeneficiary({commit, state}) {
            const schedule = await state.vestingContract.methods.vestingScheduleForBeneficiary(state.account).call();
            commit('schedule', schedule);
        },

        async availableDrawDownAmount({commit, state, getters}) {
            if (getters.hasValidSchedule(state)) {
                const availableToDrawnDown = await state.vestingContract.methods.availableDrawDownAmount(state.account).call();
                commit('availableToDrawnDown', availableToDrawnDown);
            }

        },

        drawDown({dispatch, state}) {
            return new Promise((resolve, reject) => {
                state.vestingContract.methods.drawDown()
                    .send({
                        from: state.account
                    })
                    .once('transactionHash', (hash) => {
                        // notification popup
                        state.notifyInstance.hash(hash);

                        resolve(hash);
                    })
                    .on('receipt', function(receipt){
                        dispatch('balanceOfAccount');

                        dispatch('vestingScheduleForBeneficiary');

                        dispatch('availableDrawDownAmount');
                    })
                    .on('error', reject);
            });
        },
    },
});
