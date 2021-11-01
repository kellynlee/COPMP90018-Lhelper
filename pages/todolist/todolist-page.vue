<template>
	<view>
		<uni-calendar 
			:insert="true"
			:lunar="false" 
			:start-date="'2001-1-1'"
			:end-date="'2030-12-31'"
			:reddayList='reddays'
			@change="CalendarSelectCallback"
	     />
		<view>
			<u-swipe-action :show="item.show" :index="index"  v-for="(item, index) in list" :key="item.id" 
				@click="delTodoButton" @open="open" :options="options" class="todo-list">
					<view class="list-item" :class="item.done?'list-item-done':''" >
						<u-checkbox @change="doneButton" v-model="item.done" :name="item.id"></u-checkbox>
						<text class="list-item-text">{{ item.title }}</text>
					</view>
			</u-swipe-action>
		</view>
		<view>
			<u-popup v-model="showEditField" mode="bottom">
				<u-input v-model="todoText" type='textarea' :border="true" placeholder="Please input thing to create a Todo item" />
				<u-button @click="addTodoButton">COMMIT</u-button>
			</u-popup>
		</view>
		<view class="add">
			<view class="content">
				<button @click="inputButton"class="btn uni-button" >
					<u-icon name="plus"></u-icon>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { LoadTodolist, AddNewTodo, UpdateTodo, DeleteTodo, DoneTodo, LoadAllTodolist } from "./db.js"
	var dburl = 'https://l-helper-default-rtdb.asia-southeast1.firebasedatabase.app/todolist/'
	var username = 'LaLa' // TODO
	
	export default {
		data() {
			return {
				today: null,
				todoText: '',
				list: [],
				options: [{ text: 'Delete', style: { backgroundColor: '#f06292' }},
						  { text: 'Edit', style: { backgroundColor: '#90caf9' }}],
				showEditField: false,
				addOrEdit: false,
				curEditIndex: 0,
				reddays: {}
			}
		},
		created() {
			this.updateRedDot()
		},
		methods: {
			CalendarSelectCallback(e) {
				this.today = e.fulldate
				this.updateList()

			},
			updateList() {
				LoadTodolist(username, this.today, (res) => {
					if(res.data == null){ this.list = []; return }
					// check if update the ui data
					var ifupdate = true
					if(this.list.length == res.data.length) {
						var allSame = true
						for (var i = 0; i < res.data.length; i++) {
							var todoItem = res.data[i]
							if(todoItem.text != this.list[i].title) {
								allSame = false
								break
							}
						}
						if(allSame) {
							ifupdate = false
						}
					}
					if(ifupdate) {
						this.list = []
						// update list
						for (var i = 0; i < res.data.length; i++) {
							var todoItem = res.data[i]
							this.list.push( {
								id: i,
								title: todoItem.text,
								show: false,
								done: todoItem.done
							})
						}
					}
				})
			},
			addTodoButton() {
				if(this.todoText.length == 0) return
				if(this.addOrEdit == false) {
					// UI mock add
					this.list.push({
						id: this.list.length,
						title: this.todoText,
						show: false,
						done: false
					})
					var text = this.todoText
					var today = this.today
					this.todoText = ''
					this.showEditField = false
					AddNewTodo(username, today, {text:text, done:false}, (res) => {
						this.updateList()
						
						this.reddays = Object.assign({}, this.reddays, {[today]: true})
					})
				} else {
					// UI mock edit
					this.list[this.curEditIndex].title = this.todoText
					this.list[this.curEditIndex].show = false
					var text = this.todoText
					this.todoText = ''
					this.showEditField = false
					UpdateTodo(username, this.today, text, this.curEditIndex, (res) => {
						this.updateList()
					})
				}
			},
			inputButton() {
				this.addOrEdit = false
				this.showEditField = true
			},
			delTodoButton(index, index1) {
				if(index >= this.list.length) return
				if(index1 == 0) {
					// UI mock del
					this.list.splice(index, 1);
					
					DeleteTodo(username, this.today, index, (res) => {
						this.updateList()
						this.updateRedDot()
					})
				} else if(index1 == 1) {
					// edit
					this.addOrEdit = true
					this.curEditIndex = index
					this.todoText = this.list[index].title
					this.showEditField = true
				}
			},
			doneButton(e) {
				if(e.name >= this.list.length) return
				DoneTodo(username, this.today, e.name, e.value, (res) => {
					this.updateList()
					this.updateRedDot()
				})
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if(index != idx) this.list[idx].show = false;
				})
			},
			updateRedDot() {
				LoadAllTodolist(username, (res) => {
					if(res == null || res.data == null) { return }
					for(var day in res.data) {
						var list = res.data[day]
						var ifShowRed = false
						for (var i = 0; i <list.length; i++) {
							var todoItem = list[i]
							if (todoItem.done == false) {
								ifShowRed = true
							}
						}
						if(ifShowRed) {
							if(this.reddays[day] == null || this.reddays[day] == false) {
								this.reddays = Object.assign({}, this.reddays, {[day]: true})
							}
						} else {
							if(this.reddays[day] != null && this.reddays[day] == true) {
								this.reddays = Object.assign({}, this.reddays, {[day]: false})
							}
						}
					}
					for(var day in this.reddays) {
						if(res.data[day] == null) {
							this.reddays = Object.assign({}, this.reddays, {[day]: false})
						}
					}
				})
			},
		}
	}
</script>

<style  lang="scss" scoped>
	
	.title {
		text-align: left;
		font-size: 28rpx;
		color: $u-content-color;
		margin-top: 20rpx;
	}
	.add{
		position: fixed;
		bottom: 3.5rem;
		width: 100vw;
		display: flex;
		justify-content: flex-end;
		padding-right: 1rem;
		.content{
			.btn {
				background-color: #c7e5c8;
				color: white;
				font-size: 1rem;
				border-radius: 2rem;
			}
			.uni-button:after {
				border: none;
			}
		}
	}
	.todo-list {
		margin: 0.6rem;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
		border-radius: 0.5rem;
		:first-child {
			border-radius: 0.5rem;
		}
		
		.list-item {
			display: flex;
			padding: 20rpx;
			flex-direction: row;
			height: 2.5rem;
			align-items: center;
		}
		
		.list-item-done {
			opacity: .7;
			background-color: #fafffb;
		}
	}
</style>
