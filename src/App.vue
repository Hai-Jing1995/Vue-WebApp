<template>
  <div id="app">
    <!--父组件向子组件传参-->
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/rating">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <!--keep-alive包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from 'components/header/header.vue';
  import {urlParse} from 'common/js/urlParse.js';

  const ERR_OK = 0;

  export default{
    data(){
      return {
        seller: {
          //每个商家都应该有自己的id。在访问的url中可以看出 
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },

    //生命周期的钩子函数，就是一个vue实例被生成后调用合这个函数
    //用vueRouter获取准备工作中的mock数据
    created(){
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;     //  拿到数据
        if( response.errno === ERR_OK ){
          //相当于在带有id的seller的基础上,又给seller添加了值
          //如果直接给seller赋值为data的话，id就没有了
          //现在selelr中已经有id了，是通过url获取到的
          this.seller = Object.assign({}, this.seller, response.data);
        }
      });
    },

    components: {
      'v-header': header       //不能用html原生标签
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  //引入stylus文件
  @import "./common/stylus/minin.styl"
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    //使用引入stylus文件中的border-1px函数
    border-1px(rgba(7,17,27,0.1))  
    .tab-item
      flex: 1
      text-align:center
      & > a
        display: block
        font-size: 14px
        color: rgb(77,85,93)
        &.active
         color:rgb(240,20,20)
</style>
