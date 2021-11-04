<template>
	<view>
		<u-row>
			<h2 class="login-title">Please Login</h2>
			<u-col class="login-content" :span="10" :offset="1" stop>
				<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
					<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="account"
						label-width="200" label="Email" prop="name">
						<u-input placeholder="Please input email" v-model="model.name" type="text"></u-input>
					</u-form-item>
					<u-form-item left-icon="lock" label="Password" prop="password" label-width="200">
						<u-input :password-icon="true" type="password" v-model="model.password"
							placeholder="Please input password"></u-input>
					</u-form-item>

				</u-form>
				<!-- 		<view class="agreement">
			<u-checkbox v-model="check" @change="checkboxChange"></u-checkbox>
			<view class="agreement-text">
				Accept our aggrement
			</view>
		</view> -->
				<view class="login-button-group">
					<u-button plain type="success" @click="login" class="button-style">Login</u-button>
					<u-button plain type="warning" @click="register" class="button-style">Register</u-button>
				</view>
				<u-button plain type="info" @click="testAccount" class="test-account">Use Test Account</u-button>

				<!-- 	<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		<u-select mode="single-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>
		<u-picker mode="region" v-model="pickerShow" @confirm="regionConfirm"></u-picker>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code> -->
			</u-col>
		</u-row>
	</view>

</template>

<script>
	import {
		USER_URL
	} from "../../utils/paths.js";
	import {
		getUrl,
		getArray
	} from "../../utils/methods.js"
	const axios = require("axios");
	export default {
		data() {
			return {
				errorType: ['message'],
				model: {
					name: '',
					password: '',
					id:''
				},
				show: false,
				userList: [],
				rules: {
					name: [{
							required: true,
							message: 'Please input your email',
							trigger: 'blur',
						},
						{
							// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.email(value);
							},
							message: 'Please input correct email',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						},
					],
					password: [{
							required: true,
							message: 'Please input password',
							trigger: ['change', 'blur'],
						},
						{
							// 正则不能含有两边的引号
							pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/,
							message: 'must contain numbers and characters，6-12 ',
							trigger: ['change', 'blur'],
						}
					],
					rePassword: [{
							required: true,
							message: 'Please input password again',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return value === this.model.password;
							},
							message: 'Not same with password',
							trigger: ['change', 'blur'],
						}
					],
				},
				content: `
					1. 修复badge组件的size参数无效问题<br>
					2. 新增Modal模态框组件<br>
					3. 新增压窗屏组件，可以在APP上以弹窗的形式遮盖导航栏和底部tabbar<br>
					4. 修复键盘组件在微信小程序上遮罩无效的问题
				`,
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			testAccount() {
				this.model.name = "test@email.com"
				this.model.password = 'test123'
			},
			async login() {
				this.$refs.uForm.validate()
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						await axios.get(getUrl(USER_URL)).then((res) => {
							let obj = res.data
							this.userList = getArray(obj)
							
							console.log(this.$store)
						})
						for (let user of this.userList) {
							if (user.name === this.model.name && user.password === this.model.password) {
								console.log("Login Success")
								this.$u.vuex('vuex_user', user)
								uni.reLaunch({
									url:'/'
								})
							}
						}
						console.log('验证通过');
					} else {
						console.log('验证失败');
					}
				});
			},
			register() {
				this.$u.route("/pages/user/register");
			},
			cancel() {
				this.closeModal();
			},
			confirm() {
				this.closeModal();
			},
			closeModal() {
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../uview-ui/libs/css/style.components.scss";

	.u-full-content {
		background-color: #00C777;
	}

	.u-update-content {
		font-size: 26rpx;
		color: $u-content-color;
		line-height: 1.7;
		padding: 30rpx;
	}

	.login-button-group {
		display: flex;
		margin-top: 30px;
		flex-direction: row-reverse;
		justify-content: center;
	}

	.login-title {
		width: 100%;
		text-align: center;
	}

	.login-content {
		margin-top: 20vh;
	}

	.button-style {
		width: 200rpx;
	}

	.test-account {
		margin-top: 30px;
		width: 400rpx;
	}
</style>
