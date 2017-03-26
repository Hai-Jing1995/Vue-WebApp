<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item, index) in goods" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food, $event)">
							<div class="icon">
								<img width="57" height="57" :src="food.icon" />
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellConunt}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopcart"></shopcart>
		<food :food="selectedfood" ref="food"></food>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';	//滚动组件。老师自己写的组件
	import shopcart from '../shopcart/shopcart.vue';
	import cartcontrol from '../cartcontrol/cartcontrol.vue';
	import food from '../food/food.vue';
	import Vue from "vue";
	const ERR_OK =0;
	export default{
		props: {
			seller: {
				type: Object	//seller是通过路由得到的
			}
		},

		data() {
			return {
				goods: [],
				heightlist: [],    //用来存放foods栏中每一项的高度
				scrollY: 0,		  //需要跟踪这个变量
				// 将在各处使用该事件中心
				// 组件通过它来通信
				// 兄弟组件也可以通过这个通信
				// shopcart和cartcontrol通信
				// 放入data中子组件才能通过$parent.bus访问到
				bus: new Vue(),
				//商品大=详情页选中的商品
				selectedfood: {}

			};
		},

		//实时计算当前所在区域
		//用来与左边的menu做映射
		computed: {
			currentIndex: function(){
				for (let i = 0; i < this.heightlist.length; i++){
					let height1 = this.heightlist[i];
					let height2 = this.heightlist[i + 1];
					//如果scrollY(当期位置)在i的开始和结束坐标位置之间,就说明当前在i区域
					if ( !height2 || (this.scrollY >= height1 && this.scrollY < height2) ){
						return i;
					}
				}
				return 0;
			},
			//找到所有被选择的foods
			selectFoods: function(){
				let foods = [];
				this.goods.forEach( (good) => {
					good.foods.forEach( (food) => {
						if(food.count > 0){
							foods.push(food);
						}
					} )
				} );
				return foods;
			}
		},

		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK){
					this.goods = response.data;
					//拿到数据之后，dom更新后执行
					this.$nextTick(() => {
						this._initScroll();
						this.calculateHeight();						
					})
				}
			})
		},

		methods: {
			//由左侧的Menu选择右侧的
			selectMenu: function(index, event){
				//如果这个事件不是用户派发的，而是原生的，就把它return掉
				//为了防止pc端执行两次事件
				if( !event._constructed ){
					return;
				}
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');	//获得每个li
				let el = foodList[index];	//找到对应的
				//better-scroll的接口。滚动到指定的元素上去,第二个参数为时间
				this.foodsSrcoll.scrollToElement(el, 300);
			},
			//初始化scroll
			_initScroll: function(){
				this.menuScroll = new BScroll(this.$refs.menuWrapper, {
					//因为better-scroll阻止默认行为,设置为可以点击
					//相当于有派发了一次点击事件
					//但pc端不会阻止默认行为，这样就相当于执行了两次
					click: true	
				});

				this.foodsSrcoll = new BScroll(this.$refs.foodsWrapper, {
					click: true,
					probeType: 3	//better-scroll的接口。意思是希望scroll在滚动时，能实时告诉我们滚动的位置
				});
				//监听scroll事件
				this.foodsSrcoll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));		//实时拿到scrollY
				})
			},
			calculateHeight: function(){
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');	//获得每个li
				let height = 0;
				this.heightlist.push(height);
				for (let i = 0; i < foodList.length; i++){
					let item = foodList[i];
					height += item.clientHeight; //累加每个li的高度
					this.heightlist.push(height);
				}
			},
			//点击某个商品出现商品详情页
			selectFood: function(food, event){
				if( !event._constructed ){
					return;
				}
				this.selectedfood = food;
				//调用子组件food的show方法
				this.$refs.food.show();
			}
		},

		components: {
			shopcart,
			cartcontrol,
			food
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/minin.styl"
	.goods
		//因为从设计图可以看出，商品部分超过视口部分隐藏，没有滚动条
		//所以需要固定商品部分视口的大小
		position: absolute
		display: flex
		top: 174px		//上面的header和nav一共174px
		bottom: 46px	//下面的购物车46px高
		width: 100%
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px			//左侧固定大小，右侧随着屏幕大小改变
			width: 80px
			background-color: #f3f5f7
			.menu-item
				display: table		//垂直居中最好的布局是table
				height: 54px
				width: 56px
				line-height: 14px 
				padding: 0 12px
				//current menu-item有一个向上的负margin,盖住了上面item的border
				&.current
					position: relative
					z-index: 10
					margin-top: -1px
					background-color: #fff;
					font-weight: 700
					.text
						border-none()
				.text
					display: table-cell
					width: 56px
					vertical-align: middle
					font-size: 12px
					color: rgb(77, 85, 97)
					border-1px(rgba(7, 17, 27, 0.1))
					.icon
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
						margin-right: 2px
						background-size: 12px
						background-repeat: no-repeat
						&.decrease
							bg-image("decrease_3")
						&.discount
							bg-image("discount_3")
						&.guarantee
							bg-image("guarantee_3")
						&.invoice
							bg-image("invoice_3")
						&.special
							bg-image("special_3")
		.foods-wrapper
			flex: 1			//占据剩余空间大小
			.title
				height: 26px
				padding-left: 12px
				line-height: 26px
				background-color: #f3f5f7
				font-size:12px
				color: rgb(147, 153, 159)
				border-left: 2px solid #d9dde1
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px		//上下margin重叠,必须在设置一个padding
				border-1px(rgba(7, 17, 27, 0.1))
				&:last-child
					border-none 			//最后一个没有下边框
					margin-bottom: 0
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex: 1
					.name
						margin: 2px 0 8px 0
						line-height: 14px
						font-size: 14px
						color: rgb(7, 17, 27)
					.desc, .extra
						font-size: 10px
						line-height: 10px
						color: rgb(147, 153, 159)
					.desc
						margin-bottom: 8px
						line-height: 12px
					.extra
						.count
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
						right: 0
						bottom: 12px
						
				
			
</style>