<template>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
					</div>
					<div class="num" v-show="totalCount>0">
						{{totalCount}}
					</div>
				</div>
				<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<!--阻止冒泡，阻止默认行为-->
			<div class="content-right" @click.stop.prevent="pay">
				<div class="pay" :class="payClass">
					{{payDesc}}
				</div>
			</div>
		</div>
		<div class="ball-container">
		<!--<transition-group> 元素作为多个元素/组件的过渡效果-->
		<!--可以通过 tag 属性配置哪个元素应该被渲染-->
		<!--每个 <transition-group> 的子节点必须有 独立的key ，动画才能正常工作-->
			<transition-group name="drop" tag="div" 
			v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
				<div v-for="ball in balls" v-show="ball.show" class="ball" :key="ball.id">
					<div class="inner inner-hook"></div>
				</div>
			</transition>
		</div>
		<!--购物车详情页-->
		<transition name="fold">
			<div class="shopCart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="food in selectFoods">
							<span class="name">{{food.name}}</span>
							<div class="price">
								<span>￥{{food.price*food.count}}</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="food"></cartcontrol> 
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<!--背景模糊图-->
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hidelist"></div>
		</transition>
	</div>
</template>

<script type="text/javascript">
	import cartcontrol from '../cartcontrol/cartcontrol.vue';
	import BSrcoll from 'better-scroll';	//滚动组件。老师自己写的组件
	import Vue from 'vue';
	export default {
		props:{
			//存放选择的food
			//所有状态都是由selectFoods计算而来的
			selectFoods:{
				type: Array,
				default() {
					return [
						{
							price: 2,
							count: 5
						}
					];		//如果type是Array或者Object,default就是一个函数
				}
			},
			deliveryPrice:{
				type: Number,
				default: 0		//默认值
			},
			minPrice:{
				type: Number,
				default: 0
			}
		},

		data() {
			return {
				balls: [{
						show: false,
						id: 1
					},
					{
						show: false,
						id: 2
					},
					{
						show: false,
						id: 3
					},
					{
						show: false,
						id: 4
					},
					{
						show: false,
						id: 5
					}
				],
				//已经下落的小球数组
				dropBalls: [],
				//购物车详情页是否展开
				fold: true,
				bus: new Vue()
			}
		},

		computed: {
			//总价钱
			totalPrice: function(){
				let total = 0;
				this.selectFoods.forEach( (food) => {
					total += food.price * food.count;
				})
				return total;
			},
			//总数目。用于小购物车右上角显示
			totalCount: function(){
				let count = 0;
				this.selectFoods.forEach( (food) => {
					count += food.count;
				})
				return count;
			},
			//实时计算是否达到起送价
			payDesc: function(){
				if(this.totalPrice === 0){
					return `￥${this.minPrice}元起送`;
				}else if(this.totalPrice < this.minPrice){
					let diff = this.minPrice - this.totalPrice;
					return `还差￥${diff}元起送`;
				}else{
					return '去结算';
				}
			},
			//计算是否足够起送价，用来给pay添加class
			payClass: function(){
				if(this.totalPrice < this.minPrice){
					return 'not-enough';
				}else{
					return 'enough';
				}
			},
			//判断商品详情页是否显示
			listShow: function(){
				if (!this.totalCount){
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				if (show){
					this.$nextTick(()=> {
						if (!this.scroll){
							this.scroll = new BSrcoll(this.$refs.listContent,{
								click: true
							});
						}else{
							//如果已经存在了就不用重新实例化了
							this.scroll.refresh();	
						}						
					} )
				}
				return show;
			}
		},

		created() {
			//在整个goods页面下,shopcart和cartcontrol是兄弟
			this.$parent.bus.$on('cart-add',this.drop),
			//在shopcart中,shopcart是cartcontrol的父节点
			this.bus.$on('cart-add',this.drop)
		},

		methods: {
			//小球掉落的方法
			drop: function(el){
				for(let i = 0; i < this.balls.length; i++){
					let ball = this.balls[i];
					//找到一个隐藏的小球
					//把el赋给它。并填入dropBall中
					if( !ball.show ){
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			//进入动画前
			beforeEnter: function(el){
				let count = this.balls.length;
				while (count--){
					let ball = this.balls[count];
					//获得show=true小球对应的el的相对于视口的位置
					if (ball.show === true){
						let rect = ball.el.getBoundingClientRect();
						//小球起始点x,y与终点(购物车)的差值
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22);
						el.style.display = '';
						//外层元素做一个纵向的动画
						el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
						el.style.transform = `translate3d(0, ${y}px, 0)`;
						//内部元素做一个横向动画
						let inner = el.getElementsByClassName("inner-hook")[0];
						inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
						inner.style.transform = `translate3d(${x}px, 0, 0)`;

					}
				}
			},
			//小球进入动画时
			enter: function(el){
				//重绘
				let rf = el.offsetHeight;
				this.$nextTick( () => {
					el.style.display = '';
					//外层元素做一个纵向的动画
					el.style.webkitTransform = 'translate3d(0, 0, 0)';
					el.style.transform = 'translate3d(0, 0, 0)';
					//内部元素做一个横向动画
					let inner = el.getElementsByClassName("inner-hook")[0];
					inner.style.webkitTransform = 'translate3d(0, 0, 0)';
					inner.style.transform = 'translate3d(0, 0, 0)';
				} )
			},
			//动画做完后
			//重置。小球又能重新用了
			afterEnter: function(el){
				let  ball = this.dropBalls.shift();
				if (ball){
					ball.show = false;
					el.style.display = 'none';
				}
			},
			//点击来回折叠商品详情页
			toggleList: function(){
				if (!this.totalCount){
					return;
				}
				this.fold = !this.fold;
			},
			//清空购物车
			empty: function(){
				this.selectFoods.forEach((food) =>{
					food.count = 0;
				} )
			},
			//点击模糊背景图也能收起商品详情
			hidelist: function(){
				this.fold = true
			},
			//去结算
			pay: function(){
				if(this.totalPrice < this.minPrice){
					return;
				}
				window.alert(`支付${this.totalPrice}元`);
			}
		},

		components: {
			cartcontrol
		}

	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/minin.styl"
	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 50
		width: 100%
		height: 48px
		.content
			display: flex
			background-color: #141d27
			font-size: 0
			.content-left
				flex: 1
				.logo-wrapper
					display: inline-block
					vertical-align: top		//display:inline-block通常是顶部对齐
					position: relative
					top: -10px		//（116-96）/2  超出去的那一部分
					margin: 0 12px		//(36px-6px)/2
					padding: 6px
					width: 56px			//(88+24)/2   盒模型,padding也包括在内
					height: 56px
					box-sizing: border-box	//所设置的高度和宽度包括了内容，内边距和边框
					border-radius: 50%
					background-color: #141d27		//如果不再设置背景色，超出部分为透明色
					.logo
						width: 100%			//因为父元素有padding
						height: 100%
						text-align: center 	//图标水平居中
						border-radius: 50%
						background-color: #2b343c
						&.highlight		//如果有选中商品,购物车显示的样式
							background-color: rgb(0, 160, 220)
						.icon-shopping_cart
							font-size: 24px
							line-height: 44px		//垂直居中
							color: #80858a
							&.highlight
								color: #fff
					.num
						position: absolute
						top: 0
						right: 0
						width: 24px
						height: 16px
						line-height: 16px
						text-align: center
						border-radius: 16px
						font-size: 9px
						font-weight: 700
						color: rgb(255, 255, 255)
						background-color: rgb(240, 20, 20)
						box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
				.price
					display: inline-block
					vertical-align: top
					line-height: 24px
					margin-top: 12px		//为了垂直居中。如果line-height,border-right就会撑满整个高度
					padding-right: 12px
					box-sizing: border-box
					border-right: 1px solid rgba(255, 255, 255, 0.1)
					font-size: 16px
					font-weight: 700
					color: rgba(255, 255, 255, 0.4)
					&.highlight
						color: #fff
				.desc
					display: inline-block
					vertical-align: top
					margin: 12px 0 0 12px 
					line-height: 24px
					font-size: 10px
					color: rgba(255, 255, 255, 0.4)
					
			.content-right	
				flex: 0 0 105px
				width: 105px
				.pay
					height: 48px 
					line-height: 48px
					text-align: center
					font-size: 12px
					font-weight: 700
					color: rgba(255, 255, 255, 0.4)			
					&.not-enough
						background-color: #2b333b
					&.enough	
						background-color: #00b43c
						color: #fff
		.ball-container
			.ball
				position: fixed
				left:32px
				bottom: 22px
				z-index: 50
				&.drop-enter-active
					transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.4)
					//inner就是小球
					.inner
						width: 16px
						height: 16px
						border-radius: 50%
						background-color: rgb(0, 160, 220)
						transition: all 0.4s linear	
		.shopCart-list
			position: absolute
			top: 0
			left: 0
			width: 100%
			z-index: -1
			transform: translate3d(0, -100%, 0)  //相对于当前自身高度做偏移
			&.fold-enter-active, &.fold-leave-active
				transition: all 0.5s
			&.fold-enter, &.fold-leave-active
				transform: translate3d(0, 0, 0)	
			.list-header
				height: 40px
				line-height: 40px
				padding: 0 18px
				background-color: #f3f5f7
				border-bottom: 1px solid rgba(7, 17, 27, 0.1)
				.title
					float: left
					font-size: 14px
					color: rgb(7, 17, 27)
				.empty
					float: right
					font-size: 12px
					color: rgb(0, 160, 220)
			.list-content
				padding: 0 18px
				max-height: 217px		//超过该高度不再无限增高
				background-color: #fff
				overflow: hidden 
				.food
					position: relative
					padding: 12px 0
					box-sizing: border-box
					border-1px: rgba(7, 17, 27, 0.1)
					.name
						height: 24px
						font-size: 14px
						color: rgb(7, 17, 27)
					.price
						position: absolute
						bottom: 12px
						right: 90px
						line-height: 24px
						font-size: 14px
						font-weight: 700
						color: rgb(240, 20, 20)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 5px
		.list-mask
			position: fixed
			top: 0
			left: 0
			width: 100%
			height: 100%
			z-index: -10
			background-color: rgba(7, 17, 27, 0.6)
			backdrop-filter: blur(10px)
			&.fade-enter-active, &.fade-leave-active
				transition: all 0.5s
			&.fade-enter, &.fade-leave-active
				opacity: 0
				background-color: rgba(7, 17, 27, 0) 					
</style>