<template>
	<view>
	    <uni-calendar 
			:insert="true"
			:lunar="false" 
			:start-date="'2001-1-1'"
			:end-date="'2030-12-31'"
			@change="CalendarSelectCallback"
	     />
		<view>
			<u-input v-model="todoText" type='text' :border=true />
			<u-button @click="addTodo">ADD</u-button>
		</view>
	</view>
</template>

<script>
	import {
		LoadTodolist,
		AddNewTodo,
		UpdateTodo,
		DeleteTodo,
		DoneTodo
	} from "./db.js"
	var dburl = 'https://l-helper-default-rtdb.asia-southeast1.firebasedatabase.app/todolist/'
	var username = 'LaLa'
	export default {
		data() {
			return {
				today: null,
				todoText: ''
			}
		},
		methods: {
			CalendarSelectCallback(e) {
				this.today = e.fulldate
				console.log('calender click on fulldate', e.fulldate)
				
				LoadTodolist(username, this.today, (res) => {
					console.log(res.data)
					// update list
					
				})
				
				//DoneTodo('user1', this.today, 1, (res) => { console.log(res.data) })
				//AddNewTodo('user1', this.today, {text:"haha", done:false}, (res) => { console.log(res.data) })
				
				/*
				UpdateTodo('user1', this.today, 'lala', 2, (res) => {
				})
				*/
				/*
				DeleteTodo('user1', this.today, 2, (res) => {
				})
				*/
			},
			addTodo() {
				if(this.todoText.length == 0) return
				AddNewTodo(username, this.today, {text:this.todoText, done:false}, (res) => {
					console.log(res.data)
				})
			}
		}
	}
</script>
<style>
</style>
