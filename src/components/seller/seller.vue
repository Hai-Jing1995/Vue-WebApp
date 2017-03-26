<template>
<!--BScroll外层有一个容器，有一个固定的视口高度-->
<!--内层被内容撑高-->
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc border-1px">
					<star :size="36" :score="seller.score"></star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>	
				</ul>
				<div class="favorite" @click="toggleFavorite">
					<span class="icon-favorite" :class="{'active':favorite}"></span>
					<span class="text">{{favoriteText}}</span>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告与活动
				<div class="content-wrapper border-1px">
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<ul v-if="seller.supports" class="supports">
					<li v-for="(item, index) in seller.supports" class="support-item border-1px">
						<span class="icon" :class="classMap[seller.supports[index].type]"></span>
						<span class="text">{{seller.supports[index].description}}</span>
					</li>
				</ul>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<!--设置pic-wrapper主要是为了横向滚动-->
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" ref="picList">
						<li class="pic-item" v-for="pic in seller.pics">
							<img :src="pic" width="120px" height="90px">
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="info">
				<h1 class="title border-1px">商家信息</h1>
				<ul>
					<li class="info-item" v-for="info in seller.infos">{{info}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import BScroll from 'better-scroll';	//滚动组件。老师自己写的组件
import star from "../star/star.vue";
import split from "../split/split.vue";
import {saveToLocal,loadFromLocal} from "../../common/js/store.js";
	export default{
		props:{
			seller:{
				type: Object
			}
		},
		//取到localstorage中的favorite
		data() {
			return{
				favorite: function(){
					return loadFromLocal(this.seller.id, 'favorite', false);
				}
			}
		},

		computed:{
			favoriteText: function(){
				return this.favorite ? '已收藏' : '收藏';
			}
		},

		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		},

		//seller是异步获取，最开始的seller中什么也没有
		watch: {
			'seller': function(){
				this._initScroll();
				this._initPics();
			}
		},

		//dom已经被生成的钩子
		//先执行mounted,初始化BScroll
		//但是seller还没有异步获取到
		//然后watch到seller的变化
		//最后执行else中的refresh()。元素高度被撑开
		//正确执行
		//使用 mounted 并不能保证钩子函数中的 this.$el 在 document 中。
		//为此还应该引入 Vue.nextTick
		mounted() {
			this.$nextTick(() => {
				this._initScroll();	
				this._initPics();				
			})
		},
	
		methods: {
			//初始化BScroll
			_initScroll: function(){
				this.$nextTick(() => {
					if (!this.scroll){
						this.scroll = new BScroll(this.$refs.seller,{
							click: true
						})
					}else{
						this.scroll.refresh();
					}
				})		
			},
			//计算ul的宽度
			//最开始seller是空的没别加载，这个函数不会被执行
			//watch到seller变化后才开始执行
			_initPics: function(){
				if(this.seller.pics){
					let picWidth = 120;
					let margin = 6;
					let width = (picWidth+margin) * this.seller.pics.length - margin;
					//给ul设置宽度
					this.$refs.picList.style.width = width + "px";
					//横向滚动
					this.$nextTick(() => {
						if(!this.Picscroll){
							this.Picscroll = new BScroll(this.$refs.picWrapper,{
								scrollX: true,
								eventPassthrough: 'vertical'	//同时可以竖向滚动
							});
						}else{
							this.Picscroll.refresh();
						}						
					});	
				}		
			},
			//收藏按钮
			toggleFavorite: function(){
				if(!event._constructed){
					return;
				}
				this.favorite = !this.favorite;
				//向localstorage中存数据
				saveToLocal(this.seller.id, 'favorite', this.favorite);
			}
		},

		components:{
			star,
			split
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/minin.styl"
	.seller
		position: absolute
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		.overview
			padding: 18px
			position: relative
			.title
				margin-bottom: 8px
				line-height: 14px
				color: rgb(7, 17, 27)
				font-size: 14px
			.desc
				padding-bottom: 18px
				font-size: 0
				border-1px(rgba(7, 17, 27, 0.1))
				.star
					display: inline-block
					vertical-align: top
					margin-right: 8px
				.text
					display: inline-block
					vertical-align: top
					line-height: 18px
					margin-right: 12px
					color: rgb(77, 85, 93)
					font-size: 10px
			.remark
				display: flex
				padding: 18px 0
				.block
					flex: 1
					text-align: center
					border-right: 1px solid rgba(7, 17, 27, 0.1)
					&:last-child
						border: none
					h2
						margin-bottom: 4px
						line-height: 10px
						font-size: 10px
						color: rgb(147, 153, 159)
					.content
						line-height: 24px
						font-size: 10px
						color: rgb(7, 17, 27)
						.stress
							font-size: 24px
			.favorite
				position: absolute
				width: 50px		//为了限制点击后心形的位置不变
				right: 11px		//因为宽度50,三个字36
				top: 18px
				text-align: center
				.icon-favorite
					display: block	//独占一行
					margin-bottom: 4px
					line-height: 24px
					font-size: 24px
					color: #d4d6d9
					&.active
						color: rgb(240, 20, 20)
				.text
					line-height: 10px
					font-size: 10px
					color: rgb(77, 85, 93)
		.bulletin
			padding: 18px 18px 0 18px
			.title
				margin-bottom: 8px
				line-height: 14px
				color: rgb(7, 17, 27)
				font-size: 14px
			.content-wrapper
				padding: 0 12px 16px 12px
				border-1px(rgba(7, 17, 27, 0.1))
				.content
					line-height: 24px
					font-size: 12px
					color: rgb(240, 20, 20)
			.supports
				.support-item
					padding: 16px 12px
					border-1px(rgba(7, 17, 27, 0.1))
					font-size: 0
					&:last-child
						border: none
					.icon
						display: inline-block
						vertical-align: top
						width: 16px
						height: 16px
						margin-right: 6px
						background-size: 16px
						background-repeat: no-repeat
						&.decrease
							bg-image("decrease_4")
						&.discount
							bg-image("discount_4")
						&.guarantee
							bg-image("guarantee_4")
						&.invoice
							bg-image("invoice_4")
						&.special
							bg-image("special_4")
					.text
						line-height: 16px
						font-size: 12px
						color: rgb(7, 17, 27)					
		.pics
			padding: 18px
			.title
				margin-bottom: 12px
				line-height: 14px
				color: rgb(7, 17, 27)
				font-size: 14px
			.pic-wrapper
				width: 100%
				overflow: hidden
				white-space: nowrap   		//不换行
				.pic-list
					font-size: 0
					.pic-item
						display: inline-block
						margin-right: 6px
						width: 120px
						height: 90px
						&:last-child
							margin: 0
		.info
			padding: 18px 18px 0 18px
			.title
				padding-bottom: 12px	//因为有border,不用margin
				line-height: 14px
				border-1px(rgba(7, 17, 27, 0.1))
				color: rgb(7, 17, 27)
				font-size: 14px
			.info-item
				padding: 16px 12px
				line-height: 16px
				border-1px(rgba(7, 17, 27, 0.1))
				color: rgb(7, 17, 27)
				font-size: 12px
				&:last-child
					border: none
				
				
</style>