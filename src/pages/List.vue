<template>
  <div style="height: 100vh;background: #fff;">
    <Header :homeIndex="true" :styleIndex="false"></Header>
    <div style="overflow: scroll;height: calc( 100% - 1.8rem )">
      <v-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
        <div class="banner_wrapper">
          <img :src='this.column_img?this.column_img:"http://qnrj-vod.homecdn.com/a0113b521fd74ace8558cedadc91508c.png"' alt="">
        </div>
        <div class="channel_list">
          <div class="pic_box" v-for="(item) in channelList" :key="item.cid">
            <router-link :to="{name:'Detail',params:{id:item.cid}}">
              <div class="img_box">
                <img :src='item.img?item.img:"../../static/ban.jpg"' alt="">
                <span class="status_text">{{live_type (item.live_type)}}</span>
              </div>
              <p style="text-align: left;color: #333;font-size: 0.28rem;margin-top: 0.2rem;">{{item.name}}</p>
              <p style="margin-top: 0.15rem;text-align: left;font-size: 0.24rem">{{item.description}}</p>
            </router-link>
          </div>
        </div>
      </v-loadmore>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header'
  import { mapState } from 'vuex'
  import { Loadmore } from 'mint-ui'
  import api from '@/js/api'
  //import BScroll from 'better-scroll'
  export default {
    name: 'List',
    data () {
      return {
        channelList:[],
        page: 1,
        pagesize: 6,
        allLoaded: false, /* 是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了 */
        scrollMode: 'auto', /* 移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动 */
        totalPage: ''
      }
    },
    computed: {
      ...mapState(['q_id']),
      columnid () {
        return this.$route.params.id
      },
      column_img () {
        return this.$route.params.column_img
      },
      column_title () {
        return this.$route.params.title
      }
    },
    components: {
      Header,
      'v-loadmore': Loadmore
    },
    mounted () {
      this.rePageList()
      this.$store.commit('changeTitle',this.column_title)
     // this.scroll = new BScroll(this.$refs.wrapper)
    },
    watch: {
      columnid (val,oldval) {
        this.page = 1
        this.rePageList()
        this.allLoaded = false
        //document.title = this.column_title
        this.$store.commit('changeTitle',this.column_title)
      }
    },
    methods: {
      live_type (type) {
        if(type ==1){
          return "预告"
        } else if(type == 2){
          return "直播"
        }else if(type == 3){
          return "热播"
        }
      },
      loadTop: function () { /* 组件提供的下拉触发方法 */
        this.page = 1
        this.rePageList()
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded() /* 固定方法，查询完要调用一次，用于重新定位 */
        }, 1000)
        this.allLoaded = false
      },
      loadBottom: function () {
        this.more() /* 上拉触发的分页查询 */
        setTimeout(() => {
          this.$refs.loadmore.onBottomLoaded() /* 固定方法，查询完要调用一次，用于重新定位 */
        }, 1000)
      },
      rePageList () {
        let data = {
          page: this.page,
          pagesize: this.pagesize,
          id: this.q_id,
          columnid:this.columnid
        }
        api.channelList(data).then(res => {
          //console.log(res)
          if(res.state.rc>=0){
            this.channelList = res.result.items
            this.totalPage = Math.ceil(res.result.totalcount/this.pagesize)
            this.$nextTick(function () {
              this.scrollMode = 'touch'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      loadPageList () {
        let that = this
        let data = {
          page: that.page,
          pagesize: that.pagesize,
          id: this.q_id,
          columnid:this.columnid
        }
        api.channelList(data).then(res => {
          //console.log(res)
          if(res.state.rc>=0){
            res.result.items.forEach(function (item, index) {
              that.channelList.push(item)
            })
            this.$nextTick(function () {
              this.scrollMode = 'touch'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      more: function () {
        this.page = this.page + 1
        if (this.page <= this.totalPage) {
          this.loadPageList()
        } else {
          this.allLoaded = true
        }
      }
    }
  }
</script>

<style scoped>
  .banner_wrapper{
    width: 100%;
    height: 2.4rem;
  }
  .banner_wrapper img{
    width: 100%;
    height: 100%;
  }
  .channel_list{
    width: 100%;
    height: auto;
    background: #fff;
    padding-bottom: 0.5rem;
   /* margin-top: 0.15rem;*/
  }
  .pic_box{
    /*width: 100%;*/
    text-align: center;
    margin: 0rem 0.2rem 0rem 0.2rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #cdcdcd;
  }
  .img_box{
    width: 100%;
  /*  height: 2rem;*/
    overflow: hidden;
   /* border-radius: 10px;*/
    position: relative;
  }
.img_box img{
  width: 100%;
 /* height: 100%;*/
 /* border-radius: 10px;*/
}
  .status_text{
    position: absolute;
    right: 4px;
    top: 4px;
    background: #db2e32;
    color: #fff;
    padding: 2px 5px;
    border-radius: 15px;
  }
</style>
