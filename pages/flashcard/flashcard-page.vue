<template>
  <view class="page-body scroll-disable">
    <view class="page-body scroll-disable">
      <view
        class="page-body body-flex scroll-disable"
        :animation="animationData"
      >
        <view v-show="isFinished">
          <view class="no-data">
            <u-image
              mode="aspectFit"
              height="200px"
              src="../../static/icons/no-task.svg"
              bg-color="#ffffff"
            >
            </u-image>
            <text class="text"
              >Congrats! You don't have words to review today</text
            >
            <button class="summary uni-button" @click="toSummary">
              Check Summary
            </button>
          </view>
        </view>
        <cardslide
          @setword="setword"
          @setForget="forgetEvent"
          @setRemember="rememberEvent"
          @scrolldown="scrolldown"
          v-show="!isFinished"
          :wordList="wordList"
          @setFinished="setFinished"
        ></cardslide>
      </view>
    </view>
    <view class="page-body scroll-enable" :animation="animationData">
      <view @click="scrollUp" class="click-btn backToFlashcard">
        <u-icon name="arrow-up"></u-icon>
        <h4>Back to Flashcard</h4>
      </view>
      <dictionary
        ref="dictionary"
        v-if="word !== ''"
        :isAdd="true"
        :word="word"
      ></dictionary>
    </view>
  </view>
</template>
<script>
import dateFormat from "dateformat";
import cardslide from "./card-slide.vue";
import dictionary from "../../components/dictionary.vue";
import { FLASHCARD_URL } from "../../utils/paths.js";
import { getArray, request } from "../../utils/methods.js";
export default {
  onShow() {
    var animation = uni.createAnimation({
      duration: 300,
      timingFunction: "ease-out",
    });
    this.animation = animation;
  },
  created() {
    let date = this.$store.state.flashcard_date;
    this.$u.vuex("flashcard_date", "");
    console.log(date);
    if (this.wordList.length == 0 && date !== "") {
      let url =
        FLASHCARD_URL + "/" + this.$store.state.vuex_user.id + "/" + date;
      let option = {
        url: url,
      };
      request(option).then((res) => {
        console.log(res.data);
        if (res.data) {
          let obj = res.data;
          console.log(obj[Object.keys(obj)[0]]);
          this.wordList = getArray(obj[Object.keys(obj)[0]].word_list);
          console.log(this.wordList);
          this.count = this.wordList.length;
          this.word = this.wordList[0].word;
        } else {
          // this.ShowCard = false;
        }
      });
    } else {
      // this.ShowCard = false;
    }
  },
  onUnload() {
    this.animationData = {};
    // 页面关闭后清空数据
  },
  onLoad(option) {
    console.log(option);
    const now = new Date().getTime();
    const today = dateFormat(now, "yyyy-mm-dd");
    if (!option.date) {
      this.$u.vuex("flashcard_date", today);
    } else {
      this.$u.vuex("flashcard_date", option.date);
    }
    this.animation = uni.createAnimation();
    console.log("test");
    // 创建动画实例
  },
  components: {
    cardslide,
    dictionary,
  },

  data() {
    return {
      word: "test",
      animationData: {},
      isFinished: false,
      wordList: [],
    };
  },
  methods: {
    forgetEvent: function (i) {
      // this.word = ''
      let audio = "../../static/sounds/navigation_transition-left.wav";
      console.log(index);
      let index = i - 1;
      if (index < this.wordList.length - 1) {
        this.word = this.wordList[index].word;

        // this.$refs.dictionary.translate()
        if (this.wordList[i]) {
          this.wordList[i].remember = false;
          this.count--;
        }
      }
      this.audio(audio);
    },
    setword(word) {
      this.word = word;
    },
    rememberEvent: function (i) {
      let audio = "../../static/sounds/notification_simple-02.wav";
      console.log(index);
      let index = i - 1;
      if (index < this.wordList.length - 1) {
        this.word = this.wordList[index].word;

        // this.$refs.dictionary.translate()
        if (this.wordList[i] && !this.wordList[i].remember) {
          this.wordList[i].remember = true;
          this.count--;
        }
      }
      this.audio(audio);
    },
    audio(src) {
      const iac = uni.createInnerAudioContext();
      iac.src = src;
      iac.play(() => {
        console.log("play~");
      });
    },
    toSummary() {
      this.$u.vuex("flash_words", this.wordList);
      this.$u.route("/pages/flashcard/Summary");
    },
    setFinished(status) {
      this.isFinished = status;
    },
    scrollUp() {
      console.log(this.animation);
      this.animation.translateY("0%").step();
      // 导出动画数据传递给data层
      this.animationData = this.animation.export();
    },
    scrolldown() {
      console.log("tasdasjdnjkas");
      this.animation.translateY("-100%").step();
      // 导出动画数据传递给data层
      this.animationData = this.animation.export();
    },
  },
};
</script>

<style lang="scss" scoped>
uni-page-body {
  width: 100vh;
  height: 100vh;
}

.page-body {
  height: 100vh;
}
.scroll-disable {
  overflow: hidden;
}
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
.summary {
  background-color: #90caf9;
  font-size: 0.8rem;
  color: #ffffff;
  margin-bottom: 1rem;
  margin-top: 0.8rem;
  border-radius: 10px;
  .icon-btn {
    margin-right: 0.2rem;
  }
}

.uni-button:after {
  border: none;
}
.scroll-enable {
  overflow: scroll;
}
.backToFlashcard {
  display: flex;
  justify-content: center;
}
</style>
