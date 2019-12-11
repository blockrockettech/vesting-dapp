<template>
    <div class="container">
        <div class="jumbotron">
            <h1 class="display-4">Welcome to Cudo Vesting Portal</h1>
            <p class="lead">This is where you can view and manage your vested CUDO tokens</p>
            <hr class="my-4">
            <div v-if="account">
                <div class="row" v-if="hasValidSchedule()">
                    <div class="col">
                        <div class="card bg-warning text-white mb-3" style="max-width: 18rem;">
                            <div class="card-header">Vested CUDO Tokens</div>
                            <div class="card-body">
                                <h5 class="card-title">{{ toEther(schedule._amount) }} CUDO</h5>
                                <p class="card-text">Starting {{ toDate(schedule._start) }} and ending {{ toDate(schedule._end) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card bg-info text-white mb-3" style="max-width: 18rem;">
                            <div class="card-header">Drawn CUDO Tokens</div>
                            <div class="card-body">
                                <h5 class="card-title">{{ toEtherFixed(schedule._totalDrawn, 6) }} of {{ toEther(schedule._amount) }} CUDO</h5>
                                <p class="card-text">With a remaining vested balance of {{ toEtherFixed(schedule._remainingBalance, 6) }} CUDO</p>
                            </div>
                        </div>
                    </div>
                    <div class="col" v-if="availableToDrawnDown">
                        <div class="card bg-success text-white mb-3" style="max-width: 18rem;">
                            <div class="card-header">Cudo Token Available NOW</div>
                            <div class="card-body">
                                <h5 class="card-title">{{ toEtherFixed(availableToDrawnDown._amount, 6) }} CUDO</h5>
                                <p class="card-text" v-if="availableToDrawnDown._timeLastDrawn === schedule._start">You have never drawn down tokens</p>
                                <p class="card-text" v-else>You last drew down on {{ toDate(schedule._lastDrawnAt) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="alert alert-info">
                    You do not have a valid vesting schedule for <code>{{ account }}</code>
                </div>
                <div v-if="hasValidSchedule() && availableToDrawnDown">
                    <hr class="my-4">
                    <p class="lead">
                        <button class="btn btn-primary btn-lg btn-block" @click="drawDown">Draw down {{ toEtherFixed(availableToDrawnDown._amount, 6) }} CUDO Tokens</button>
                    </p>
                </div>
            </div>
            <div v-else>
                <button class="btn btn-secondary btn-lg btn-block" @click="onLogin">Sign in</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapState} from "vuex";

    export default {
        name: 'home',
        data() {
            return {
                polling: null
            };
        },
        computed: {
            ...mapState([
                'account',
                'accountBalance',
                'schedule',
                'availableToDrawnDown',
                'web3'
            ]),
            ...mapGetters([
                'hasValidSchedule',
                'toEther',
                'toEtherFixed',
                'toDate',
            ])
        },
        methods: {
            onLogin() {
                this.$parent.onLogin();
            },
            drawDown() {
                console.log('drawing down tokens...');
                this.$store.dispatch('drawDown');
            },
            pollData() {
                this.polling = setInterval(() => {
                    this.$store.dispatch('availableDrawDownAmount');
                }, 10000);
            }
        },
        beforeDestroy() {
            clearInterval(this.polling);
        },
        created() {
            this.pollData();
        }
    };
</script>
