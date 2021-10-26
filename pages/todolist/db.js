const dburl = 'https://l-helper-default-rtdb.asia-southeast1.firebasedatabase.app/todolist/'

const LoadTodolist = function(username, fulldate, cb) {
	var getListUrl = dburl+username+'/'+fulldate+'.json'
	
	uni.request({
		url: getListUrl,
		method: "GET", header: { 'content-type': 'application/json' },
		success: cb
	});
}

const AddNewTodo = function(username, fulldate, todo, cb) {
	console.log('Add new todo: ', username, todo)
	var list = []
	LoadTodoListOnDay(username, fulldate, (res) => {
		list = res.data
		if(list == null) {
			list = []
		}
		list.push(todo)
		uni.request({
			url: dburl+username+'/'+fulldate+'.json',
			data: list,
			method: "PUT", header: { 'content-type': 'application/json' },
			success: cb
		});
	})
}

const UpdateTodo = function(username, fulldate, todo, index, cb) {
	console.log('update todo: ', username, index, todo)
	var list = []
	LoadTodolist(username, fulldate, (res) => {
		list = res.data
		if(list == null) {
			list = []
		}
		if(list.length > index) {
			list[index] = todo
			uni.request({
				url: dburl+username+'/'+fulldate+'.json',
				data: list,
				method: "PUT", header: { 'content-type': 'application/json' },
				success: cb
			});
		}
	})
}

const DeleteTodo = function(username, fulldate, index, cb) {
	var list = []
	LoadTodolist(username, fulldate, (res) => {
		list = res.data
		if(list == null) {
			list = []
		}
		if(list.length > index) {
			list.splice(index, 1)
			console.log(list)
			uni.request({
				url: dburl+username+'/'+fulldate+'.json',
				data: list,
				method: "PUT", header: { 'content-type': 'application/json' },
				success: cb
			});
		}
	})
}

export {
	LoadTodolist, AddNewTodo, UpdateTodo, DeleteTodo
}
