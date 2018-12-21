<template>
  <div style="width: 100vw;height: 100vh;overflow: hidden;">
    <div class="title">
      <p>{{video_name}}</p>
    </div>
    <div class="video_wrapper">
      <div v-if="video_show" class="video_box" id="videoSS">
      </div>
      <div v-else class="book_box">
        <Book :showBox="show_book" @cancel="cancel_book"></Book>
        <p style="font-size: 0.5rem;">29小时36分28秒</p>
        <p><button id="book_btn" @click="bookNow">立即预约</button></p>
      </div>
    </div>
    <div class="go_recommend">
      <p>立即了解本栏目推荐的产品</p>
    </div>
    <div class="tab_box">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">内容介绍</mt-tab-item>
        <mt-tab-item id="2">本期嘉宾</mt-tab-item>
        <mt-tab-item id="3">精彩推荐</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected" ref="tab_container">
        <mt-tab-container-item id="1">
          <div class="intro_box">
            <div style="padding-bottom: 0.5rem;border-bottom: 1px solid #cdcdcd">
              <p style="margin: 0.45rem 0 0.35rem 0;">
              <span style="color: #4c5568;font-size: 0.3rem;display: inline-block;width: 50%;">{{video_name}}</span>
                <span ><img class="little_img" style="margin-top: 0.1rem;" src="../assets/eye.png" alt=""><span class="font_">{{pv}}</span></span>
                <span ><img class="little_img" src="../assets/zan.png" alt=""><span class="font_">{{like}}</span></span>
              </p>
              <p style="font-size: 0.28rem;color: #646e83;line-height:26px;text-align: justify;">
                简介: <span>{{content_desc}}</span>
              </p>
            </div>
            <div style="padding-bottom: 0.5rem;">
              <p style="margin: 0.45rem 0 0.35rem 0;">
              <span style="color: #4c5568;font-size: 0.3rem;display: inline-block;width: 50%;">
                频道介绍</span>
              </p>
              <p style="font-size: 0.28rem;color: #646e83;line-height:26px;text-align: justify;">
                 <span>{{column_desc}}</span>
              </p>
            </div>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div class="guest_box" v-for="(item, index) in guest">
            <div style="margin-right: 0.16rem;width: 0.85rem;height: 0.85rem;">
              <img style="width: 100%;border-radius: 50%;height: 100%;" :src='item.img ? item.img : "../assets/head.png"' alt="">
            </div>
            <div>
              <p style="color: #4c5568;font-size: 0.28rem;margin-bottom: 0.35rem;"><span style="margin-right: 0.3rem;">{{item.guest_name}}</span>
                <span v-show="item.sex==0">先生</span><span v-show="item.sex==1">女士</span></p>
              <p style="font-size: 0.26rem;color: #646e83;line-height: 28px;">{{item.guest_desc}}</p>
            </div>
          </div>
          <div>
            <p style="margin-bottom: 0.4rem;">
              <span style="display: inline-block;width: 0.05rem;height: 0.3rem;background: #db2e32;margin-right: 0.1rem;"></span>
              <span style="color: #4c5568;font-size: 0.3rem;">关联节目</span>
            </p>
            <div style="display: flex;justify-content: space-between;padding-bottom: 0.4rem;">
              <div style="width: 47%;text-align: center;">
                <img style="height: 1.8rem;margin-bottom: 0.3rem;" src="../assets/ban.jpg" alt="">
                <p>打个电话的</p>
              </div>
              <div style="width: 47%;text-align: center;">
                <img style="height: 1.8rem;margin-bottom: 0.3rem;" src="../assets/ban.jpg" alt="">
                <p>打个电话的</p>
              </div>
            </div>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
            <div class="recommend" v-for="(item,index) in recommend_data">
              <img :src='item.img ? item.img : "../assets/ban.jpg"' alt="">
              <p>{{item.name}}</p>
              <span>{{live_type (item.type)}}</span>
            </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import api from '@/js/api'
  import Book from '@/components/Book'
  export default {
    name: 'Detail',
    components: {
      Book
    },
    data () {
      return {
        video_show: false,
        selected:"1",
        male:true,
        show_book:false,
        video_name:null,
        poster:'',
        pv:'',
        like:'',
        video_url:null,
        content_desc:null, //内容介绍
        column_desc:null, //频道介绍
        guest:[],//本期嘉宾,
        recommend_data:[] //精彩推荐
      }
    },
    mounted () {
      this.details()
      setTimeout( () => {
        this.scroll = new BScroll('.mint-tab-container')
      },0)
      this.initVideo ()
    },
    methods: {
      initVideo () {
        var obj = {};
        obj.width = "100%";  //播放器宽
        obj.height = "100%";  //播放器高   建议百分比
        obj.SD = this.video_url  //"http://vod.butel.com/ia098fe1fadf741ab80c4e0f5879f7266-20160223234723072-2546.mp4"
        obj.videoposter = this.poster;
        zVideoPlayerInit( "videoSS", obj );  //初始化播放器
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
      bookNow () {
        this.show_book = true
      },
      cancel_book () {
        this.show_book = false
      },
      details () {
        let params = {
          cid:this.$route.params.id
        }
        api.details(params).then(res => {
          console.log(res)
          if(res.state.rc>=0){
            let result = res.result
            this.video_name = result.detail_data.name
            this.poster = result.detail_data.content_img
            this.pv = result.detail_data.pv
            this.like = result.detail_data.like
            this.video_url = result.detail_data.video_url
            this.content_desc = result.detail_data.content_desc
            this.column_desc = result.detail_data.column_desc
            this.guest = result.guest_data
            this.recommend_data = result.recommend_data
          }
          console.log(this.pv)
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>
  .title{
    width: 100%;
    height: 1rem;
    text-align: center;
    font-size: 0.36rem;
    color: #f1f1f1;
    background: #303135;
    line-height: 1rem;
  }
 .video_wrapper{
   width: 100%;
   height: 56.25vw;
   overflow: hidden;
 }
  .video_box{
    width: 100%;
    height: 100%;
  }
  .book_box{
    width: 100%;
    height: 100%;
    background: #000;
    overflow: hidden;
  }
  .book_box p{
    text-align: center;
    color: #fff;
    margin: 0.8rem 0;
  }
  #book_btn{
   padding: 0.1rem 0.3rem;
    background: #db2e32;
    color: #fff;
    border: none;
    outline: none;
    font-size: 0.36rem;
    border-radius: 8px;
  }
  .go_recommend{
    width: 100%;
    height: 0.74rem;
    line-height: 0.74rem;
    background: #303135;
    color: #d0d3df;
    font-size: 0.26rem;
    text-align: center;
  }
  .tab_box{
    height: calc( 100% - 1.74rem - 56.25vw );
  }
  .tab_box >>> .mint-navbar{
    height: 1rem;
    line-height: 1rem;
    padding: 0 0.3rem;
    margin-bottom: 0.2rem;
  }
  .tab_box >>> .mint-tab-item-label{
    font-size: 0.3rem;
    color: #aca3be;
  }
  .tab_box .mint-tab-container{
    height: calc( 100% - 1.36rem );
    overflow: hidden;
    background: #fff;
    width: 89%;
    margin: 0 auto;
    padding:  0 0.2rem;
    border-radius: 8px;
  }
  .mint-navbar >>> .is-selected {
    border-bottom: 7px solid #db2e32;
  }
  .mint-navbar >>> .is-selected .mint-tab-item-label{
    color: #4c5568;
  }
  .tab_box >>> .mint-cell{
    background: inherit;
  }
  .font_{
    font-size: 0.22rem;
    color: #4e5566;
  }
  .little_img{
   margin: 0.05rem 0.1rem 0;
  }
  .guest_box{
    display: flex;
    padding: 0.5rem 0;
    border-bottom: 1px solid #dcdcdc;
    margin-bottom: 0.4rem;
  }
  .recommend{
    padding: 0.4rem 0;
    border-bottom: 1px solid #dcdcdc;
    position: relative;
  }
  .recommend img{
    border-radius: 10px;
    width: 100%;
    height: 2.1rem;
  }
  .recommend p{
    margin-top: 0.35rem;
    font-size: 0.3rem;
    color: #333;
  }
  .recommend span{
    position: absolute;
    right: 0.25rem;
    top: 0.55rem;
    padding: 4px 15px;
    border-radius: 15px;
    color: #fff;
    background: #db2e32;
  }
</style>
