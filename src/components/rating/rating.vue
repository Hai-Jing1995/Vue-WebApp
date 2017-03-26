<template>
<!--如果rating-content超过rating的高度就滚动-->
	<div class="rating" ref="ratings">
		<div class="rating-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect :selectType="selectType" :onlyContent="onlyContent" 
			 :ratings="ratings"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-for="rating in ratings" class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)">
						<div class="avatar">
							<img :src="rating.avatar" width="28px" height="28px">
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend && rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span v-for="item in rating.recommend" class="item">{{item}}</span>
							</div>
							<div class="time">
								{{rating.rateTime | formatDate}}
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import star from '../../components/star/star.vue';
import split from '../split/split.vue';
import ratingselect from '../ratingselect/ratingselect.vue';
import BSrcoll from 'better-scroll';	//滚动组件。老师自己写的组件
import {formatDate} from '../../common/js/date.js';
import Vue from "vue";
const ALL = 2;
const ERR_OK = 0
	export default{
		props: {
			seller: {
				type: Object
			}
		},

		data() {
			return {
				ratings: [],
				selectType: ALL,
				onlyContent: true,
				bus: new Vue()
			};
		},

		//筛选评论按钮与下面的评论相关联
		methods: {
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
		
		created() {
			//通过vueServer拿到data.json中的ratings数据
			this.$http.get('/api/ratings').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK){
					this.ratings = response.data;
				}
				this.$nextTick(() => {
					this.scroll = new BSrcoll(this.$refs.ratings,{
						click: true
					})
				})
			});
			var that = this;
			//ratingselect组件派发的事件
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

		filters: {
			formatDate: function(time){
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		},

		components:{
			star,
			split,
			ratingselect
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/minin.styl"
	.rating
		position: absolute
		top: 174px			//header组件的高度
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		.overview
			display: flex
			padding: 18px 0
			.overview-left
				flex: 0 0 137px
				padding: 6px 0
				width: 137px
				border-right: 1px solid rgba(7, 17, 27, 0.1)
				text-align: center	
				//iphone5小屏幕下
				@media only screen and (max-width: 320px)
					flex: 0 0 120px
					width: 120px
				.score
					margin-bottom: 6px
					line-height: 28px
					font-size: 24px
					color: rgb(255, 153, 0)	
				.title
					margin-bottom: 8px
					line-height: 12px
					font-size: 12px
					color: rgb(7, 17 27)
				.rank
					line-height: 10px
					font-size: 10px
					color: rgb(147, 153,159)
			.overview-right
				flex: 1
				padding: 6px 0 6px 24px
				@media only screen and (max-width: 320px)
					padding-left: 6px
				.score-wrapper
					margin-bottom: 8px
					font-size: 0
					.title
						display: inline-block
						vertical-align: top
						line-height: 18px
						font-size: 12px
						color: rgb(7, 17, 27)
					.star
						display: inline-block
						vertical-align: top
						margin: 0 12px
					.score
						display: inline-block
						vertical-align: top
						line-height: 18px
						font-size: 12px
						color: rgb(255, 153, 0)  			
				.delivery-wrapper
					font-size: 0
					//文字和文字默认对齐
					.title
						line-height: 18px
						font-size: 12px
						color: rgb(7, 17, 27)
					.delivery
						font-size: 12px
						color: rgb(147, 153, 159)
						margin-left: 12px
		.rating-wrapper
			padding: 0 18px
			.rating-item
				display: flex
				padding: 18px 0
				border-1px(rgba(7, 17, 27, 0.1))
				.avatar
					flex: 0 0 28px
					width: 28px
					margin-right: 12px
					img
						border-radius: 50%
				.content
					flex: 1
					position: relative
					.name
						line-height: 12px 
						font-size: 10px
						color: rgb(7, 17, 27)
						margin-bottom: 4px
					.star-wrapper
						margin-bottom: 6px
						font-size: 0
						.star
							display: inline-block
							vertical-align: top
							margin-right: 6px
						.delivery
							display: inline-block
							vertical-align: top
							line-height: 12px
							font-size: 10px
							color: rgb(147, 153, 159)
					.text
						margin-bottom: 8px
						line-height: 18px
						font-size: 12px
						color: rgb(7, 17, 27)
					.recommend
						line-height: 16px
						font-size: 0
						.icon-thumb_up, .item
							display: inline-block
							margin: 0 8px 4px 0
							line-height: 16px
							font-size: 9px
						.icon-thumb_up
							color: rgb(0, 160, 220)
						.item
							padding: 0 6px
							border: 1px solid rgba(7, 17, 27, 0.1)
							border-radius: 1px
							color: rgb(147, 153, 159)
							background-color: #fff
					.time
						display: absolute
						top: 0
						right: 0
						line-height: 12px
						font-size: 10px
						color: rgb(147, 153, 159)
							
							
						
						
</style>