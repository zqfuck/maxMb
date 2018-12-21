<template>
  <div>
      <div v-show="showBox" class="book_box">
        <p style="font-size: 0.3rem;color: #db2e32;font-weight: bold;">用户预约</p>
        <p style="display: flex;justify-content: space-between">
          <input class="tel" v-model="tel" type="number" placeholder="请输入手机号码">
          <button v-show="time" @click="timeOut" class="code_btn">获取验证码</button>
          <button v-show="!time" class="time_out">{{timeCount}}秒</button>
        </p>
        <p><input type="text" placeholder="请输入验证码" v-model="code" style="width: 60%;height: 0.5rem;"></p>
        <p>通过手机号订阅之后</br>本频道有更新会下发到您的手机</p>
        <p><button @click="cancel" class="cancel">取消</button><button class="book">预约</button></p>
      </div>
    <div v-show="showBox" class="mask">

    </div>
  </div>
</template>

<script>
  export default {
    name: 'Book',
    data () {
      return {
        tel:null,
        code:null,
        time:true,
        showBook:this.showBox,
        timeCount:60
      }
    },
    props: [ 'showBox' ],
    watch: {
      tel (newVal) {
        if (newVal.length>11){
          this.tel = newVal.slice(0,10)
        }
      }
    },
    mounted () {

    },
    methods: {
      timeOut () {
        this.time=!this.time
        let timer = setInterval( () => {
          this.timeCount--
          if( this.timeCount<0) {
            clearInterval(timer)
            this.time=!this.time
            this.timeCount = 60
          }
        },1000)
      },
      cancel () {
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped>
.book_box{
  width: 70%;
  position: fixed;
  left:10%;
  top: 10%;
  background: #fff;
  border: 1px solid #dcdcdc;
  padding: 5%;
  z-index: 10;
}
  .book_box p{
    margin: 0.2rem 0;

  }
  .tel{
    width: 60%;
    height: 0.5rem;
  }
  .time_out{
    display: inline-block;
    padding: 0 0.3rem;
  }
  .code_btn,.time_out{
    background: #db2e32;
    color: #fff;
    border: none;
    outline: none;
    border-radius: 5px;
  }
  .cancel,.book{
    height: 0.5rem;
    border: none;
    outline: none;
    background: #db2e32;
    color: #fff;
    padding: 0 0.3rem;
    border-radius: 5px;
    margin: 0 0.4rem;
  }
  .mask{
    position: fixed;left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: #000;
    opacity: 0.6;
    z-index: 9;
  }
</style>
