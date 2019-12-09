<template>
  <span v-if="networkName">{{ networkName }}</span>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'currentNetwork',
        computed: {
            ...mapState([
                'networkName',
            ])
        },
    };
</script>

<style lang="scss" scoped>

</style>
