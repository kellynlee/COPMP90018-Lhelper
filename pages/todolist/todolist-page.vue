<template>
	<view>
	    <uni-calendar 
			:insert="true"
			:lunar="false" 
			:start-date="'2001-1-1'"
			:end-date="'2030-12-31'"
			@change="CalendarSelectCallback"
	     />
		
		<u-keyboard ref="uKeyboard" mode="car" v-model="showkeyboard"></u-keyboard>
		<u-button @click="addtodo = true">ADD</u-button>
	</view>
</template>

<script>
	import {
		LoadTodolist,
		AddNewTodo,
		UpdateTodo,
		DeleteTodo
	} from "./db.js"
	var dburl = 'https://l-helper-default-rtdb.asia-southeast1.firebasedatabase.app/todolist/'
	
	export default {
		data() {
			return {
				today: null,
				showkeyboard: false,
			}
		},
		methods: {
			CalendarSelectCallback(e) {
				this.today = e.fulldate
				console.log('calender click on fulldate', e.fulldate)
				
				LoadTodolist('user1', this.today, (res) => {
					console.log(res.data)
				})
				/*
				AddNewTodo('user1', this.today, "haha", (res) => {
					console.log(res.data)
				})
				*/
				/*
				UpdateTodo('user1', this.today, 'lala', 2, (res) => {
				})
				*/
				/*
				DeleteTodo('user1', this.today, 2, (res) => {
				})
				*/
			}
		}
	}
</script>
<style>
</style>
