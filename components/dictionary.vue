<!--
Use Merriam-Webster dictionary API and Google translate API 
to get the meaning of the words and display them in the search result page.
-->
<template>
  <view class="dictionary u-skeleton">
    <view class="dictionary-content" v-if="definition">
      <view class="word_name">
        {{ definition.word }}
      </view>
      <text class="origin">{{ "Origin: " + definition.origin }}</text>
      <view class="voice">
        <view
          v-for="(item, index) in definition.phonetics"
          class="item"
          :key="index"
        >
          <button class="voice-btn uni-button" @click="audio(item.audio)">
            <u-icon name="volume-up"></u-icon>
            {{ "/ " + item.text + " /" }}
          </button>
        </view>
      </view>
      <view class="definition">
        <view class="dif-item" v-for="(item, index) in classLst" :key="index">
          <view class="class-item" v-if="meaning[item.name]">
            <view
              class="single-item"
              v-for="(def, index) in meaning[item.name]"
              :key="index"
            >
              <view class="short">
                {{ item.short }}
              </view>
              <view class="meaning">
                <view style="font-weight: bold; font-size: 0.825rem">
                  {{ def.definition }}
                </view>
                <li>{{ def.example }}</li>
                <text>
                  {{ "Antonyms:" + def.antonyms.join(",") }}
                </text>
                <text>
                  {{ "Synonyms:" + def.synonyms.join(",") }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <transition name="fade">
        <view class="btn-area" v-if="!isAdd">
          <button class="glossary-btn uni-button" @click="addGlossary">
            <view v-if="!isClick">
              <u-icon name="plus"></u-icon>
              Add to Glossary
            </view>
            <u-loading mode="circle" :show="isClick"></u-loading>
          </button>
        </view>
      </transition>
    </view>
    <view class="no-data" v-if="definition == null" :key="numberkey">
      <u-image
        mode="aspectFit"
        height="200px"
        src="../static/icons/no-data.svg"
        bg-color="#ffffff"
      ></u-image>
      <text class="text"
        >Sorry pal, we couldn't find definitions for the word you were looking
        for. You can try the search again at later time or head to the web
        instead.</text
      >
    </view>
    <u-toast ref="uToast" />
    <u-skeleton :loading="isLoad" :animation="true" bgColor="#FFF"></u-skeleton>
    <!-- <u-loading mode="circle"  :show="!isLoad"></u-loading> -->
  </view>
</template>

<script>
import dateFormat from "dateformat";
import { addGlossary } from "../pages/glossary/glossary-service.js";
import { request } from "../utils/methods";

export default {
  mounted() {
    this.user = this.$store.state.vuex_user.id;
    this.translate();
  },
  props: {
    isAdd: Boolean,
    word: String,
  },
  data() {
    return {
      message: "",
      user: "",
      audio_name: "",
      trans_word: "",
      definition: "",
      meaning: "",
      isLoad: false,
      isClick: false,
      numberkey: 0,
      classLst: [
        {
          name: "noun",
          short: "n.",
        },
        {
          name: "pronoun",
          short: "pron.",
        },
        {
          name: "adjective",
          short: "adj.",
        },
        {
          name: "adverb",
          short: "adv.",
        },
        {
          name: "verb",
          short: "v.",
        },
        {
          name: "numeral",
          short: "num.",
        },
        {
          name: "article",
          short: "art.",
        },
        {
          name: "preposition",
          short: "prep.",
        },
        {
          name: "conjunction",
          short: "conj.",
        },
        {
          name: "interjection",
          short: "interj.",
        },
      ],
    };
  },
  watch: {
    word: function (newVal, oldVal) {
      this.translate();
    },
  },
  methods: {
    // get audio from merriam-webster and play
    audio(src) {
      const iac = uni.createInnerAudioContext();
      iac.src = src;
      iac.play(() => {
        console.log("play~");
      });
    },

    // find the word meaning in merriam-webster dictionary
    // then translate to the language as user demand
    // (only supply Chinese so far)
    async translate() {
      const url = "https://api.dictionaryapi.dev/api/v1/entries/en/" + this.$props.word;
      try {
        let option = {
          url: url,
        };
        const res = await request(option, true);
        if (res.statusCode === 200 && res.data.length > 0) {
          this.definition = Object.assign({}, res.data[0]);
          this.meaning = Object.assign({}, res.data[0].meaning);
        } else {
          this.definition = null;
          this.meaning = null;
        }
      } catch (e) {
        console.log(e);
        this.definition = null;
        this.meaning = null;
        this.numberkey++;
      }
      this.isLoad = true;
    },

    async addGlossary() {
      let now = new Date();
      let today = dateFormat(now, "mm/dd/yyyy");
      let wordItem = {
        added_time: today,
        review_time: "",
        forget: 0,
        hit: 0,
        star: false,
        word: this.word,
        phonetic_symbol: this.definition.phonetic,
      };
      this.isClick = true;
      try {
        const res = await addGlossary(this.user, wordItem);
        console.log(res);
        if (res) {
          this.$props.isAdd = true;
          this.$refs.uToast.show({
            title: "Adding successfully!",
            type: "success",
          });
        } else {
          this.$refs.uToast.show({
            title: "Internet error!",
            type: "error",
          });
        }
        this.isClick = false;
      } catch (e) {
        console.log(e);
        this.$refs.uToast.show({
          title: "Internet error!",
          type: "error",
        });
        this.isClick = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dictionary {
  display: flex;
  .dictionary-content {
    margin: 1rem 1rem 2rem 1rem;
    background-color: white;
    padding: 0.8rem;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    .word_name {
      font-weight: bolder;
      font-size: 2rem;
    }
    .origin {
      font-style: italic;
      margin-bottom: 1rem;
      font-family: serif;
      font-size: 0.825rem;
      color: #909399;
    }
    .voice {
      display: flex;
      flex-direction: row;
      margin-top: 5px;
      .item {
        margin-right: 0.5rem;
        .voice-btn {
          max-width: 10rem;
          font-size: 0.8rem;
          background-color: #fbfffc;
          box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
          border-radius: 10px;
        }
        .uni-button:after {
          border: none;
        }
      }
    }
    .definition {
      .single-item {
        display: flex;
        padding: 1rem 0.8rem;
        word-break: break-word;
        .short {
          font-style: italic;
          margin-right: 0.5rem;
          font-family: serif;
          font-size: 1rem;
          color: #909399;
          min-width: 1.5rem;
        }
        .meaning {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
  .btn-area {
    position: fixed;
    bottom: 10px;
    margin: 0 auto;
    left: 0;
    right: 0;
    max-width: 15.6rem;
    .glossary-btn {
      background-color: #c8e6c9;
      color: white;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
        rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    }
    .uni-button:after {
      border: none;
    }
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
      font-size: 0.8rem;
      display: block;
      margin: 1rem;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
