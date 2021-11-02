<template>
	<view class="todo-list-page">
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
						<button v-show="item.isCard" @click="goFlashCardButton">GO</button>
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
			<button @click="inputButton" class="btn uni-button" >
				<u-icon name="plus"></u-icon>
			</button>
		</view>
	</view>
</template>

<script>
	import { LoadTodolist, AddNewTodo, UpdateTodo, DeleteTodo, DoneTodo, LoadAllTodolist } from "./db.js"
	var dburl = 'https://l-helper-default-rtdb.asia-southeast1.firebasedatabase.app/todolist/'
	
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
				reddays: {},
				user:""
			}
		},
		created() {
			// unique user id
			this.user = this.$store.state.vuex_user.id;
			// update the red dot recommendation on calender
			this.updateRedDot()
		},
		
		methods: {
			// call back when user select one day on calender
			CalendarSelectCallback(e) {
				this.today = e.fulldate
				this.updateList()

			},
			// update the list data on ui
			updateList() {
				LoadTodolist(this.user, this.today, (res) => {
					if(res.data == null){ this.list = []; return }
					var rankdata = []
					// rank the list
					for (var i = 0; i < res.data.length; i++) {
						if (res.data[i].type == "flashcard") {
							rankdata.push(res.data[i])
						}
					}
					for (var i = 0; i < res.data.length; i++) {
						if (res.data[i].type != "flashcard") {
							rankdata.push(res.data[i])
						}
					}
					// check if update the ui data
					var ifupdate = true
					if(this.list.length == rankdata.length) {
						var allSame = true
						for (var i = 0; i < rankdata.length; i++) {
							var todoItem = rankdata[i]
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
						for (var i = 0; i < rankdata.length; i++) {
							var todoItem = rankdata[i]
							this.list.push( {
								id: i,
								title: todoItem.text,
								show: false,
								done: todoItem.done,
								isCard: todoItem.type == "flashcard"
							})
						}
					}
				})
			},
			//
			goFlashCardButton() {
				// TODO
				this.today
			},
			// add a new todo button call back
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
					AddNewTodo(this.user, today, {text:text, done:false}, (res) => {
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
					UpdateTodo(this.user, this.today, text, this.curEditIndex, (res) => {
						this.updateList()
					})
				}
			},
			// edit the todo content
			inputButton() {
				this.addOrEdit = false
				this.showEditField = true
			},
			// delete the selected todo
			delTodoButton(index, index1) {
				if(index >= this.list.length) return
				if(index1 == 0) {
					// UI mock del
					this.list.splice(index, 1);
					
					DeleteTodo(this.user, this.today, index, (res) => {
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
			// mark the todo to done
			doneButton(e) {
				if(e.name >= this.list.length) return
				DoneTodo(this.user, this.today, e.name, e.value, (res) => {
					this.updateList()
					this.updateRedDot()
				})
			},
			// close the other list item when swap a new one 
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if(index != idx) this.list[idx].show = false;
				})
			},
			// check if the day has todos undone.
			updateRedDot() {
				LoadAllTodolist(this.user, (res) => {
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
	.todo-list-page {
		margin-bottom: 4.5rem;
	}
	.title {
		text-align: left;
		font-size: 28rpx;
		color: $u-content-color;
		margin-top: 20rpx;
	}
	.add{
		position: fixed;
		bottom: 3.5rem;
		padding-right: 1rem;
		right: 0;
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
