<script>
import { getGlossary } from "./pages/glossary/glossary-service.js";
import { AddNewTodo } from "./pages/todolist/db.js";
import dateFormat from "dateformat";
import { createFlashCard, checkUpdate } from "./utils/methods.js";
export default {

  onLaunch() {
    const user_id = this.$store.state.vuex_user.id;
    if (user_id) {
      this.createFlashcard(user_id);
    }
  },
  methods: {
    /**
     * Create daily reviewing flashcard, using Forgetting curve
     */
    async createFlashcard(user) {
      const times = [1, 2, 5, 8, 15, 30, 60];
      const now = new Date().getTime();
      const today = dateFormat(now, "yyyy-mm-dd");
      const isUpdated = await checkUpdate(user, today);
      const res = await getGlossary(user);
      console.log(res);
      if (!isUpdated && res) {
        console.log("create flashcard");
        const glossary = Object.assign([], res);
        let count = 0;
        let word_list = [];
        if (glossary) {
          for (let i = 0; i < glossary.length; i++) {
            let during;
            if (glossary[i].review_time) {
              during = Math.floor(
                (now - new Date(glossary[i].review_time).getTime()) /
                  (24 * 3600 * 1000)
              );
            } else {
              during = Math.floor(
                (now - new Date(glossary[i].added_time).getTime()) /
                  (24 * 3600 * 1000)
              );
            }
            if (times.find((elem) => elem === during)) {
              count++;
              word_list.push({
                id: glossary[i].id,
                word: glossary[i].word,
                phonetic_symbol: glossary[i].phonetic_symbol,
              });
            }
          }
          //In case there is no flashcard, we randomly generate some to review
          if (count == 0) {
            glossary.sort(() => Math.random() - 0.5);
            for (let i = 0; i < glossary.length / 2; i++) {
              count++;
              word_list.push({
                id: glossary[i].id,
                word: glossary[i].word,
                phonetic_symbol: glossary[i].phonetic_symbol,
              });
            }
          }
          console.log("word count", count, word_list);
          const text = "You have " + count + " words to review today!";

          const addToDo = new Promise((res) => {
            AddNewTodo(
              user,
              today,
              { text: text, done: false, type: "flashcard" },
              (result) => {
                res(result);
              }
            );
          });
          Promise.all([addToDo, createFlashCard(user, today, word_list)]).then(
            (res) => {
              console.log(res);
            }
          );
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";
@import "common/iconfont.css";
page {
  background-color: #f5f5f6;
}
</style>
