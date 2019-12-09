<template>
  <div class="home">
    <h1>HOME</h1>

    {{ account }}

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
}
</script>
