<template>
  <div>
    <header class="wrapper" ref="wrapper">
      <ul class="menu_Nav " ref="li_list">
        <router-link  v-for="(item) in title_list" tag="li" :key="item.column_id" :to="{name: 'List', params:{id: item.column_id,column_img:item.column_img,title:item.column_name}}">
         {{item.column_name}}
        </router-link>
      </ul>
    </header>
    <div class="search_box">
      <router-link to="/"><span v-if="homeIndex" class="bg_white" style="margin-top: 0.2rem;"><img src="../assets/home.png" alt=""></span>

      </router-link>
      <input type="text"  @focus="show_sear" class="inp"  :class="styleIndex ? 'inpIndex':''" placeholder="输入节目标题">
      <span class="bg_white" @click="show_rank" style="margin-left: 0;margin-right: 0.16rem;"><img src="../assets/lie.png" alt=""></span>
      <img src="../assets/fang.png" alt="" :class="styleIndex ? 'imgIndex':''" style="position: absolute;left: 18%;width: 0.28rem;height: 0.28rem;">
    </div>
    <!--排行榜-->
    <div v-show="rank_show" class="rankBox">
     <div class="rank">
       <p><span class="fl" style="color: #db2e32;font-size: 0.28rem">排行榜</span> <span class="fr" @click="cancel_rank">取消</span></p>
       <ul class="rankList">
           <li @click="toDetail(item.cid)" v-for="(item,index) in rank_list" :key="item.cid">
             <span :class="{first:index==0,second:index==1,third:index==2}">{{index+1}}</span>{{item.title}}
           </li>
       </ul>
     </div>
    </div>
    <!--搜索-->
    <div v-show="sear_show" class="sear_box">
      <div class="inp_box">
        <p><input type="text" v-focus ref="inp" autofocus v-model="val" placeholder="输入节目标题"> <span @click="cancel_sear">取消</span></p>
      </div>
      <div class="search_list">
        <ul v-if="sear_list.length>0" style="margin-bottom: 0.6rem;">
            <li  @click="toDetail(item.cid,item.name)" v-for="(item) in sear_list" :key="item.cid">{{item.name}}</li>
        </ul>
        <span v-if="del_show" class="delHis" @click="delHis">清除历史</span>
        <ul class="rankList">
          <li @click="toDetail(item.cid,item.name)" v-for="(item,index) in hot_list" :key="item.cid">
            <span :class="{first:index==0,second:index==1,third:index==2}">{{index+1}}</span>{{item.name}}
          </li>
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
        hot_list:[],
        rank_show:false,
        sear_show:false,
        del_show:false
      }
    },
    props:['homeIndex','styleIndex'],
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
        let qyID = this.q_id?this.q_id:localStorage.qy_ID
        let params = {
          id:qyID,
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
          if(localStorage.qnSearchHistory){
            let arr = JSON.parse(localStorage.qnSearchHistory)
            this.sear_list = arr
            this.del_show = true
          }
        })
      }
    },
    mounted () {
      let qyID = this.q_id?this.q_id:localStorage.qy_ID
      const params = {
        id:qyID
      }
      api.titleList(params).then(res => {
        console.log(res)
        this.title_list = res.result


        let widthAll = 0;
        res.result.forEach((item,index) => {
          widthAll+=item.column_name.length*15
        })
        widthAll+= res.result.length * 20;
        let windowWidth = document.body.clientWidth ;
       console.log(windowWidth + '------' + widthAll)
        if(widthAll>windowWidth){
          var windowWidthP = parseInt(widthAll) / parseInt(windowWidth) * 100;
            this.$refs.li_list.style.width = windowWidthP + '%'
        }else{
           this.$refs.li_list.style.width = '100%'
        }
        
        // if(this.title_list.length>4){
        //   this.$refs.li_list.style.width = (28 * this.title_list.length) + '%';
        // }else {
        //   this.$refs.li_list.style.width = '100%'
        // }
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
    // ...mapActions(['changeTit']),
     show_rank () {
       this.rank_show = true
       this.stop()
       let qyID = this.q_id?this.q_id:localStorage.qy_ID
       let  params = {
          id:qyID,
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
       if(localStorage.qnSearchHistory){
         let arr = JSON.parse(localStorage.qnSearchHistory)
         this.sear_list = arr
         this.del_show = true
       }
       let qyID = this.q_id?this.q_id:localStorage.qy_ID
       let params = {
         id:qyID
       }
       api.hot_search(params).then(res => {
         console.log(res)
         if(res.state.rc>=0){
           this.hot_list = res.result.items
         }
       }).catch(err => {
         console.log(err)
       })
     },
     toDetail (cid,name) {
       this.$router.push({name:'Detail',params:{id: cid }})
       if(localStorage.qnSearchHistory){
         let arr = JSON.parse(localStorage.qnSearchHistory);
         let flag = true
         for (var i=0;i<arr.length;i++) {
          if(arr[i].cid==cid){
            flag=false
          }
         }
         if(flag){
           arr.push({'name':name,'cid':cid});
         }
         if(arr.length>5){
           arr = arr.slice(-5)
           localStorage.qnSearchHistory=JSON.stringify(arr)
         }else {
           localStorage.qnSearchHistory=JSON.stringify(arr)
         }
       }else {
         let arr = [{
             'name':name,
             'cid':cid
           }]
         localStorage.qnSearchHistory=(JSON.stringify(arr))
       }

     },
     delHis(){
       localStorage.removeItem('qnSearchHistory')
       this.sear_list=[]
       this.del_show = false
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
       this.del_show = false
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
    height: 0.7rem;
    overflow: hidden;
    line-height: 0.7rem;
    font-size: 0.24rem;
    color: #acacbe;
    background: #fff;

  }
  menu_Nav{
    display: inline-block;
  }
  .margin4{
    margin-left: -4%;
  }
  .wrapper ul{
    display: flex;
   height: 100%;
    justify-content: space-around;
  }
  .wrapper li{
    display: inline-block;
    /* padding: 0 0.2rem; */
  }
  .router-link-active{
    color: #4c5568;
    border-bottom: 5px solid #db2e32;
    /* padding: 0.17rem 0; */
  }
 
  .search_box{
    width: 100%;
    height: 0.7rem;
    line-height: 0.7rem;
    display: flex;
   align-items: center;
    background: #ebedf1;
    position: relative;
    overflow: hidden;
  }
  .bg_white{
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    line-height: 0.5rem;
    background: #fff;
    border-radius: 50%;
    text-align: center;
    margin-left: 0.16rem;
  }
  .bg_white2{
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    line-height: 0.5rem;
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
    height: 0.5rem;
    line-height: 0.5rem;
    margin: 0 0.15rem;
    border-radius: 20px;
    border: none;
    outline: none;
    padding-left: 10%;
    font-size: 0.24rem;
    color: #aca3be;
  }
  .inpIndex{
    width: 62%!important;
    margin-left: 8%!important;
  }
  .imgIndex{
    left: 12% !important;
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
    color: #fff;
  }
  .first{
    background: #ee3e3e !important;
  }
  .second{
    background: #ee993e !important;
  }
  .third{
    background: #eedf3e !important;
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
    position: relative;
  }
  .search_list li{
    padding: 0.2rem 0;
    border-bottom: 1px solid #cdcdcd;
    color: #4c5568;
  }
  .delHis{
    display: inline-block;
    font-size: 0.22rem;
    height: 25px;
    color: #db2e32;
    position: absolute;
    right: 20px;
    top: 8px;
  }
</style>
