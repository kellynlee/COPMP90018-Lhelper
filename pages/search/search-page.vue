<template>
  <view class="main-body">
    <!-- <button type="default" @click="test">image</button> -->
    <view class="u-demo-wrap search-page-body">
        <view
          class="search-page-header animation"
          v-show="!onFocus"
          :animation="animationData"
        >
				<view class="logo">
					<image
					  mode="aspectFit"
					  height="100px"
						width="100px"
					  src="../../static/icons/logo.svg"
					/>
				</view>
          
          <view class="title"
            >Welcome to L-Helper, you can search a word by taking photo,
            speaking and typing!
          </view>
					<u-row class="search">
						<u-col span="6">
							<button class="btn uni-button" @click="searchImage"><u-icon name="camera"></u-icon></button>
						</u-col>
						<u-col span="6">
							<button class="btn uni-button" @click="searchVoice"><u-icon name="mic"></u-icon></button>
						</u-col>
					</u-row>
          <!-- <u-button @click="login">Login</u-button> -->
        </view>
        <view class="u-demo-area">
          <u-row>
            <u-col :span="10" :offset="1" stop>
              <u-search
                v-model="value"
                @focus="getFocus"
                @blur="loseFocus"
                @change="change"
                :action-style="activeBtnStyle"
                @custom="custom"
                @search="search"
                :shape="'square'"
                :clearabled="true"
                :show-action="true"
                action-text="Search"
                placeholder="please input the words"
                @clear="clear"
              ></u-search>
            </u-col>
          </u-row>
        </view>
      <u-row
        v-if="onFocus"
        class="word-selection"
        style="align-items: flex-start"
      >
        <u-col :span="10" :offset="1" stop>
          <u-swipe-action
            @open="open(item)"
            :index="index"
            v-for="(item, index) in list1"
            :key="item.id"
            :show="item.show"
            :btn-width="151"
            @close="close"
            :options="options"
            :disabled="item.show"
          >
            <view class="item u-border-bottom" @click="goDictionary(item)">
              <!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
              <view class="title-wrap word-item">
                <text class="title u-line-2">{{ item.title }}</text>
                <text class="word-decs">{{ item.desc }}</text>
              </view>
              <u-icon
                @click="cancelCollected(item)"
                :name="!item.collected ? 'star' : 'star-fill'"
                size="40"
                :color="!item.collected ? '#909399' : '#90caf9'"
              ></u-icon>
              <!-- <u-icon v-if="item.collected" @click="cancelCollected(item)" name="star-fill" size="40" color="#FF9900"></u-icon> -->
              <!-- <image style="justify-items: flex-end;" mode="aspectFill" :src="item.images" /> -->
            </view>
          </u-swipe-action>
        </u-col>
      </u-row>
    </view>
  </view>
</template>

<script type="text/javascript">
import dictionary from "./dictionary.json";
export default {
  onUnload() {
    this.animationData = {};
    // 页面关闭后清空数据
  },
  onload() {
    this.animation = uni.createAnimation();
    console.log("test");
    // 创建动画实例
  },
  onShow() {
    // 初始化一个动画
    var animation = uni.createAnimation({
      duration: 300,
      timingFunction: "ease-out",
    });
    console.log("test1");
    console.log(this.$store.state.vuex_user);
    if (!this.$store.state.vuex_user.id) {
      this.$u.route("/pages/user/login");
    }
    this.animation = animation;
  },
  methods: {
    login() {
      this.$u.route("/pages/user/login");
    },
    cancelCollected: function (item) {
      event.stopPropagation();
      item.collected = false;
    },
    getFocus: function () {
      // this.onFocus = true;
      this.animation.height(0).step();
      // 导出动画数据传递给data层
      this.animationData = this.animation.export();
      setTimeout(() => {
        this.onFocus = true;
      }, 300);
      // this.onFocus = true;
    },
    clear() {
      this.animation.height(200).step();
      // 导出动画数据传递给data层
      this.animationData = this.animation.export();
      this.onFocus = false;
    },
    loseFocus: function () {
      // this.animation.height(200).step()
      // // 导出动画数据传递给data层
      // this.animationData = this.animation.export()
      // this.onFocus = false;
    },
    close: function () {},
    open: function (item) {
      item.collected = true;
      item.show = false;
    },
    change: function () {
      let result = [];
      for (let word in dictionary) {
        if (word.indexOf(this.value) === 0)
          result.push({
            title: word,
            desc:
              dictionary[word].substring(0, 20) +
              (dictionary[word].length > 20 ? "..." : ""),
            show: false,
            collected: false,
          });
        if (result.length == 40) {
          break;
        }
      }
      this.list1 = result;
      console.log(result);
      // console.log(this)
    },
    test() {
      this.$u.route({
        url: "/pages/search/image/image",
      });
    },
		searchImage() {
			this.$u.route({
			  url: "/pages/search/image/image",
			});
		},
		searchVoice() {
			this.$u.route({
			  url: "/pages/search/voice/voice",
			});
		},
		goDictionary(item) {
			uni.navigateTo({
			    url: '/pages/search/search-translate?word='+item.title
			});
		}
  },
  data: () => {
    return {
      onFocus: false,
      value: "",
      list1: [
        // 	{
        // 		id: 1,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
        // 	{
        // 		id: 2,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
        // 	{
        // 		id: 3,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
        // 	{
        // 		id: 4,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
        // 	{
        // 		id: 5,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
        // 	{
        // 		id: 6,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
        // 	{
        // 		id: 7,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
        // 	{
        // 		id: 8,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
        // 	{
        // 		id: 9,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
        // 	{
        // 		id: 10,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
        // 	{
        // 		id: 11,
        // 		title: 'Words',
        // 		images: 'https://cdn.uviewui.com/uview/common/logo.png',
        // 		desc: 'test',
        // 		show: false,
        // 		collected: false
        // 	},
      ],
			activeBtnStyle:{ 
				width: '3.25rem', 
				color: '#ffffff',
				background:'#90caf9',
				height:'30px',
				lineHeight:'30px',
				borderRadius:'0.5rem',
				boxShadow:'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
				},
      animationData: {},
      options: [
        {
          text: "Glosssary",
          style: {
            backgroundColor: "#90caf9",
          },
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.search-page-header {
  height: 200px;
	margin: 1rem;
	background-color: white;
	.logo{
		display: flex;
		justify-content: center;
	}
	.title{
		text-align: left;
		display: block;
		margin: 1rem;
	}
	.search {
		.btn{
			background-color: #c8e6c9;
			font-size: 1rem;
			color: white;
			box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
			  rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
			border-radius: 0.8rem;
		}
		.uni-button:after {
        border: none;
      }
	}
}

.main-body {
  height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 1rem;
}
.u-demo-area {
	margin-top: 0.625rem;
}
uni-page-body {
  height: 100%;
}

.u-action-active {
  width: 50px;
}

.u-action {
  width: 50px;
}

.item {
  justify-content: space-between;
  display: flex;
  padding: 20rpx;
}

.word-item {
  margin-left: 10px;
}

.word-selection {
  margin-top: 20px;
  height: 100%;
  align-items: start;
  overflow: auto;
}

.word-decs {
  overflow: hidden;
  color: #606266;
  margin-left: 9px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.search-page-body {
  display: flex;
  flex-direction: column;
  height: 100%;
	width: 100%;
	background-color: white;
	border-radius: 1rem;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
	  rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
}

image {
  width: 120rpx;
  flex: 0 0 120rpx;
  height: 120rpx;
  margin-right: 20rpx;
  border-radius: 12rpx;
}
</style>
