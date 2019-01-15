<template>
  <div id="app" v-wechat-title="this.$store.state.title" img-set="/static/logo.png">
    <router-view/>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
export default {
  name: 'App',
  data(){
    return {

    }
  },
  created(){
    this.$store.commit('changeTitle','直播')
    let channel=this.$utils.getUrlKey("qn_co")
    if(channel){
      localStorage.qy_ID = channel
      this.changeTit(channel)
    }

    //console.log(channel)
    //this.q_id = channel

    //this.$store.commit('changeQy',channel)
  },
  methods:{
    ...mapActions(['changeTit'])
  }

}
</script>

<style>

</style>
