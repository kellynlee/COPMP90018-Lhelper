COMP90018_2021_SM2 Assignments 2.  
Group: T01/15-5.   
Authors: Zhengyue Gao, Beier Li, Jing Li, Dongcheng Ding, Zanning Liu, Yu-Hsien Huang. 

<img src=https://github.com/rexding97/l-helper/blob/main/static/icons/logo.png width="100" height="100">

# L-Helper

This is an app to help on learning languages (can be exported for use on both Android and IOS phones).     
The app not only recognises words in images or voices and shows the meaning but also set a study plan for the users and help them to review the words based on the forgetting curve theory.  


## Main Structure:

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

## Main Features:

### Search:
L-Helper supports 3 kinds of input.  
  * text input
  * Image input (use Google Optical Character Recognition API)
  * Voice input (use Baidu Voice Recognition API)   
At the moment we support search in English-English dictionary, hope to add other languages in the future.

### Glossary:
Record the words that the users have searched and want to remember.

### FlashCard:
Review the words looked up before.

### TodoList:
Connecting with the user's mobile phone Calendar and set up review plan here.


## Built With

UniApp, Vue, Javascript, CSS

## Getting Started

### 1. Build the environment

* Hbuilder X

  A buildt-in uniapp compiler and project template, you can click https://www.dcloud.io/hbuilderx.html to select and download the latest version of the corresponding system, without installation, directly unzip and place the unzipped directory into the specified Click HBuilderX.exe under the path to use.

* Import our project

  On the main page of Hbuilder X, use Ctrl+k then Ctrl+O to select the project folder. 

* You should have the UI like this image

  ![image-20211105165635217](.\readmeImage\image-20211105165635217.png)

* You might need to login https://dev.dcloud.net.cn/ through Hbuilder X, here we provide our testing account

  * account: rexding@outlook.com
  * password: -Pbc3CYj!.#L5,8

### 2. Cloud Packaging

 	Compile the project through Hbuilder-X

* Click the memu with order 发行(U) -> 原生App-云打包， and follow the setting as below image, then click the 打包(P) button. 

* <img src=".\readmeImage\image-20211105170104348.png" alt="image-20211105170104348" style="zoom:50%;" />

* Hbuilder X would running some step to package it and then send the information to cloud. Wait for some minutes (depend on the requirements at the same time on cloud center). Once you finish, you would get a url link to download the .apk file of this project.

* Now you can install this .apk to your phone and using our L-helper application.

  

## Usage

1. Search unknown words.
2. add the words to your own Glossary.
3. Use the Flash Card feature to review.
4. Change review plan in the to do list tab if needed.



