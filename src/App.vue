<template>
  <div id="app" v-wechat-title="this.$store.state.title" img-set="/static/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

</style>
