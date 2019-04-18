<template>
    <div>
        <!-- <div id="chatPage">{{ stat.messageList }}</div> -->
        <div id="chat">
            <div class="chat">
                <!--header-->
                <header class="header">
                    <span class="title">{{stat.currentUserInfo.nickname}}</span>
                </header>
                <!--header-->

                <!--chat-content-->
                <div class="chat-content">
                    <div class="message-wrapper">
                        <div
                            class="message-item"
                            v-for="(msg,index) in stat.messageList"
                            :key="index"
                            :class="[msg.messageDirection == 1 ? 'my-msg' : 'your-msg']"
                        >
                            <div v-if="msg.messageType == 'TextMessage'" class="message-text">
                                <div class="rong-avatar">
                                    <img
                                        v-if="msg.messageDirection == 1"
                                        :src="stat.currentUserInfo.portraitUri"
                                        class="rong-avatar-bd"
                                    >
                                    <img
                                        v-else
                                        :src="stat.targetUserInfo.portraitUri"
                                        class="rong-avatar-bd"
                                    >
                                </div>
                                <div class="message-body">
                                    <pre
                                        class="user-msg"
                                        v-if="msg.content.messageName == 'TextMessage'"
                                    >{{msg.content.content}}</pre>
                                    <img
                                        class="image-message"
                                        :src="msg.content.imageUri"
                                        alt="image"
                                        v-if="msg.content.messageName == 'ImageMessage'"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--chat-content-->

                <!--footer-->
                <footer class="footer">
                    <div class="message-wrap">
                        <textarea
                            v-model="stat.sendMsgVal"
                            id="message-content"
                            placeholder="请输入文字..."
                            class="message-content"
                        ></textarea>
                    </div>
                    <span class="send-btn" @click="sendMsg">发送</span>
                </footer>
                <!--footer-->
            </div>
        </div>
    </div>
</template>

<script>
import "@/assets/chat.css";
import init from "@/assets/rongyun/init";
export default {
    data() {
        return {
            instance: "",
            stat: {
                currentView: "chat",
                currentUserInfo: {
                    id: "user1",
                    nickname: "产品",
                    region: "86",
                    phone: "13269772701",
                    portraitUri:
                        "http://himg.bdimg.com/sys/portrait/item/98fbe9b8a3e89d895745491c12.jpg?cdnversion=0741"
                },
                targetUserInfo: {
                    id: "user2",
                    nickname: "开发",
                    region: "86",
                    phone: "13269772702",
                    portraitUri:
                        "https://www.rongcloud.cn/docs/assets/img/index/logo.png"
                },
                messageList: [],
                sendMsgVal: ""
            }
        };
    },
    mounted() {
        var _this = this;
        var userInfo = {
            appKey: "82hegw5u8mqwx",
            token:
                "oUh0wcHH6E2LiuTpEKp/+jCvQwRQ4mI0ws9X674LamLVDfNK14vl8UoEcZT0otHeuyNsIi1T4wZ8UwVl0ZqyZA=="
        };
        var callbacks = {
            CONNECTED: function(instance) {
                //传入实例参数
                //获取历史消息
                var conversationType = RongIMLib.ConversationType.PRIVATE;
                var targetId = "user2";
                instance.getHistoryMessages(
                    conversationType,
                    targetId,
                    null,
                    20,
                    {
                        onSuccess(list, hasMsg) {
                            console.log(list);
                            //渲染会话列表
                            _this.stat.messageList = list;
                            return (_this.instance = instance);
                        }
                    },
                    null
                );
            },
            Success: function(id) {},
            Received: function(message) {}
        };
        init(userInfo, callbacks);

        this.scrollEnd();
    },
    methods: {
        sendMsg() {
            var text = this.stat.sendMsgVal;
            if (!text) {
                return false;
            }
            var msg = new RongIMLib.TextMessage({
                content: text,
                extra: "附加信息"
            });
            var conversationType = RongIMLib.ConversationType.PRIVATE; // 私聊
            var targetId = "user2"; // 目标 Id
            var that = this;
            that.instance.sendMessage(conversationType, targetId, msg, {
                // 发送消息成功
                onSuccess: function(message) {
                    that.stat.sendMsgVal = "";
                    that.stat.messageList.push(message);
                    that.$nextTick(that.scrollEnd);
                }
            });
        },
        scrollEnd: function() {
            //添加完消息 跳转到最后一条
            var list = document.querySelectorAll(".message-item");
            if (list.length > 1) {
                var last = list[list.length - 1];
                last.scrollIntoView();
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
