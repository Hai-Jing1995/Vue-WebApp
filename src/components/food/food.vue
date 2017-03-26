<template>
	<transition name="move">
		<div class="food" v-show="showFlag" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image" />
					<div class="back" @click="hide">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}</span>
						<span class="rate">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">
							加入购物车
						</div>
					</transition>
				</div>
				<split v-show="food.info"></split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split></split>
				<div class="rating1">
					<h1 class="title">商品评价</h1>
					<ratingselect :selectType="selectType" :onlyContent="onlyContent" 
					:desc="desc" :ratings="food.ratings"></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img :src="rating.avatar" class="avator" width="12" height="12">
								</div>
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,
									 'icon-thumb_down':rating.rateType===1}"></span>
									{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">
							暂无评价
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script type="text/javascript">
import Vue from 'vue'
import cartcontrol from '../cartcontrol/cartcontrol.vue';
import BSrcoll from 'better-scroll';	//滚动组件。老师自己写的组件
import split from '../split/split.vue';
import ratingselect from '../ratingselect/ratingselect.vue';
//带花括号引入的都是export function
import {formatDate} from '../../common/js/date.js';
	const ALL = 2;
	export default{
		props: {
			food: {
				type: Object
			}
		},

		data() {
			return {
				showFlag: false,
				bus: new Vue(),
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			}
		},

		methods: {
			//父组件goods组件调用这个方法
			show: function(){
				this.showFlag = true;
				this.selectType = ALL;		//这两个状态始终保持初始状态
				this.onlyContent = true;
				this.$nextTick(() => {
					if(!this.scroll){
						this.scroll = new BSrcoll(this.$refs.food, {
							click: true
						})
					}else{
						this.scroll.refresh();
					}
				})
			},
			hide: function(){
				this.showFlag = false;
			},
			//点击购物车，加入第一个商品
			addFirst: function(event){
				if (!event._constructed){
					return;
				}
				//点击购物车时出现小球动画
				this.$parent.bus.$emit('cart-add', event.target);
				Vue.set(this.food, 'count', 1);
			},
			//筛选评论按钮与下面的评论相关联
			needShow: function(type, text){
				if( this.onlyContent && !text){
					return false;
				}
				if( this.selectType === ALL ){
					return true;
				}else{
					return this.selectType === type;
				}
			}
		},

		//时间日期转换函数
		//format方法放在common的js文件中
		filters: {
			formatDate: function(time){
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		},

		created() {
			//点击cartcontrol时触发shopcart中的drop方法
			//因为food和shopcart是兄弟组件
			this.bus.$on('cart-add',this.$parent.$refs.shopcart.drop);
			//监听子组件点击后就数据的改变
			//我发现这里的回调函数中this的指向发生了变化
			var that = this;
			this.bus.$on('ratingtype-select', function(type){
				that.selectType = type;
				//因为改变数据，vue的dom更新是异步的
				//在修改数据之后因立即使用$nextTick
				that.$nextTick(() => {
					that.scroll.refresh();
				})
			});
			this.bus.$on('content-toggle', function(onlyContent){
				that.onlyContent = onlyContent;
				that.$nextTick(() => {
					that.scroll.refresh();
				})
			});		
		},

		components: {
			cartcontrol,
			split,
			ratingselect
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/minin.styl";
	.food
		position: fixed
		top: 0
		left: 0
		bottom: 48px
		z-index: 1	//小于购物车，也要小于购物车弹开的mask层
		width: 100%
		background: #fff
		transform: translate3d(0, 0, 0)
		&.move-enter-active, &.move-leave-active
			transition: all 0.2s linear
		&.move-enter, &.move-leave-active
			//相对于自身的宽度平移了100%
			transform: translate3d(100%, 0, 0)	
		.image-header
			position: relative
			width: 100%
			height: 0
			//一开始就把高度限制好，以免图片异步加载后出现滚动
			//padding-top的百分数是相对于盒子的width计算的
			//也就是padding-top和盒子的宽度是一样的
			padding-top: 100%
			img
				position: absolute
				top: 0
				left: 0
				width: 100%
				height: 100%
			.back
				position: absolute
				top: 10px
				left: 0
				.icon-arrow_lift
					display: block
					padding: 10px	//增大点击范围
					font-size: 20px
					color: #fff 
		.content
			position: relative
			padding: 18px
			.title
				line-height: 14px
				font-size: 14px
				font-weight: 700
				margin-bottom: 8px
				color: rgb(7, 17, 27)
			.detail
				margin-bottom: 18px
				height: 10px
				line-height: 10px
				font-size: 0
				.sell-count, .rate
					font-size: 10px
					color: rgb(147, 153, 159)
				.sell-count
					margin-right: 12px
			.price
				line-height: 24px
				.now
					margin-right: 8px
					font-size: 14px
					color: rgb(240, 20, 20)
					font-weight: 700
				.old
					text-decoration: line-through
					font-size: 10px
					color: rgb(147, 153, 159)
			.cartcontrol-wrapper
				position: absolute
				right: 12px			//因为cartcontrol组件有一个本身的padding
				bottom: 12px
			.buy
				position: absolute
				right: 18px
				bottom: 18px
				z-index: 10
				height: 24px
				line-height: 24px
				padding: 0 12px
				box-sizing: border-box 	
				font-size: 10px
				border-radius: 12px
				background-color: rgb(0, 160, 220)
				color: rgb(255, 255, 255)
				&.fade-enter-active, &.fade-leave-active
					transition: all 0.2s
				&.fade-enter, &.fade-leave-active
					opacity: 0	
		.info
			padding: 18px
			.title
				line-height: 14px
				margin-bottom: 6px
				font-size: 14px
				color: rgb(7, 17, 27)
			.text
				line-height: 24px
				padding: 0 8px
				font-size: 12px
				color: rgb(77, 85, 93)
		.rating1
			//不能全部padding18px,因为下面有一条贯穿横轴的线
			padding-top: 18px		
			.title
				line-height: 14px
				margin-left: 18px
				font-size: 14px
				color: rgb(7, 17, 27)
			.rating-wrapper
				padding: 0 18px
				.rating-item
					position: relative
					padding: 16px 0
					border-1px(rgba(7, 17, 27, 0.1))
					.user
						position: absolute
						right: 0
						top: 16px		//rating-item的padding不会影响绝对定位
						font-size: 0
						line-height: 12px
						.name
							display: inline-block
							vertical-align: top
							margin-right: 6px
							color: rgb(147, 153, 159)
							font-size: 10px
						.avator
							border-radius:50% 
					.time
						margin-bottom: 6px
						line-height: 12px
						font-size: 10px
						color: rgb(147, 153, 159)	
					.text
						line-height: 16px
						font-size: 12px
						color: rgb(7, 17, 27);
						.icon-thumb_up, .icon-thumb_down
							margin-right: 4px
							line-height: 16px
							font-size: 12px
						.icon-thumb_up
							color: rgb(0, 160, 220)
						.icon-thumb_down
							color: rgb(147, 153, 159)						
			.no-rating
				padding: 16px 0
			 	font-size: 12px
			 	color: rgb(147, 153, 159)			 	
</style>