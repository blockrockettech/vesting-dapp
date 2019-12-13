<template>
    <div>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <span class="navbar-brand">Cudos Vesting Portal</span>

            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav ml-auto">
                    <span class="text-muted mr-4" v-if="account">{{ account }}</span>
                    <span class="text-warning mr-4" v-if="accountBalance">{{ toEtherFixed(accountBalance, 6) }} CUDO</span>
                </ul>
            </div>
        </nav>

        <router-view style="margin-top: 75px"></router-view>

        <footer class="container" style="margin-top: 100px">
            <current-network></current-network>
        </footer>
    </div>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import CurrentNetwork from '@/components/CurrentNetwork.vue';

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
            ...mapGetters([
                'toEther',
                'toEtherFixed',
            ])
        },
        components: {
            CurrentNetwork
        },
    };
</script>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap';
</style>
