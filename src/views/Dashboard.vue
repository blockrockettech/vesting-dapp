<template>
    <div class="container">
        <div class="jumbotron">
            <h1 class="display-4">Welcome to Cudo Vesting Portal</h1>
            <p class="lead">This is where you can view and manage your vested CUDO tokens</p>
            <hr class="my-4">
            <div v-if="account">
                <div class="row">
                    <div class="col">
                        <div class="card bg-light mb-3" style="max-width: 18rem;">
                            <div class="card-header">CUDO Token Balance</div>
                            <div class="card-body">
                                <h5 class="card-title">1000 CUDO</h5>
                                <p class="card-text">This is your current balance in your connected wallet</p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card bg-warning text-white mb-3" style="max-width: 18rem;">
                            <div class="card-header">Vested CUDO Tokens</div>
                            <div class="card-body">
                                <h5 class="card-title">20000 CUDO</h5>
                                <p class="card-text">Starting 1st Jan 2020 and ending 2nd Aug 2020</p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card bg-success text-white mb-3" style="max-width: 18rem;">
                            <div class="card-header">Cudo Token Available NOW</div>
                            <div class="card-body">
                                <h5 class="card-title">1234 CUDO</h5>
                                <p class="card-text">Amount of tokens you can draw down from the vesting contract</p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="my-4">
                <p class="lead">
                    <button class="btn btn-primary btn-lg btn-block">Draw down 1234 CUDO Tokens</button>
                </p>
            </div>
            <div v-else>
                <button class="btn btn-secondary btn-lg btn-block" @click="onLogin">Login</button>
            </div>
        </div>

    </div>
</template>

<script>


    import {mapState} from "vuex";

    export default {
        name: 'home',
        computed: {
            ...mapState([
                'account',
                // 'etherscanBase',
                // 'networkId',
            ]),
        },
        methods: {
            onLogin() {
                this.$parent.onLogin();
            },
        },
    };
</script>
