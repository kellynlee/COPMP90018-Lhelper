COMP90018_2021_SM2 Assignments 2.  
Group: T01/15-5. 
Authors: Zhengyue Gao, Beier Li, Jing Li, Dongcheng Ding, Zanning Liu, Yu-Hsien Huang. 

<img src=https://github.com/rexding97/l-helper/blob/main/static/icons/logo.png width="100" height="100">

# L-Helper

This is an andriod app to help on learning languages.     
The app not only recognises words in the images and translates them but also set a study plan for the users and them to review the words based on the forgetting curve theory.

## Main structure:

```
.
── l-helper 
   ├── components   
   ├── static   
   ├── utils   
   ├── pages   
   │   ├── flashcard   
   │   ├── glossary   
   │   ├── todolist   
   │   └── search   
   │       ├── image
   │       └── voice
   ├── main.js   
   ├── App.vue   
   └── README.md
   
```   
   
## Main feature:

#### Search:
L-Helper supports 3 kinds of input.  
  * text input
  * image input
  * voice input
At the moment we support search in English-English dictionary, hope to add other languages in the future.

#### Glossary:
Record the words that the users have searched and want to remember.

#### FlashCard:
Review the words looked up before.

#### TodoList:
Connecting with the user's mobile phone Calendar and set up review plan here.

## Installation



## Usage

1. Search unknown words.
2. add the words to your own Glossary.
3. Ues the Flash Card feature to review.
4. Change review plan in the to do list tab if needed.
