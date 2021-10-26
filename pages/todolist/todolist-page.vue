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
	var dburl = 'https://l-helper-default-rtdb.asia-southeast1.firebasedatabase.app/todolist/'
	export default {
		data() {
			return {
				today: "1",
				showkeyboard: false,
			}
		},
		methods: {
			CalendarSelectCallback(e) {
				this.today = e.fulldate
				console.log('calender click on fulldate', e.fulldate)
				
				//this.LoadTodoListOnDay(this.today)
				
				this.AddNewUserData('user2')
			},
			LoadTodoListOnDay(fulldate) {
				var username = 'user1'
				var getListUrl = dburl+username+'/'+this.today+'.json'
				uni.request({
				    url: getListUrl,
				    data: {
				        requests: [
							{
								features:[{type:"TEXT_DETECTION"}]
							}
						]
				    },
					method: "GET", header: { 'content-type': 'application/json' },
				    success: (res) => {
						if(res.data == null) {
							this.TryAddNewUserData(username)
						}
				        console.log(res)
				    }
				});
			},
			TryAddNewUserData(username) {
				uni.request({
				    url: dburl+username+'.json',
				    method: "GET", header: { 'content-type': 'application/json' },
				    success: (res) => {
				        if(res.data == null) {
							
						}
				    }
				});
			},
			AddNewUserData(username) {
				console.log('Add new user data: ', username)
				var today = this.today
				uni.request({
				    url: dburl+username+'.json',
				    data: {
				        today:"b"
				    },
					method: "PUT", header: { 'content-type': 'application/json' },
				    success: (res) => {
						if(res.data == null) {
							this.TryAddNewUserData(username)
						}
				        console.log(res)
				    }
				});
			}
		}
	}
</script>
<style>
</style>
