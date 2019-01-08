import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    q_id: 'Mg==',
    title: '首页'
  },
  actions: {

  },
  mutations: {
    changeTitle (state,tit){
      state.title = tit
    }
  }
})
