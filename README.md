# Board Game Online
基于微信的在线桌游
## 一. 项目背景
　　牌类桌游是在聚会中最常见的娱乐项目之一，假设这样一个场景，当三五个人一起聚会放松之余，身上或附近却又没有麻将扑克，同时由于人数较少，狼人杀、谁是卧底等游戏的可玩性又较低，因此这时候娱乐项目较少。虽然手机上有斗地主等手游可通过QQ/微信登录和朋友对战；但绝大多数情况下，这类手游在一个聚会团体中安装率很低，更不用说是同一款手游，为一次聚会特意安装游戏的意向一般也不高。但是现如今几乎人人有手机人人有微信，通过微信公众号的牵线，可以将棋牌类游戏以web app的形式推送给用户，由于公众号可获取用户基本信息，因此服务器可为特定用户搭建房间，实现用户在微信内置浏览器与好友对战。
　　
　　微信web app的形式只需用户关注公众号，轻量级web app即点即用，而省去了安装native app的麻烦，同时由于线下聚会的性质又不会丧失真实棋牌游戏时的热闹气氛。当然多人异地在线玩也是完全可以的。

## 二. 功能分析及实现逻辑
　　该项目主要用于微信授权（关注公众号的形式）的在线棋牌类游戏，初版1.0先实现四人在线麻将（国标），往后可逐步开启二人麻将、斗地主、双扣等，若玩家人数不足在创建游戏时可设定AI代替。
　　
　　项目实现逻辑（不讨论麻将等具体游戏规则）：主要参考现有的一些桌游助手如“微派桌游助手”和“二店长的小游戏”等公众号（如下图）。
　　
　　在用户关注后，可选择相应游戏设置游戏参数（如AI个数，初版四人麻将可无需设置），公众号/服务端向用户发送房间代码，其他用户可将此代码发送至公众号；公众号将向创建者及其他加入者发送web app的链接，获取用户id后即可实现线下聚会线上游戏。

## 三. 预期用户
　　预期用户以小型聚会成员为主，当然人过多也可拆分成几桌分开玩，以及纯多人线上游戏也是完全可以的。同时由于web app的特点，不限平台限制，可在各移动设备及电脑端微信的内置浏览器中实现，用户覆盖面广。
　　
## 四. 现有相关软件
### 1.各种棋牌类手游：
　　以单机和在线随机匹配为主，线下互动性较差；更主要的是这类游戏在实际中的安装率较低，安装使用不便。

### 2.4399等在线小游戏
　　基本都是单人游戏，缺乏和朋友的互动性。

### 3.“微派桌游助手”及“二店长的小游戏”等公众号
<img src="http://chuantu.biz/t5/41/1478722696x3081559098.png" style="max-width:20%;"/><img src="http://chuantu.biz/t5/41/1478722735x3081559098.jpg" style="max-width:20%;"/>

　　前者以多人（6~8人以上）游戏为主，小型聚会的可玩性低。后者以非实时对战游戏为主（也有五子棋），同样不怎么适用所述情景。

