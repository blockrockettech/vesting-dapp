<template>
    <div>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <span class="navbar-brand">Cudos Vesting Portal</span>

            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav ml-auto">
                    <span class="text-muted mr-4" v-if="account">{{ account }}</span>
                    <span class="text-warning mr-4" v-if="accountBalance">{{ accountBalance }} CUDO</span>
                </ul>
                <form class="form-inline my-2 my-lg-0" v-if="!account">
                    <button class="btn btn-secondary my-2 my-sm-0" @click="onLogin">Sign in</button>
                </form>
            </div>
        </nav>

        <router-view style="margin-top: 75px"></router-view>

        <footer class="container" style="margin-top: 100px">
            <current-network></current-network>
        </footer>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import CurrentNetwork from '@/components/CurrentNetwork.vue';
    import web3Connect from '@/web3ConnectService';

    export default {
        name: 'App',
        data() {
            return {
                collapsed: false,
                mintingExpanded: true
            };
        },
        computed: {
            ...mapState([
                'account',
                'accountBalance',
            ]),
        },
        components: {
            CurrentNetwork
        },
        methods: {
            onLogin() {
                web3Connect.toggleModal();
            },
        },
        created: async function () {
            web3Connect.on('connect', provider => {
                this.$store.dispatch('bootstrap', provider);
            });
        },
    };
</script>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap';
</style>
