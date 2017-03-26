// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods.vue';
import rating from 'components/rating/rating.vue';
import seller from 'components/seller/seller.vue';

//webpack的特性，可以在js里面依赖样式
import 'common/stylus/index.styl';

//安装VueRouter插件
//注册插件
Vue.use(VueRouter);
Vue.use(VueResource);

//定义路由
const routes = [
	{path:'/goods', component:goods},
	{path:'/rating', component:rating},
	{path:'/seller', component:seller},
	{path:'/', redirect:'/goods'}			//刚进入应用就渲染的路由组件
]

// 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
	routes,
	linkActiveClass: 'active'		//Router构造配置，改变当前链接的class名
});


/* eslint-disable no-new */
// 创建和挂载根实例
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
new Vue({
  el: '#app1',		
  router,
  template: '<App/>',
  components: { App }		//注册才可以使用
}).$mount('#app');


