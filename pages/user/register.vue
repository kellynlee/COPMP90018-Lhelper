<!--
This is the Register Page
-->
<template>
	<view>
		<u-row>
			<h2 class="login-title">Sign Up</h2>
			<u-col class="login-content" :span="10" :offset="1" stop>
				<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
					<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="account"
						label-width="200" label="Email" prop="name">
						<u-input :border="true" placeholder="Please input email" v-model="model.name" type="text">
						</u-input>
					</u-form-item>
					<u-form-item left-icon="lock" label="Password" prop="password" label-width="200">
						<u-input :password-icon="true" :border="true" type="password" v-model="model.password"
							placeholder="Please input password"></u-input>
					</u-form-item>
					<u-form-item left-icon="lock" label="Repeat" label-width="200" prop="rePassword">
						<u-input :border="true" type="password" v-model="model.rePassword"
							placeholder="Confirm password"></u-input>
					</u-form-item>

				</u-form>
				<!-- 		<view class="agreement">
			<u-checkbox v-model="check" @change="checkboxChange"></u-checkbox>
			<view class="agreement-text">
				Accept our aggrement
			</view>
		</view> -->
				<u-button plain type="success" @click="signup" class="test-account">Sign up</u-button>

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
					password: ''
				},
				rePassword: '',
				rules: {
					name: [{
							required: true,
							message: 'Please input your email',
							trigger: 'blur',
						},
						{
							// ???????????????????????????????????????true??????false?????????????????????????????????????????????????????????
							validator: (rule, value, callback) => {
								// ??????uView?????????js????????????????????????https://www.uviewui.com/js/test.html
								return this.$u.test.email(value);
							},
							message: 'Please input correct email',
							// ????????????????????????blur???change????????????????????????????????????
							trigger: ['change', 'blur'],
						},
						// ????????????????????????????????????????????????????????????????????????????????????????????????
						{
							trigger: ['blur'],
							// ??????????????????????????????callback()????????????????????????new Error()
							// ????????????????????????????????????????????????????????????message?????????????????????
							asyncValidator: (rule, value, callback) => {
								axios.get(getUrl(USER_URL)).then((res) => {
									let obj = res.data
									let userList = getArray(obj)
									console.log(userList)
									for (let user of userList) {
										if (user.name === this.model.name) {
											console.log("Login Success")
											callback(new Error('User email repeat'));
										} else {
											callback()
										}

										// if(res.error) {
										// 				callback(new Error('????????????'));
										// 			} else {
										// 				// ?????????????????????????????????callback()??????
										// 				callback();
										// 			}
									}
									console.log(this.$store)
								})
							},
						}
					],
					password: [{
							required: true,
							message: 'Please input password',
							trigger: ['change', 'blur'],
						},
						{
							// ?????????????????????????????????
							pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/,
							message: 'must contain numbers and characters???6-12 ',
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
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			async signup() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						await axios.post(getUrl(USER_URL), {
							name: this.model.name,
							password: this.model.password
						}).then((res) => {
							let obj = res.data
							uni.reLaunch({
								url:'/page/user/login'
							})
							console.log(this.$store)
						})
						console.log('????????????');
					} else {
						console.log('????????????');
					}
				});
			},
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
