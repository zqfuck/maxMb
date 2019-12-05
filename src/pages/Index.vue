<template>
  <div style="height: 100vh;">
    <Header :styleIndex="true" :homeIndex="false"></Header>
    <BookChannel :showBox="show_book" :columnId="column_id" @cancel="cancel_book"></BookChannel>
    <div ref="wrap" style="overflow: hidden;height: calc( 100% - 1.4rem )">
      <div>
        <div class="swiper_wrapper">
          <swiper :options="swiperOption" ref="mySwiper">
            <!-- 这部分放你要渲染的那些内容 -->
            <swiper-slide v-for="(item,index) in swiperImg" :key="index">
              <img :src="item.imgUrl" class="index_img" @click="toDetail(item.cid)" />
            </swiper-slide>
            <!-- 这是轮播的小圆点 -->
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="channel_list" v-for="(item, index) in indexList" :key="item.column_id">
          <p style="padding-left: 0.23rem;height: 0.6rem;">
            <router-link :to="{name:'List',params:{id:item.column_id}}">
              <span style="font-size: 0.3rem;color: #4c5568;">{{item.column_name}}</span>
            </router-link>
            <!-- <router-link :to="{name:'List',params:{id:item.column_id}}">
              <span class="fr" style="cursor:pointer;position: relative;top: 0.1rem;"><img src="../assets/more.png" alt="" style="width: 32px;"></span>
            </router-link>-->
            <span @click="bookNow(item.column_id)" class="fr">
              <img src="../assets/ding.png" alt style="margin-right: 0.3rem;width: 24px;" />
            </span>
          </p>
          <div class="pic_box" v-for="(msg, num) in item.contentlist3" :key="msg.content_id">
            <router-link :to="{name:'Detail',params:{id: msg.content_id }}">
              <div class="img_box">
                <img :src="msg.content_img ? msg.content_img : '../../static/ban.jpg'" alt />
                <span class="status_text">{{live_type (msg.live_type)}}</span>
              </div>
              <p
                style="margin-top: 0.15rem;text-align: left;font-size: 0.2rem;clear: both;
             overflow: hidden;text-overflow: ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2; "
              >{{msg.name}}</p>
            </router-link>
          </div>
          <router-link :to="{name:'List',params:{id:item.column_id}}">
            <p
              v-if="item.has_more==0"
              style="text-align: center;font-size: 0.2rem;width: 100%;clear: both;"
            >加载更多</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import BookChannel from "@/components/BookChannel";
import { mapState, mapActions } from "vuex";
import api from "@/js/api";
import BScroll from "better-scroll";
export default {
  name: "Index",
  data() {
    return {
      swiperImg: ["./static/ban.jpg"],
      swiperOption: {
        autoplay: 3000,
        loop: true,
        pagination: ".swiper-pagination",
        autoplayDisableOnInteraction: false,
        paginationClickable: true
      },
      indexList: null,
      show_book: false,
      column_id: ""
      //q_id:''
    };
  },
  computed: {
    ...mapState(["q_id"])
  },
  components: {
    Header,
    BookChannel
  },
  filters: {
    delstr13(val) {
      return val.substr(0, 13) + "...";
    }
  },
  mounted() {
    //console.log(this.q_id)
    this.$store.commit('changeTitle','直播')
    this.get_swiper();
    this.list();
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrap, {
        click: true,
        tap: true
      });
    });
  },
  methods: {
    list() {
      let qyID = this.q_id ? this.q_id : localStorage.qy_ID;
      var params = {
        id: qyID
      };
      params = JSON.stringify(params);
      api
        .indexList(params)
        .then(res => {
          // console.log(res)
          this.indexList = res.result.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    live_type(type) {
      if (type == 1) {
        return "预告";
      } else if (type == 2) {
        return "直播";
      } else if (type == 3) {
        return "热播";
      }
    },
    bookNow(id) {
      this.show_book = true;
      this.column_id = id;
      
    },
    cancel_book() {
      this.show_book = false;
    },
    get_swiper() {
      let qyID = this.q_id ? this.q_id : localStorage.qy_ID;
      let params = {
        id: qyID,
        type: 1
      };
      api
        .rankList(params)
        .then(res => {
          // console.log(res)
          if (res.data.length > 0) {
            this.swiperImg = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toDetail(cid) {
      this.$router.push({ name: "Detail", params: { id: cid } });
    }
  }
};
</script>

<style scoped>
.swiper_wrapper {
  width: 100%;
  height: 2.4rem;
  overflow: hidden;
}
.index_img {
  width: 100%;
  height: 100%;
}
.swiper_wrapper >>> .swiper-container {
  height: 100%;
}
.swiper_wrapper >>> .swiper-pagination-bullet {
  background: #fff !important;
}
.swiper_wrapper >>> .swiper-pagination-bullet-active {
  background: #db2e32 !important;
}
.channel_list {
  width: 100%;
  height: auto;
  background: #fff;
  padding: 0.3rem 0;
  margin-top: 0.15rem;
  clear: both;
  overflow: hidden;
}
.pic_box {
  width: 46%;
  float: left;
  text-align: center;
  margin: 0.3rem 0.05rem 0rem 0.15rem;
  padding-bottom: 0.2rem;
  /*border-bottom: 1px solid #cdcdcd;*/
}
.img_box {
  width: 100%;
  height: 2rem;
  overflow: hidden;
  /* border-radius: 10px;*/
  position: relative;
}
.img_box img {
  width: 100%;
  height: 100%;
  /*border-radius: 10px;*/
}
.status_text {
  position: absolute;
  right: 4px;
  top: 4px;
  background: #db2e32;
  color: #fff;
  padding: 2px 5px;
  border-radius: 15px;
}
</style>
