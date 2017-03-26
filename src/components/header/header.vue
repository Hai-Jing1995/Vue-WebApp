<template>
	<div class="header">
		<div class="content-wrapper">
			<!--店铺头像-->
			<div class="avatar">
				<img :src="seller.avatar" width="64px" height="64px">
			</div>
			<!--头像旁显示的内容-->
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<div class="support" v-if="seller.supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="supports-count" @click="showDetail()">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="showDetail()">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background-image">
			<img :src="seller.avatar" width="100%" height="100%">
		</div>
		<transition name="fade">	
			<div v-if="detailShow" class="detail" >
				<!--Stick footers的套路-->
				<!--1内容的包装器和嵌套一个真正放内容的div-->
				<!--2固定在下面的部分-->
				<div class="detail-wrapper clearfix">
					<div class="detail-main">
						<h1 class="name">{{seller.name}}</h1>
						<div class="star-wrapper">
							<star :size="48" :score="seller.score"></star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="supports">
							<li v-for="(item, index) in seller.supports" class="support-item">
								<span class="icon" :class="classMap[seller.supports[index].type]"></span>
								<span class="text">{{seller.supports[index].description}}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							<p class="content">{{seller.bulletin}}</p>
						</div>		
					</div>
				</div>
				<div class="detail-close" @click="hideTetail">
					<i class="icon-close"></i>
				</div>
			</div>
		</transition>

	</div>
</template>

<script>
	import star from '../star/star.vue';
	export default{
		//接收父组件传过来的值
		props: {
			seller: {
				type: Object
			}
		},

		data() {
			return{
				detailShow: false     
			}
		},

		methods:{
			showDetail: function(){
				this.detailShow = true;
			},
			hideTetail: function(){
				this.detailShow = false;
			}
		},

		//设置一个数组，对应json数据里supports值中的type
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		},

		//注册star
		components: {
			star
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/minin.styl"
	
	.header
		position: relative
		overflow: hidden	//以防模糊背景图片有溢出的模糊
		background-color: rgba(7, 17, 27, 0.5)	//覆盖在上面的透明背景色
		color: #fff
		.content-wrapper
			position: relative
			padding: 24px 12px 18px 24px
			font-size: 0
			.avatar
				display: inline-block
				vertical-align: top					//头像和下面的描述对齐
				img
					border-radius: 2px
			.content
				display: inline-block
				margin-left: 16px
				.title
					margin: 2px 0 8px 0
					.brand
						display: inline-block
						vertical-align: top			//图标和点名对齐
						width: 30px
						height: 18px
						bg-image('brand')
						background-size: 30px 18px
						background-repeat: no-repeat
					.name
						font-size: 16px
						margin-left: 6px
						font-weight: bold
						line-height: 18px
				.description
					margin-bottom: 10px
					font-size: 12px
					line-height: 12px					
				.support
					.icon
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
						margin-right: 4px
						background-size: 12px
						background-repeat: no-repeat
						&.decrease
							bg-image("decrease_1")
						&.discount
							bg-image("discount_1")
						&.guarantee
							bg-image("guarantee_1")
						&.invoice
							bg-image("invoice_1")
						&.special
							bg-image("special_1")
					.text
						line-height: 12px
						font-size: 10px
			.supports-count
				position: absolute
				right: 12px
				bottom: 14px
				padding: 0 8px
				height: 24px
				line-height: 24px
				border-radius: 14px
				background-color: rgba(0, 0, 0, 0.2)
				text-align: center
				.count
					vertical-align: top
					font-size: 10px
				.icon-keyboard_arrow_right
					line-height: 24px
					margin-left: 2px
					font-size: 10px
		.bulletin-wrapper
			position: relative
			height: 28px
			line-height: 28px
			padding: 0 22px 0 12px
			white-space: nowrap
			overflow: hidden
			text-overflow: ellipsis
			font-size: 10px
			background-color: rgba(7, 17, 27, 0.2)
			.bulletin-title
				display: inline-block
				vertical-align: top	//为了让图标和文字对齐
				margin-top: 8px		//(28-12)/2
				width: 22px
				height: 12px
				bg-image('bulletin')
				background-size: 22px 12px
				background-repeat: no-repeat			
			.bulletin-text
				vertical-align: top  //为了让图标和文字对齐
				font-size: 10px
				margin: 0 4px
			.icon-keyboard_arrow_right
				position: absolute
				font-size: 10px
				right: 12px
				top: 9px
		.background-image
			position: absolute
			left: 0
			top: 0
			width: 100%
			height: 100%		
			z-index: -1	
			filter: blur(10px) 	//设置背景图片模糊
		.detail
			position: fixed		//绝对定位，相对于浏览器窗口
			z-index: 100
			top: 0
			left: 0
			width: 100%
			height: 100%
			overflow: auto
			backdrop-filter: blur(10px);	//iphone手机的模糊
			background-color: rgba(7, 17, 27, 0.8)
			&.fade-enter-active, &.fade-leave-active
				transiton: all 2s ease
			&.fade-enter, &.fade-leave-active
				opacity: 0
				background-color: rgba(7, 17, 27, 0)
			.detail-wrapper
				min-height: 100%	//撑开高度
				width: 100%			//撑开宽度
				.detail-main
					margin-top: 64px
					//就是会固定在下面内容的高度
					//给固定内容留出空间
					padding-bottom: 64px
					.name
						line-height: 16px
						text-align: center
						font-size: 16px
						font-weight: 700
					.star-wrapper
						text-align: center
						margin-top: 16px
						padding:2px 0	//因为图片是20px,设计稿wrapper是24px
					.title
						display: flex
						width: 80%		//不写死
						margin: 28px auto 24px auto
						.line
							flex: 1			//两条line平均分剩余空间
							position: relative
							top: -6px
							border-bottom: 1px solid rgba(255, 255, 255, 0.2)
						.text
							padding: 0 12px		//text不用flex，自动用文字撑开空间
							font-size: 14px	
							font-weight: 700
					.supports
						width: 80%
						margin: 0 auto
						.support-item
							padding: 0 12px
							margin-bottom: 12px
							font-size: 0
							&:last-child
								margin-bottom: 0
							.icon
								display: inline-block
								width: 16px
								height: 16px
								vertical-align: top
								margin-right: 6px
								background-size: 16px
								background-repeat: no-repeat
								&.decrease
									bg-image('decrease_2')
								&.discount
									bg-image('discount_2')
								&.special
									bg-image('special_2')
								&.invoice
									bg-image('invoice_2')
								&.guarantee
									bg-image('guarantee_2')
							.text
								font-size: 12px
								line-height: 16px
					.bulletin
						width: 80%
						margin: 0 auto
						.content
							padding: 0 12px
							font-size: 12px
							line-height: 24px
								
			.detail-close
				position: relative
				width: 32px
				height: 32px
				//套路。
				//因为wrapper的高度是100%了,close想上去margin-top就必须设为负值
				//正好占用了detail-main给它留的空间	
				margin: -64px auto 0 auto
				clear: both
				font-size: 32px
					
					

</style>