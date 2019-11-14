<template>
  <div style="width: 100vw;height: 100vh;overflow: hidden;">
   <!-- <div class="title">
      <p>{{video_name}}</p>
    </div>-->
    <div class="video_wrapper" ref="video_wrapper" :style="style_back">
      <div v-if="video_show!=1" class="video_box" id="videoSS">
      </div>
      <div v-else class="book_box">
        <Book :showBox="show_book" :cid="this.c_id" @cancel="cancel_book"></Book>
        <div style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;background: #333;opacity: 0.6;"></div>
        <p style="font-size: 0.5rem;margin-top: 1.2rem;z-index: 9;position: relative;">{{time_count}}</p>
        <p v-if="isBook"><button class="book_btn"  @click="bookNow">立即预约</button></p>
        <p v-else><span class="book_btn" >敬请期待</span></p>
      </div>
      <div v-if="passW" class="pass_watch ">
        <p style="font-size: 0.3rem;color: #db2e32;font-weight: bold;">请输入观看密码</p>
        <p><input type="text" v-model="passCode" placeholder="请输入密码"  style="width: 60%;height: 35px;"></p>
        <p><button class="book_btn pass_type" @click="pass_watch">确定</button></p>
      </div>
    </div>
    <div  v-if="product_link" class="go_recommend">
      <p ><a :href="product_link" style="color: inherit!important;">立即了解本栏目推荐的产品</a></p>
      <!--<p v-else>本栏目暂无推荐的产品</p>-->
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
              <span style="color: #4c5568;font-size: 0.3rem;font-weight:bold;display: inline-block;width: 50%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{video_name}}</span>
                <span ><img class="little_img" style="margin-top: 0.1rem;" src="../assets/eye.png" alt=""><span class="font_">{{pv}}</span></span>
                <span ><img class="little_img" src="../assets/zan.png" alt=""  @click="zan"><span class="font_">{{like}}</span></span>
              </p>
              <p id="intro" style="font-size: 0.28rem;color: #646e83;line-height:26px;">
                <span style="text-align: left;display: block;margin-bottom: 0.15rem;font-weight: bold;">简介</span> <span v-html="content_desc"></span>
              </p>
            </div>
            <div style="padding-bottom: 0.5rem;">
              <p style="margin: 0.45rem 0 0.2rem 0;">
              <span style="color: #4c5568;font-size: 0.28rem;display: inline-block;width: 50%;font-weight: bold;">
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
            <div style="width: 80%;">
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
            <div style="/*display: flex;justify-content: space-between;*/padding-bottom: 0.4rem;">
              <div style="width: 45%;text-align: center;float: left;margin: 0 0.1rem 0.2rem 0.1rem" v-for="(item, index) in guest_relevance" @click="toDetail(item.content_id)">
                <img style="height: 1.8rem;margin-bottom: 0.3rem;" :src='item.content_img?item.content_img:"../../static/ban.jpg"' alt="">
                <p>{{item.name|delstr}}</p>
              </div>
            </div>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
            <div class="recommend" v-for="(item,index) in recommend_data" @click="toDetail(item.cid)">
              <img :src='item.img?item.img:"../../static/ban.jpg"' alt="" >
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
  import { Toast } from 'mint-ui'
  import api from '@/js/api'
  import Book from '@/components/Book'
  export default {
    name: 'Detail',
    components: {
      Book
    },
    data () {
      return {
        c_id:this.$route.params.id,
        video_show: '',
        selected:"1",
        male:true,
        show_book:false,
        video_name:null,
        time_count:null,
        live_start:null,
        poster:'',
        pv:'',
        like:'',
        tid:'',
        product_link:'',
        video_url:null,
        content_desc:null, //内容介绍
        column_desc:null, //频道介绍
        guest_relevance:[],//嘉宾相关视频
        guest:[],//本期嘉宾,
        recommend_data:[], //精彩推荐
        watch_type:'',
        isBook:false,
        passCode:'',
        passW:false, //密码确认
        style_back:{

        }
      }
    },
    mounted () {
      this.details()
      setTimeout( () => {
        this.scroll = new BScroll('.mint-tab-container',{
          click:  true ,
          tap: true
        })
      },100)
    },
    watch:{
      video_show (val,oldVal) {
        //console.log(val,oldVal)
        //this.details()
      }
    },
    computed:{

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
      toDetail (cid){
        this.$router.push({name:'Detail',params:{id:cid}})
        this.c_id = cid
        this.details ()
        location.reload()
      },
      details () {
        let params = {
          cid:this.c_id
        }
        api.details(params).then(res => {
          console.log(res)
          if(res.state.rc>=0){
            let result = res.result
            this.video_name = result.detail_data.name
            this.poster = result.detail_data.content_img
            this.pv = result.detail_data.pv
            this.like = result.detail_data.like
            this.watch_type = result.detail_data.watch_type
            this.tid = result.detail_data.tid
            this.product_link = result.detail_data.product_link
            this.video_show = result.detail_data.live_type
            this.video_url = result.detail_data.video_url
            this.content_desc = result.detail_data.content_desc
            this.column_desc = result.detail_data.column_desc
            this.guest = result.guest_data
            this.guest_relevance = result.guest_relevance
            this.recommend_data = result.recommend_data
            this.$store.commit('changeTitle',this.video_name)
            if(this.video_show!=1){
              if(this.watch_type==1){
                  this.passW = true
                this.style_back = {
                  background:'url('+ this.poster +') no-repeat center',
                  backgroundSize:'cover'
                }
              }else {
                this.initVideo ()
              }
            }else {
              this.style_back = {
                background:'url('+ this.poster +') no-repeat center',
                backgroundSize:'cover'
              }
            };
            if(this.video_show==1){
              if (this.watch_type==2||this.watch_type==3){
                this.isBook = true
              }
              this.live_start = result.detail_data.live_start
              this.leftTime(this.live_start)
              var timer = setInterval( () => {
                if(this.live_start - (new Date().getTime())<=0){
                  clearInterval(timer)
                }
                this.leftTime(this.live_start)
              },1000)
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      zan(){
        let params = {
          topic_id:this.tid
        }
        params =JSON.stringify(params)
        api.click_zan(params).then(res => {
            this.like = res.likes
        }).catch(err => {
            console.log(err)
        })
      },
      leftTime (time){
        if(time<=86400000){
          var leftTime = time - (new Date().getTime()); //计算剩余的毫秒数
          var hours = parseInt(leftTime / 1000 / 60 / 60 , 10); //计算剩余的小时
          var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
          var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
          hours = this.checkTime(hours);
          minutes = this.checkTime(minutes);
          seconds = this.checkTime(seconds);
          this.time_count = hours+"小时" + minutes+"分"+seconds+"秒";
        }else{
          this.timeCountShow = false
          var day = new Date(time); //将毫秒转化为当前日期
          var year = day.getFullYear();
          var month = day.getMonth()+1;
          var date = day.getDate();
          var hour = day.getHours();
          var minutes = day.getMinutes();
          if(month<10){
            month = "0"+month;
          }
          if(date<10){
            date = "0"+date;
          }
          if(hour<10){
            hour = "0"+hour;
          }
          if(minutes<10){
            minutes = "0"+minutes;
          }
          this.time_count = year+"年"+month+"月"+date+"日"+hour+"时"+minutes+"分";
        }
      },
      checkTime (i){
        if(i<10) {
          i = "0" + i;
        }
        return i;
      },
      pass_watch(){
        let params = {
          id:this.c_id,
          code:this.passCode
        }
        api.check_pass(params).then(res => {
          console.log(res)
          if(res.state.rc>=0){
            this.passW = false
            this.style_back = {}
            this.initVideo ()
            Toast({
              message: '恭喜您验证通过',
              duration: 2000
            })
          }else {
            Toast({
              message: '密码错误',
              duration: 2000
            })
          }
        }).catch(err => {
          console.log(err)
          Toast({
            message: '鉴定失败',
            duration: 2000
          })
        })
      }
    }
  }
</script>

<style scoped>
  .hidden{
    display: none;
  }
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
   position: relative;
 }
 .pass_watch{
   width: 70%;
   height: 70%;
   position: absolute;
   background: #fff;
   left: 15%;
   top: 15%;
 }
  .pass_watch p{
    margin: 0.25rem 0;
    text-align: center;
  }
  .video_box{
    width: 100%;
    height: 100%;
  }
  .book_box{
    width: 100%;
    height: 100%;
   /* background: #000;*/
    overflow: hidden;
  }
  .book_box p{
    text-align: center;
    color: #fff;
    margin: 0.8rem 0;
    position: relative;
    z-index: 9;
  }
  .book_btn,.pass_type{
   padding: 0.1rem 0.3rem;
    background: #db2e32;
    color: #fff;
    border: none;
    outline: none;
    font-size: 0.36rem;
    border-radius: 8px;
  }
  .pass_type{
    font-size: 0.26rem;
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
    height: calc( 100% - 56.25vw );
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
    border-bottom: 7px solid #db2e32!important;
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
    width: 24px;
    vertical-align: text-bottom;
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
  #intro img{
    width: 100%;
  }
</style>
