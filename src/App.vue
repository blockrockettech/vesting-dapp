<template>
    <div>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top" style="min-height: 50px">
            <router-link to="/">Cudos Vesting Portal</router-link>

            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav ml-auto">
                    <a href="#" class="nav-link">{{ account }}</a>
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
                // 'etherscanBase',
                // 'networkId',
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
