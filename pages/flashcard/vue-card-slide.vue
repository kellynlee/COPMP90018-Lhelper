`<template>
	<div class="wrap">
	</div>
</template>

<script>

</script>
<style scoped lang="scss">
	.wrap {
		// font-size:0.8rem;
		// overflow: hidden; 
		// height:100%;
		width: 16.75rem;

		.bg {
			margin: 0 auto;

			// height:100%;
			// overflow: hidden; 
			// padding-top:0.2rem;
			// padding-left:1rem;
			// padding-right:1rem;
			// color:#fff;
			// height:100%;
			// background:#f1f1f1; 
			// background-size: cover;
			.content {
				margin: 0 auto;
				position: relative;
				height: 14.5rem;
				// margin-top:3.2rem;
				// margin-bottom:1.4rem;
			}

			.contentItem {
				-webkit-transform: translateZ(0);
				-moz-transform: translateZ(0);
				-ms-transform: translateZ(0);
				-o-transform: translateZ(0);
				transform: translateZ(0);
				-webkit-backface-visibility: hidden;
				-moz-backface-visibility: hidden;
				-ms-backface-visibility: hidden;
				backface-visibility: hidden;
				-webkit-perspective: 1000;
				-moz-perspective: 1000;
				-ms-perspective: 1000;
				perspective: 1000;
				-webkit-transform: translate3d(0, 0, 0);
				-moz-transform: translate3d(0, 0, 0);
				-ms-transform: translate3d(0, 0, 0);
				transform: translate3d(0, 0, 0);
				box-shadow: 0px 1px 5px gray;
				position: absolute;
				z-index: 15;
				box-sizing: border-box;
				width: 16.75rem;
				height: 14.5rem;
				background: #fff;
				border-radius: 0.25rem;
				// padding:0.5rem;
				transform-origin: 50% 100%;
				overflow: hidden;

				.item {
					margin: 0.5rem;
					box-sizing: border-box;
					width: 15.75rem;
					height: 13.5rem;
					background-size: cover;
				}
			}

			.middle2 {
				z-index: 10;
				top: 0.18rem;
				transform: scale(.98);
			}

			.bottom3 {
				z-index: 5;
				top: 0.38rem;
				transform: scale(.96);
			}

			.contentItem2 {
				box-shadow: 0px 1px 3px gray;
				transform: scale(0.98);
				position: absolute;
				top: -0.45rem;
				z-index: 5;
				transform-origin: 50% 100%;
				box-sizing: border-box;
				margin-top: 0.65rem;
				margin-bottom: 1.4rem;
				width: 16.75rem;
				background: #fff;
				height: 14.5rem;
				border-radius: 0.25rem;
				padding: 0.5rem;

				.item2 {
					position: absolute;
					width: 15.75rem;
					height: 13.5rem;
					background-size: cover;
				}
			}

			.contentItem3 {
				transform: scale(0.96);
				position: absolute;
				top: -0.25rem;
				z-index: 0;
				transform-origin: 50% 100%;
				box-sizing: border-box;
				margin-top: 0.65rem;
				margin-bottom: 1.4rem;
				width: 16.75rem;
				background: #fff;
				height: 14.5rem;
				border-radius: 0.25rem;
				padding: 0.5rem;

				.item3 {
					position: absolute;
					width: 15.75rem;
					height: 13.5rem;
					background-size: cover;
				}
			}

			.judge {
				margin-top: 3rem;
				margin-bottom: 2rem;
				// margin-bottom:2.75rem;
				display: flex;
				justify-content: center;

				.circle {
					display: inline-block;
					index: 1;
					background: #fff;
					height: 3rem;
					width: 3rem;
					border-radius: 100%;

					span {
						color: #1d3949;
						font-size: 1rem;
						line-height: 3rem;
					}
				}

				.cirMargin {
					margin-right: 2.9rem;
				}
			}
		}
	}

	@keyframes swipe {
		0% {
			transform: translateX(10px) rotate(0);

		}

		100% {
			transform: translateX(-18.75rem) rotate(-90deg);
		}
	}

	/* 可以设置不同的进入和离开动画 */
	/* 设置持续时间和动画函数 */
	.slide-fade-enter-active {}

	.slide-fade-leave-active {
		transition: all 2.2s ease-out;
	}

	.slide-fade-enter,
	.slide-fade-leave-to {
		transform: translateX(-18.75rem) rotate(-90deg);
		opacity: 0;
	}

	// .slide-fade1-leave-active {
	//   animation-name: fold-out1;
	//   animation-duration: 1.5s;
	//   animation-timing-function: ease-out;

	// }
	.slide-fade1-leave-active {
		animation-name: fold-out1;
		animation-duration: 0.7s;
		animation-timing-function: cubic-bezier(.55, .55, .55, .55);

	}

	.slide-fade2-leave-active {
		animation-name: fold-out;
		animation-duration: 0.7s;
		animation-timing-function: cubic-bezier(.55, .55, .55, .55);

	}

	@keyframes fold-out {
		0% {
			transform: translateX(0rem)
		}

		100% {
			transform: translateX(-18.75rem);
		}
	}

	// @keyframes fold-out {
	//   0% {
	//     transform: translateX(0rem)
	//   }
	//   100% {
	//     transform: translateX(-18.75rem) rotate(-90deg);
	//   }
	// }
	@keyframes fold-out1 {
		0% {
			transform: translateX(0rem)
		}

		100% {
			transform: translateX(18.75rem);
		}
	}

	// @keyframes fold-out1 {
	//   0% {
	//     transform: translateX(0rem)
	//   }
	//   100% {
	//     transform: translateX(18.75rem) rotate(90deg);
	//   }
	// }



	.show2 {
		width: 100px;
		height: 100px;
		position: absolute;
		z-index: 10;
		background: red;
		transform-origin: 0% 50%;
	}

	.show3 {
		width: 100px;
		height: 100px;
		position: absolute;
		z-index: 5;
		background: red;
		transform-origin: 0% 50%;
	}

	.card-body {
		height: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-content: center;
		align-items: center;
		flex-wrap: nowrap;
	}

	.word-desc {
		margin-top: 100px;
	}
</style>
