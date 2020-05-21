<template>
  <div>
      <div v-show="showBox" class="book_box">
        <p style="font-size: 0.32rem;
           color: #4c5568;
           font-weight: bold;
           margin-bottom: 0.3rem;
           text-align: center;">频道订阅</p>
        <p style="display: flex;justify-content: space-between">
          <input class="tel" v-model="tel" type="number" style="padding-left: 0.2rem;font-size: 0.3rem;" placeholder="请输入手机号码">
        </p>
        <p style="display: flex;justify-content: space-between"><input type="text" placeholder="请输入验证码" v-model="code" style="width: 61%;height: 0.6rem;padding-left: 0.2rem;font-size: 0.3rem;">
          <button v-show="time" @click="timeOut" class="code_btn">获取验证码</button>
          <button v-show="!time" class="time_out">{{timeCount}}秒</button>
        </p>
        <p>通过手机号订阅之后,本频道有更新会下发到您的手机</p>
        <p><button @click="book_channel" class="book">订阅</button><button @click="cancel" class="cancel">取消</button></p>
      </div>
    <div v-show="showBox" class="mask">

    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  import api from '@/js/api'
  export default {
    name: 'Book',
    data () {
      return {
        tel:'',
        code:'',
        time:true,
        showBook:this.showBox,
        timeCount:60,
        timer:null
      }
    },
    props: [ 'showBox','columnId' ],
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
        if(this.checkPhone(this.tel)){
          let params = {
            phone:this.tel,
            channel:this.columnId
          }
          api.getCode(params).then(res => {
            console.log(res)
            if(res.state.rc == -1){
              Toast({
                message: '您已经订阅过此频道',
                duration: 2000
              })
              this.tel = ''
              this.code = ''
              this.$emit('cancel')
                clearInterval(this.timer)
                  this.timeCount = 60
            }else {
              this.time=!this.time
              Toast({
                message: '短信验证码已发送您的手机',
                duration: 2000
              })
              this.timer = setInterval( () => {
                this.timeCount--
                if( this.timeCount<0) {
                  clearInterval(this.timer)
                  this.time=!this.time
                  this.timeCount = 60
                }
              },1000)
            }
          }).catch(err => {
            console.log(err)
          })
        }else {
          Toast({
            message: '请输入正确手机号',
            duration: 2000
          })
        }
      },
      book_channel(){
        if(this.checkPhone(this.tel)){
          if(this.code!=''){
            var params = {
              phone:this.tel,
              channel:this.columnId,
              code:this.code
            }
            params = JSON.stringify(params)
            api.book_channel(params).then(res => {
              console.log(res)
              if(res.state.rc==0){
                Toast({
                  message: '订阅成功',
                  duration: 2000
                })
                this.tel = ''
                this.code = ''
                this.$emit('cancel')
                 clearInterval(this.timer)
                 
                  this.time=!this.time
                  console.log(this.time)
                  this.timeCount = 60
              }else {
                Toast({
                  message: '您获取验证码次数过多',
                  duration: 2000
                })
                this.tel = ''
                this.code = ''
                this.$emit('cancel')
              }
            }).catch(err => {
              console.log(err)
            })
          }else {
            Toast({
              message: '请输入验证码',
              duration: 2000
            })
          }
        }else {
          Toast({
            message: '请填写正确手机号',
            duration: 2000
          })
        }
      },
      cancel () {
        this.$emit('cancel')
      },
      checkPhone (phone) {
        var len = phone.length;
        if (len != 11 || !this.isPhoneNumber(phone)) {
          return false;
        }
        return true;
      },
     isPhoneNumber (phoneNumber) {
        var isPhone = true;
        if (phoneNumber == null || phoneNumber == '') {
          isPhone = false;
        }
        if (phoneNumber.length != 11) {
          isPhone = false;
        }
        var str = "^[1][3,4,5,7,8,9][0-9]{9}$";
        //var str=/^[1][3,4,5,7,8][0,9]{9}$/;
        if (!phoneNumber.match(str)) {
          isPhone = false;
        }
        return isPhone;
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
    width: 100%;
    height: 0.6rem;
  }
  .time_out{
    display: inline-block;
    padding: 0 0.3rem;
  }
  .code_btn,.time_out{
    background: #fff;
    color: #db2e32;
    border: 1px solid #db2e32;
    outline: none;
    flex-shrink: 0;
  }
  .cancel,.book{
    height: 0.64rem;
    border: none;
    outline: none;
    background: #db2e32;
    color: #fff;
    padding: 0 0.4rem;
    border-radius: 5px;
    margin: 0 0.4rem;
  }
.cancel{
  background: #a1acc0;
  color: #fff;
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
