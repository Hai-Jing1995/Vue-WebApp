<template>
	<div class="ratingselect">
		<div class="rating-type border-1px">
			<span class="block positive" :class="{'active':selectType1===2}" @click="select(2,$event)">
				{{desc.all}}
			<span class="count">{{ratings.length}}</span></span>
			<span class="block positive" :class="{'active':selectType1===0}" @click="select(0,$event)">
				{{desc.positive}}
			<span class="count">{{positives.length}}</span></span>
			<span class="block negative" :class="{'active':selectType1===1}" @click="select(1,$event)">
				{{desc.negative}}
			<span class="count">{{negatives.length}}</span></span>
		</div>
		<div class="switch" :class="{'on':onlyContent1}" @click="toggleContent">
			<i class="icon-check_circle"></i>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script type="text/javascript">
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;
	export default{
		props: {
			ratings: {
				type: Array,
				default() {
					return [];
				}
			},
			selectType: {
				type: Number,
				default: ALL
			},
			//是否只显示内容
			onlyContent: {
				type: Boolean,
				default: false
			},
			//因为商品详情页和评价页里对于评论的描述不一样
			desc: {
				type: Object,
				default (){
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					}
				}
			}
		},

		//因为子组件不能直接修改props的值
		//这里将props的值传递给data中
		//然后再在触发事件告诉父组件更改对应的值
		data (){
			return {
				selectType1: this.selectType,
				onlyContent1: this.onlyContent
			}
		},

		computed: {
			//过滤出推荐和吐槽的评价
			//这个组件中是为了要显示他们的数量
			positives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === POSITIVE;
				})
			},
			negatives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === NEGATIVE;
				})
			}
		},

		methods: {
			//点击选中类型
			select: function(type, event){
				if(!event._constructed){
					return;
				}
				this.selectType1 = type;		//单纯的这么改父组件是不会跟着改变的
				this.$parent.bus.$emit('ratingtype-select', type);
			},
			//来回切换是否显示有内容的评论
			toggleContent: function(event){
				if(!event._constructed){
					return;
				}
				this.onlyContent1 = !this.onlyContent1;
				this.$parent.bus.$emit('content-toggle',this.onlyContent1);
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/minin.styl'
	.ratingselect
		.rating-type
			padding: 18px 0
			margin: 0 18px		//为了下面的线
			border-1px(rgba(7, 17, 27, 0.1))
			font-size: 0
			.block
				display: inline-block
				padding: 8px 12px
				margin-right: 8px
				line-height: 16px
				border-radius: 1px
				font-size: 12px
				color: rgb(77, 85, 93)
				&.active
					color: #fff
				.count
					font-size: 8px
					margin-left: 2px
				&.positive
					background: rgba(0, 160, 220, 0.2)
					&.active
						background: rgb(0, 160, 220)
				&.negative
					background: rgba(77, 85, 93, 0.2)
					&.active
						background: rgb(0, 160, 220)
		.switch
			padding: 12px 18px
			line-height: 24px
			border-bottom: 1px solid rgba(7, 17, 27, 0.1)
			color: rgb(147, 153, 159)
			font-size: 0
			&.on						//选中只显示内容按钮
				.icon-check_circle
					color: #00c850
			.icon-check_circle
				display: inline-block		//对齐
				vertical-align: top
				margin-right: 4px 
				font-size: 24px
			.text
				font-size: 12px
				
				
			
</style>