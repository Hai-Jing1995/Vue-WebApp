<template>
	<div class="star" :class="starType">
		<span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
	</div>
</template>

<script type="text/javascript">
	const LENGTH =  5;
	const CLS_ON = 'on';
	const CLS_HALF = 'half';
	const CLS_OFF = 'off';

	export default {
		props: {
			size: {
				type: Number
			},
			score: {
				type: Number
			}
		},

		//通过传入的size值，实时计算starType的值
		computed: {
			starType: function(){
				return 'star-' + this.size;
			},
			itemClasses: function(){
				let result = [];
				let score = Math.floor(this.score * 2) / 2;		//分数向下取整
				let hasDecimal = score % 1 !== 0;			//是否有小数点
				let integer = Math.floor(score);			//整数部分
				for ( let i = 0; i < integer; i++ ){
					result.push( CLS_ON );
				}
				if( hasDecimal ){
					result.push( CLS_HALF );
				}
				while( result.length < LENGTH ){
					result.push( CLS_OFF );
				}
				return result;
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import "../../common/stylus/minin.styl"

	.star
		font-size: 0	//防止inline元素中间有空隙
		.star-item
			display: inline-block
			background-repeat: no-repeat
		&.star-48
			.star-item
				width: 20px
				height: 20px
				background-size: 20px 20px
				margin-right: 22px
				&:last-child
					margin-right: 0
				&.on
					bg-image('star48_on')
				&.off
					bg-image('star48_off')
				&.half
					bg-image('star48_half')				
		&.star-36
			.star-item
				width: 15px 
				height: 15px
				background-size: 15px 15px
				margin-right: 6px
				&:last-child
					margin-right: 0
				&.on
					bg-image('star36_on')
				&.off
					bg-image('star36_off')
				&.half
					bg-image('star36_half')	
		&.star-24
			.star-item
				width: 10px
				height: 10px
				background-size: 10px 10px
				margin-right: 3px
				&:last-child
					margin-right: 0
				&.on
					bg-image('star24_on')
				&.off
					bg-image('star24_off')
				&.half
					bg-image('star24_half')
	
</style>