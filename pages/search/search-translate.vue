<!--
Use Merriam-Webster dictionary API and Google translate API 
to get the meaning of the words and display them in the search result page.
-->
<template>
  <view class="dictionary">
    <dictionary :isAdd="isAdd" :word="word"></dictionary>
  </view>
</template>

<script>
import dictionary from "../../components/dictionary.vue";
import { getGlossary } from "../glossary/glossary-service.js";

export default {
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    this.word = option.word;
    this.isReview = option.isReview;
  },
  mounted() {
    this.userId = this.$store.state.vuex_user.id;
    if (this.isReview) {
      this.isAdd = true;
    } else {
      this.checkGlossary();
    }
  },
  components: {
    dictionary,
  },
  data() {
    return {
      word: "",
      userId: "",
      definition: "",
      meaning: "",
      isAdd: true,
      isLoad: false,
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
  methods: {
    // get audio from merriam-webster and play
    async checkGlossary() {
      const glossary = await getGlossary(this.userId);
      if (glossary && glossary.length > 0) {
        if (!glossary.find((elem) => elem.word === this.word)) {
          this.isAdd = false;
          console.log("need add");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dictionary {
  .dictionary-content {
    margin: 1rem;
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
        .short {
          font-style: italic;
          margin-right: 1rem;
          font-family: serif;
          font-size: 1rem;
          color: #909399;
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
      font-size: 1rem;
      font-weight: bold;
      display: block;
      margin: 1rem;
    }
  }
}
</style>
