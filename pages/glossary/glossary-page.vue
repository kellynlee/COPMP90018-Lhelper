<template>
  <view class="glossary-page">
    <view class="list u-skeleton">
      <view v-if="glossaryList != null && glossaryList.length > 0">
        <transition-group name="delete">
          <view
            class="item-card"
            v-for="(item, index) in glossaryList"
            :key="item.id"
          >
            <view
              class="item-content"
              :id="index"
              @touchstart="drawStart"
              @touchmove="drawMove"
              @touchend="drawEnd"
              :style="'right:' + item.right + 'px'"
            >
              <div class="row">
                <p class="item-title" :style="item.star ? 'color:#f06292' : ''">
                  {{ item.word }}
                </p>
              </div>
              <p>{{ "ADD TIME:" + item.added_time }}</p>
              <p>{{ "HITS:" }}</p>
              <view class="btn-area">
                <button
                  class="button uni-button"
                  @click="onClickStar(item, index)"
                >
                  {{ item.star ? "Unstar" : "Star" }}
                </button>
                <button class="button uni-button" @click="onReview(item)">
                  Review
                </button>
              </view>
            </view>
            <view class="delete-item">
              <button
                class="delete-btn uni-button"
                @click="onDelete(item, index)"
              >
                Delete
                <!-- <u-icon name="close"></u-icon> -->
              </button>
            </view>
          </view>
        </transition-group>
      </view>
      <view class="no-data" v-if="glossaryList == null">
        <u-image
          mode="aspectFit"
          height="200px"
          src="../../static/icons/no-data.svg"
          bg-color="#ffffff"
        ></u-image>
        <text class="text"
          >No word in this glossary, search for something to start!</text
        >
      </view>
    </view>
    <u-skeleton
      :loading="!isLoad"
      :animation="true"
      bgColor="#FFF"
    ></u-skeleton>
  </view>
</template>

<script>
import { GLOSSARY_URL } from "../../utils/paths.js";
import { request } from "../../utils/methods.js";
import { getGlossary, deleteGlossary } from "./glossary-service.js";
import uniIcon from "../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
export default {
  mounted() {
    this.userId = this.$store.state.vuex_user.id;
    // this.userId = "aaa"
    this.isLoad = false;
    getGlossary(this.userId).then((res) => {
      if (res) {
        this.glossaryList = Object.assign([], res);
      } else {
        this.glossaryList = null;
      }
      this.isLoad = true;
    });
  },
  onTabItemTap() {
    console.log("click");
    getGlossary(this.userId).then((res) => {
      if (res) {
        // console.log(res)
        this.glossaryList = Object.assign([], res);
        this.$forceUpdate();
      } else {
        this.glossaryList = null;
      }
      this.isLoad = true;
    });
  },
  components: { uniIcon },
  data() {
    return {
      userId: "",
      glossaryList: [],
      styles: {
        navBackground: {
          backgroundColor: "#c7e5c8",
        },
      },
      isLongPressed: false,
      selectedIndex: [],
      delBtnWidth: 90,
      startX: "",
      isLoad: true,
    };
  },
  methods: {
    getHits(item) {
      return item.hit + "/" + (item.hit + item.forget);
    },
    onClickStar(item, index) {
      let changeFiled = Object.assign({},item);
      let audio = "../../static/sounds/notification_simple-02.wav";
      let patchUrl = GLOSSARY_URL + "/" + this.userId + "/" + item.id;
      if (item.star) {
        changeFiled.star = false;
      } else {
        changeFiled.star = true;
      }
      let option = {
        url: patchUrl,
        data: changeFiled,
        method: "PUT",
      };
      request(option).then((res) => {
        if (res.statusCode == 200) {
          this.$set(this.glossaryList[index], "star", res.data.star);
          this.$forceUpdate();
          this.audio(audio);
        }
      });
    },
    audio(src) {
      const iac = uni.createInnerAudioContext();
      iac.src = src;
      iac.play(() => {
        console.log("play~");
      });
    },
    onReview(item) {
      uni.navigateTo({
        url: "/pages/search/search-translate?isReview=true&word=" + item.word,
      });
    },

    itemSelectedClass(index) {
      // if(this.isLongPressed) {
      if (this.selectedIndex.find((elem) => elem === index) !== undefined) {
        return "item-selected";
      }
      // }
    },
    onDelete(item, index) {
      let deleteIndex = GLOSSARY_URL + "/" + this.userId + "/" + item.id;
      let audio = "../../static/sounds/navigation_transition-left.wav";
      deleteGlossary(this.userId, item.id).then((res) => {
        if (res) {
          this.glossaryList.splice(index, 1);
          this.audio(audio);
        }
      });
    },

    drawStart(e) {
      console.log("开始触发");
      let touch = e.touches[0];
      this.startX = touch.clientX;
    },

    drawMove(e) {
      console.log("滑动");
      for (let index in this.glossaryList) {
        this.$set(this.glossaryList[index], "right", 0);
      }
      let touch = e.touches[0];
      let item = this.glossaryList[parseInt(e.currentTarget.id)];
      let disX = this.startX - touch.clientX;
      if (disX >= 20) {
        if (disX > this.delBtnWidth) {
          disX = this.delBtnWidth;
        }
        this.$set(
          this.glossaryList[parseInt(e.currentTarget.id)],
          "right",
          disX
        );
      } else {
        this.$set(this.glossaryList[parseInt(e.currentTarget.id)], "right", 0);
      }
    },

    drawEnd(e) {
      console.log("滑动结束");
      let item = this.glossaryList[parseInt(e.currentTarget.id)];
      if (item.right >= this.delBtnWidth / 2) {
        this.$set(
          this.glossaryList[parseInt(e.currentTarget.id)],
          "right",
          this.delBtnWidth
        );
      } else {
        this.$set(this.glossaryList[parseInt(e.currentTarget.id)], "right", 0);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.glossary-page {
  position: absolute;
  height: 100vh;
  width: 100vw;
  .nav-bar {
    top: 0;
    width: 100%;
    height: 44px;
  }
  .list {
    overflow: scroll;
    width: 100%;
    height: 100vh;
    .no-data {
      background-color: white;
      display: flex;
      flex-direction: column;
      margin: 1rem;
      padding-top: 1rem;
      border-radius: 1rem;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
        rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
      .text {
        font-size: 1rem;
        font-weight: bold;
        display: block;
        margin: 1rem;
      }
    }
    .item-card {
      position: relative;
      .item-content {
        margin: 0.5rem 1rem;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
          rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
        border-radius: 10px;
        background: #ffffff;
        padding: 0.5rem 1rem;
        position: relative;
        z-index: 100;
        .row {
          display: flex;
          justify-content: space-between;
        }
        .item-title {
          line-height: 2.25rem;
          font-size: 1rem;
          font-weight: bold;
        }
        .btn-area {
          display: flex;
          .button {
            background-color: #90caf9;
            font-size: 0.8rem;
            color: #ffffff;
            // margin-bottom: 1rem;
            margin-top: 0.8rem;
            border-radius: 10px;
            width: 90px;
            .icon-btn {
              margin-right: 0.2rem;
            }
          }
          .uni-button:after {
            border: none;
          }
        }
      }
    }
    .delete-item {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      display: flex;
      align-items: center;
      padding-right: 1.25rem;
      z-index: 5;
      .delete-btn {
        border-radius: 2rem;
        background: #fafffb;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        font-size: 0.875rem;
      }
      .uni-button:after {
        border: none;
      }
    }
  }
}
.search-bar {
  width: 100%;
  background-color: #c7e5c8;
}

.delete-leave {
  opacity: 1;
}
.delete-leave-to {
  opacity: 0;
}
.delete-leave-active {
  transition: opacity 0.5s;
}
</style>
