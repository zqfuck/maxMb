import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
   // q_id: 'Mg==',
    q_id: '',
    title: '首页'
  },
  actions: {
    changeTit ({commit},com_id){
      console.log(com_id)
      commit('changeQy',com_id)
    }
  },
  mutations: {
    changeTitle (state,tit){
      state.title = tit
    },
    changeQy (state,tit){
      state.q_id = tit
      console.log(state.q_id)
    }
  }
})
