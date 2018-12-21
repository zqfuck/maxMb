<template>
  <div>
    <header class="wrapper" ref="wrapper">
      <ul class="menu_Nav " ref="li_list">
        <router-link v-for="(item,idex) in title_list" tag="span" :key="item.column_id" :to="{name: 'List', params:{id: item.column_id}}">
          <li class="nav_list">{{item.column_name}}</li>
        </router-link>
      </ul>
    </header>
    <div class="search_box">
      <router-link to="/"><span class="bg_white"><img src="../assets/home.png" alt=""></span></router-link>
      <input type="text"  @focus="show_sear" class="inp" placeholder="输入节目标题或嘉宾">
      <span class="bg_white" @click="show_rank" style="margin-left: 0;margin-right: 0.16rem;"><img src="../assets/lie.png" alt=""></span>
      <img src="../assets/fang.png" alt="" style="position: absolute;left: 18%;width: 0.28rem;height: 0.28rem;">
    </div>
    <!--排行榜-->
    <div v-show="rank_show" class="rankBox">
     <div class="rank">
       <p><span class="fl" style="color: #db2e32;font-size: 0.28rem">排行榜</span> <span class="fr" @click="cancel_rank">取消</span></p>
       <ul class="rankList">
         <router-link v-for="(item,index) in rank_list" :key="item.cid" :to="{name:'Detail',params:{cid:item.cid}}">
           <li ><span>{{index+1}}</span>{{item.title}}</li>
         </router-link>
       </ul>
     </div>
    </div>
    <!--搜索-->
    <div v-show="sear_show" class="sear_box">
      <div class="inp_box">
        <p><input type="text" v-focus ref="inp" autofocus v-model="val" placeholder="输入节目标题或嘉宾"> <span @click="cancel_sear">取消</span></p>
      </div>
      <div class="search_list">
        <ul>
          <router-link v-for="(item,index) in sear_list" :key="item.cid" :to="{name:'Detail',params:{cid:item.cid}}">
            <li >{{item.name}}</li>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { mapState } from 'vuex'
  import api from '@/js/api'
  export default {
    name: 'Header',
    data () {
      return {
        val: '',
        title_list:[],
        sear_list:[],
        rank_list: [],
        rank_show:false,
        sear_show:false
      }
    },
    computed: {
      ...mapState(['q_id'])
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus()
        }
      }
    },
    watch: {
      val (new_val, old_val) {
        let params = {
          id:this.q_id,
          value: new_val
        }
        api.search(params).then(res => {
          console.log(res)
          if(res.result.items.length>0){
            this.sear_list = res.result.items
          }else {

          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    mounted () {
      const params = {
        id:'Mg=='
      }
      api.titleList(params).then(res => {
        console.log(res)
        this.title_list = res.result
        if(this.title_list.length>4){
          this.$refs.li_list.style.width = (28 * this.title_list.length) + '%';
        }else {
          this.$refs.li_list.style.width = '100%'
        }
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.wrapper,{
            scrollY: false ,
            scrollX: true ,
            click:  true ,
            tap: true
          })
        })
      }).catch(err => {
        console.log(err)
      })


    },
   methods: {
     show_rank () {
       this.rank_show = true
       this.stop()
       let  params = {
          id:this.q_id,
          type:2
       }
       api.rankList(params).then(res => {
          console.log(res)
         this.rank_list = res.data
       }).catch(err => {
         console.log(err)
       })
     },
     show_sear () {
       this.sear_show = true
       this.stop()
       this.$nextTick( () => {
         this.$refs.inp.focus()
       })
     },
     cancel_rank () {
       this.rank_show = false
       this.move()
     },
     cancel_sear () {
       this.sear_show = false
       this.move()
       this.val = ''
       this.sear_list = []
     },
     //实现滚动条无法滚动
      mo (e) {
       e.preventDefault();
     },
  /***禁止滑动***/
      stop () {
        document.body.style.overflow = 'hidden';
        document.addEventListener("touchmove", this.mo, { passive: false });//禁止页面滑动
      },
  /***取消滑动限制***/
      move () {
        document.body.style.overflow = '';//出现滚动条
        document.removeEventListener("touchmove", this.mo, { passive: false });
      }
   }
  }
</script>

<style scoped>
  header{
    width: 100%;
    height: 1rem;
    overflow: hidden;
    line-height: 1rem;
    font-size: 0.3rem;
    color: #acacbe;
    background: #fff;

  }
  menu_Nav{
    display: inline-block;
  }
  .wrapper li{
    display: inline-block;
    padding: 0 0.25rem;
  }
  .router-link-active{
    color: #4c5568;
    border-bottom: 5px solid #db2e32;
    padding: 0.25rem 0;
  }
  .search_box{
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    display: flex;
   align-items: center;
    background: #ebedf1;
    position: relative;
    overflow: hidden;
  }
  .bg_white{
    display: inline-block;
    width: 0.67rem;
    height: 0.67rem;
    line-height: 0.67rem;
    background: #fff;
    border-radius: 50%;
    text-align: center;
    margin-left: 0.16rem;
  }
  .bg_white img{
    width: 0.38rem;
    vertical-align: middle;
  }
  .inp{
    width: 59%;
    height: 0.67rem;
    line-height: 0.67rem;
    margin: 0 0.15rem;
    border-radius: 20px;
    border: none;
    outline: none;
    padding-left: 10%;
    font-size: 0.3rem;
    color: #aca3be;
  }
  .rankBox,.sear_box{
    z-index: 10;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
  }
  .rank{
    position: absolute;
    left: 5px;
    top: 5px;
    bottom: 5px;
    right: 5px;
    border-radius: 8px;
    background: #fff;
    padding: 0.1rem;
  }
  .rank p{
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.3rem;
    border-bottom: 1px solid #cdcdcd;
  }
  .rankList li{
    padding: 0.2rem 0;
    border-bottom: 1px solid #cdcdcd;
    color: #4c5568;
  }
  .rankList li span{
    display: inline-block;
    width: 0.35rem;
    height: 0.35rem;
    border-radius: 50%;
    background: #cdcdcd;
    text-align: center;
    line-height: 0.35rem;
    margin-right: 0.2rem;
  }
  .sear_box .inp_box{
    padding: 0.1rem 0 0.2rem;
    font-size: 0.24rem;
  }
  .sear_box{
    display: flex;
    flex-direction: column;
    padding: 0.2rem;
  }
  .sear_box .inp_box input{
    width: 80%;
    height: 0.6rem;
    line-height: 0.6rem;
    border-radius: 15px;
    background: #fff;
    border: none;
    outline: none;
    padding-left: 0.3rem;
    margin-right: 0.15rem;
  }
  .search_list{
    flex-grow: 1;
    background: #fff;
    border-radius: 10px;
    padding: 0.15rem;
  }
  .search_list li{
    padding: 0.2rem 0;
    border-bottom: 1px solid #cdcdcd;
    color: #4c5568;
  }
</style>
