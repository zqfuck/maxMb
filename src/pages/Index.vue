<template>
  <div style="height: 100vh;">
    <Header></Header>
    <div ref="wrap" style="overflow: hidden;height: calc( 100% - 2rem )">
      <div>
        <div class="swiper_wrapper">
          <swiper :options="swiperOption"  ref="mySwiper">
            <!-- 这部分放你要渲染的那些内容 -->
            <swiper-slide v-for="item in swiperImg" :key="item.cid">
                <img :src="item.imgUrl" class="index_img" @click="toDetail(item.cid)">
            </swiper-slide>
            <!-- 这是轮播的小圆点 -->
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
        </div>
        <div class="channel_list" v-for="(item, index) in indexList" :key="item.column_id">
          <p style="padding-left: 0.23rem;padding-right: 0.32rem;">
            <span style="font-size: 0.3rem;color: #4c5568;">{{item.column_name}}</span>
            <router-link :to="{name:'List',params:{id:item.column_id}}">
              <span class="fr" style="cursor:pointer;position: relative;top: 0.1rem;"><img src="../assets/more.png" alt="" style="width: 32px;"></span>
            </router-link>
            <span class="fr" ><img src="../assets/ding.png" alt="" style="margin-right: 0.5rem;width: 24px;"></span>
          </p>
          <div class="pic_box" v-for="(msg, num) in item.contentlist3" :key="msg.content_id">
           <router-link :to="{name:'Detail',params:{id: msg.content_id }}">
             <div class="img_box">
               <img :src='msg.content_img ? msg.content_img : "../../static/ban.jpg"' alt="">
               <span class="status_text">{{live_type (msg.live_type)}}</span>
             </div>
             <p style="margin-top: 0.35rem;text-align: left;font-size: 0.28rem">{{msg.name}}</p>
           </router-link>
          </div>

        </div>
      </div>
      </div>
  </div>
</template>

<script>
  import Header from '@/components/Header'
  import { mapState } from 'vuex'
  import api from '@/js/api'
  import BScroll from 'better-scroll'
  export default {
    name: 'Index',
    data () {
      return {
        swiperImg:['./static/ban.jpg'],
        swiperOption: {
          autoplay: 3000,
          loop: true,
          pagination: '.swiper-pagination',
          autoplayDisableOnInteraction:false,
          paginationClickable:true
        },
        indexList:null
      }
    },
    computed: {
      ...mapState( ['q_id'] )
    },
    components: {
      Header
    },
    created () {
      this.get_swiper()
      this.list()
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrap,{
          click:  true ,
          tap: true
        })
      })
    },
    mounted () {

    },
    methods: {
      list () {
        var params = {
          id: this.q_id
        }
        params = JSON.stringify(params)
        api.indexList(params).then(res => {
          console.log(res)
          this.indexList = res.result.data
        }).catch(err => {
          console.log(err)
        })
      },
      live_type (type) {
        if(type ==1){
          return "预告"
        } else if(type == 2){
          return "直播"
        }else if(type == 3){
          return "热播"
        }
      },
      get_swiper () {
        let  params = {
          id:this.q_id,
          type:1
        }
        api.rankList(params).then(res => {
          console.log(res)
          if(res.data.length>0){
            this.swiperImg = res.data
          }
        }).catch(err => {
          console.log(err)
        })
      },
      toDetail (cid) {
        this.$router.push({name:'Detail',params:{id: cid }})
      }
    }
  }
</script>

<style scoped>
  .swiper_wrapper{
    width: 100%;
    height: 2.7rem;
    overflow: hidden;
  }
  .index_img{
    width: 100%;
    height: 100%;
  }
.swiper_wrapper >>> .swiper-pagination-bullet{
  background: #fff!important;
}
.swiper_wrapper >>> .swiper-pagination-bullet-active{
  background: #db2e32!important;
}
  .channel_list{
    width: 100%;
    height: auto;
    background: #fff;
    padding: 0.5rem 0;
    margin-top: 0.15rem;
  }
  .pic_box{
    /*width: 100%;*/
    text-align: center;
    margin: 0.5rem 0.2rem 0rem 0.2rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #cdcdcd;
  }
  .img_box{
    width: 100%;
    height: 2rem;
    overflow: hidden;
    border-radius: 10px;
    position: relative;
  }
.img_box img{
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
  .status_text{
    position: absolute;
    right: 15px;
    top: 15px;
    background: #db2e32;
    color: #fff;
    padding: 4px 10px;
    border-radius: 15px;
  }
</style>
