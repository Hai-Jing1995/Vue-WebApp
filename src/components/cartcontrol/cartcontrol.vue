<template>
	<div class="cartcontrol">
		<!--外层负责平移，内层负责滚动-->
		<transition name="move">
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
				<span class="icon-remove_circle_outline inner"></span>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>

<script type="text/javascript">
import Vue from 'vue';
	export default{
		props:{
			food:{
				type: Object
			}
		},

		methods: {
			addCart: function(event){
				//如果这个事件不是用户派发的，而是原生的，就把它return掉
				//为了防止pc端执行两次事件
				if( !event._constructed ){
					return;
				}
				if( !this.food.count ){
					Vue.set(this.food, 'count', 1);		//新增原本没有的一个数据字段，需要vue的一个接口。不能直接设置
				}else{
					this.food.count++;
				}
				//console.log(this.$parent.bus);
				this.$parent.bus.$emit('cart-add', event.target);
			},
			decreaseCart: function(){
				if( !event._constructed ){
					return;
				}
				if( this.food.count > 0 ){
					this.food.count--;
				}
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.cartcontrol
		font-size: 0
		.cart-decrease
			display: inline-block
			padding: 6px		//增加用户点击按钮的范围
			.inner
				line-height: 24px
				font-size: 24px
				color: rgb(0, 160, 220)
			&.move-enter-active, &.move-leave-active
				transition: all 0.4s linear
				.inner
					display: inline-block
					transition: all 0.4s linear
			&.move-enter, &.move-leave-active
				opacity: 0
				transform: translate3d(24px, 0, 0)
				.inner
					transform: rotate(180deg)	
		.cart-count
			display: inline-block
			vertical-align: top
			text-align: center
			width: 12px		//因为加减号有padding
			padding-top: 6px
			line-height: 24px
			font-size: 10px
			color: rgb(147, 153, 159)
		.cart-add
			display: inline-block
			line-height: 24px
			font-size: 24px
			padding: 6px	//增加用户点击按钮的范围
			color: rgb(0, 160, 220)
	</style>