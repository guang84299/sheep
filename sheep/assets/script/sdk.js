/**
 * Created by guang on 18/7/18.
 */
var storage = require("storage");
var tt = window["tt"];

module.exports = {
    isConec: true,
    bannerNum:0,
    isShowBanner: false,
    is_iphonex: function()
    {
        if(!this._initiphonex)
        {
            this._initiphonex = true;
            if(true) {
                var bl = (cc.view.getFrameSize().width / cc.view.getFrameSize().height);
                var bt = cc.view.getFrameSize().height/cc.view.getFrameSize().width;
                if (bl == (1125/2436) || bl == (1080/2280) || bl == (720/1520) || bl == (1080/2340) || bt >= 1.96) {
                    this.isIphoneX = true;
                } else {
                    this.isIphoneX = false;
                }
            }
        }
        return this.isIphoneX;
    },

    vibrate: function(isLong)
    {
        if(storage.getVibrate() == 1 && (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS))
        {
            if(isLong)
            {
                wx.vibrateLong({});
            }
            else
            {
                wx.vibrateShort({});
            }
        }
    },

    keepScreenOn: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            wx.setKeepScreenOn({
                keepScreenOn: true
            });
        }
    },

    uploadScore: function(score,callback)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            wx.postMessage({ message: "updateScore",score:Math.floor(score) });
            if(callback)
                callback();
        }
        else
        {
            if(callback)
                callback();
        }
    },

    openRank: function(worldrank)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            wx.postMessage({ message: "friendRank",worldrank:worldrank });
        }
    },
    closeRank: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            wx.postMessage({ message: "closeRank" });
        }
    },

    openFuhuoRank: function(score)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            //wx.postMessage({ message: "fuhuoRank",score:Math.floor(score) });
        }
    },
    closeFuhuoRank: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            //wx.postMessage({ message: "closeFuhuo" });
        }
    },

    getRankList: function(callback)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(callback)
                callback(null);
        }
        else
        {
            if(callback)
                callback(null);
        }
    },

    getChaoyueRank: function(callback,score)
    {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(callback)
                callback(null);
        }
        else
        {
            if(callback)
                callback(null);
        }
    },

    videoLoad: function()
    {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId:'4aicos48sfvyiuyv04'});
            this.rewardedVideoAd.onLoad(function(){
                cc.GAME.hasVideo = true;
                console.log('激励视频 广告加载成功')
            });
            this.rewardedVideoAd.onClose(function(res){
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    if(self.videocallback)
                        self.videocallback(true);
                }
                else {
                    if(self.videocallback)
                        self.videocallback(false);
                    cc.res.showToast("视频未看完！");
                }
                if(cc.myscene == "main")
                    cc.storage.playMusic(cc.res.audio_music);
                //storage.playMusic(cc.sdk.main.res.audio_mainBGM);
            });
            this.rewardedVideoAd.onError(function(res){
                cc.GAME.hasVideo = false;
                if(self.videocallback)
                {
                    self.videocallback(false);
                    cc.res.showToast("视频正在准备中...");
                }

                console.error(res);
            });


            //初始化插屏广告
            this.interstitialAd = null;

            // 创建插屏广告实例，提前初始化
            // if (wx.createInterstitialAd){
            //     this.interstitialAd = wx.createInterstitialAd({
            //         adUnitId: 'adunit-116cf8bef9613451'
            //     });
            // }


        }
        this.bannerTime = 0;
    },

    showVedio: function(callback)
    {
        var self = this;
        this.videocallback = callback;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            cc.GAME.hasVideo = false;
            this.rewardedVideoAd.show().catch(function(err){
                self.rewardedVideoAd.load().then(function(){
                    self.rewardedVideoAd.show();
                });
            });

            //if(cc.GAME.share)
            //    this.share(callback,"prop");
            //else
            //{
            //    if(callback)
            //        callback(false);
            //    cc.res.showToast("暂未开放！");
            //}
        }
        else
        {
            if(callback)
                callback(true);
        }
    },

    showBanner: function(node,callback,isHide)
    {

        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(this.bannerAd && this.bannerNum<5)
            {
                this.bannerNum ++;
                this.bannerAd.show();
                this.isShowBanner = true;
                return;
            }
            this.bannerNum  = 0;
            this.isShowBanner = true;
            // this.hideBanner();
            if(this.bannerAd) this.bannerAd.destroy();

            //var dpi = cc.view.getDevicePixelRatio();
            var s = cc.view.getFrameSize();
            // var dpi = cc.winSize.width/s.width;

            var w = s.width*0.9;
            var h = 100/337*w;
            var self = this;
           
            this.bannerAd = wx.createBannerAd({
                adUnitId: "42ocp6qjc9i1i7ulfu",
                style: {
                    left: 0,
                    top: s.height-h,
                    width: w,
                    height:h,
                }
            });
            var bannerAd = this.bannerAd;
            this.bannerAd.onResize(function(res){
                bannerAd.style.left = s.width/2-res.width/2;
                bannerAd.style.top = s.height-res.height-1;
                bannerAd.res = res;
                
                if(isHide)
                {
                    bannerAd.style.top = s.height+20;
                }
                if(!self.isShowBanner)
                {
                    self.hideBanner();
                }
            });
            this.bannerAd.onError(function(res){
                console.error(res);
            });
            this.bannerAd.onLoad(function(res){
                bannerAd.show();
            });
            

            this.bannerTime = new Date().getTime();   
        }
    },

    hideBanner: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(this.bannerAd)
            {
                this.bannerAd.hide();
                this.isShowBanner = false;
            }

        }
    },

    getBannerDis: function(node)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(this.bannerAd && node && this.bannerAd.res)
            {
                var s = cc.view.getFrameSize();
                var dpi = cc.winSize.width/s.width;
                var y = node.parent.convertToWorldSpaceAR(node.position).y-(node.height*node.anchorY);
                var dis = y - this.bannerAd.res.height*dpi;
                return dis;
            }
        }
        return 0;
    },

    moveBanner: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(this.bannerAd && this.bannerAd.res)
            {
                var s = cc.view.getFrameSize();
                this.bannerAd.style.top = s.height-this.bannerAd.res.height-1;
            }
        }
    },

    showSpot: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if (this.interstitialAd)
            {
                this.interstitialAd.show().catch(function(err) {
                    console.error(err)
                });
            }
        }
    },

    share: function(callback,channel)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            var query = "fromid="+cc.qianqista.openid+"&channel="+channel;
            var title = "我一夜暴富的秘诀竟然是招聘了一群绵羊员工。。。";
            var imageUrl = "https://game.7q7q.top/img/wxgame/c39395a760b9410482441ea6e92d72a0.jpg";//cc.url.raw("resources/zhuanfa.jpg");
            if(cc.GAME.shares.length>0)
            {
                var i = Math.floor(Math.random()*cc.GAME.shares.length);
                var sdata = cc.GAME.shares[i];
                if(sdata && sdata.title && sdata.imageUrl)
                {
                    title = sdata.title;
                    imageUrl = sdata.imageUrl;
                }
            }
            var videoPath = storage.getVideoPath();
            if(!videoPath){
                cc.res.showToast("暂未录制视频!");
                return;
            }
            tt.shareAppMessage({
                channel: 'video',
                title: title,
                desc: title,
                imageUrl: imageUrl,
                templateId: '', // 替换成通过审核的分享ID
                query: query,
                extra: {
                  videoPath: videoPath, // 可替换成录屏得到的视频地址
                  videoTopics: ['全民剪羊毛','全民剪羊毛小游戏','抖音小游戏']
                },
                success() {
                    console.log('分享视频成功');
                    if(callback) callback(true);
                  },
                  fail(e) {
                    console.log('分享视频失败');
                    if(callback)
                    {
                        callback(false);
                        cc.res.showToast("分享视频失败!");
                    }

                }  
            }); 
            // wx.shareAppMessage({
            //     query:query,
            //     title: title,
            //     imageUrl: imageUrl,
            //     success: function(res)
            //     {
            //         if(callback)
            //             callback(true);
            //         cc.log(res);
            //     },
            //     fail: function()
            //     {
            //         if(callback)
            //             callback(false);
            //     }
            // });
            // this.shareJudge(callback);
        }
        else
        {
            if(callback)
                callback(true);
        }
    },

    shareJudge: function(callback)
    {
        cc.qianqista.sharetime = new Date().getTime();
        cc.qianqista.sharecallback = callback;
    },

    skipGame: function(gameId,url)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(gameId)
            {
                var pathstr = 'pages/main/main?channel=drifty';
                wx.navigateToMiniProgram({
                    appId: gameId,
                    path: pathstr,
                    extraData: {
                        foo: 'bar'
                    },
                    // envVersion: 'develop',
                    success: function(res) {
                        // 打开成功
                    }
                });
            }
            //else if(url && url.length > 5)
            //{
            //    //BK.MQQ.Webview.open(url);
            //}
        }
    },

    shortcut: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            //var extendInfo = "shortcut";//扩展字段
            //BK.QQ.createShortCut(extendInfo)
        }
    },

    getUserInfo: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            wx.getSetting({
                success: function (res) {
                    console.log(res.authSetting);
                    if(!res.authSetting["scope.userInfo"])
                    {
                        //cc.sdk.openSetting();
                        cc.qianqista.login(false);
                    }
                    else
                    {
                        wx.getUserInfo({
                            success: function(res) {
                                cc.sdk.userInfo = res.userInfo;
                                cc.qianqista.login(true,res.userInfo);
                                wx.postMessage({ message: "loginSuccess",userInfo:res.userInfo });
                            }
                        });
                    }
                }
            });


            wx.showShareMenu({
                withShareTicket: true,
                success: function (res) {
                    // 分享成功
                },
                fail: function (res) {
                    // 分享失败
                }
            });


            wx.onShareAppMessage(function (ops){
                return {
                    query:"channel=sharemenu",
                    withShareTicket: true,
                    title: "我一夜暴富的秘诀竟然是招聘了一群绵羊员工。。。",
                    imageUrl: "https://game.7q7q.top/img/wxgame/c39395a760b9410482441ea6e92d72a0.jpg"
                }
            });

            wx.updateShareMenu({
                withShareTicket: true,
                success: function (res) {
                    // 分享成功
                },
                fail: function (res) {
                    // 分享失败
                }
            })
        }
        else
        {
            cc.qianqista.login(false);
        }
    },

    judgePower: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            return cc.qianqista.power == 1 ? true : false;
        }
        return true;
    },

    openSetting: function(callback)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            //cc.sdk.main.openQuanXian();
            //var quan = self.node_quanxian.quan;
            //var openDataContext = wx.getOpenDataContext();
            //var sharedCanvas = openDataContext.canvas;
            //var sc = sharedCanvas.width/this.dsize.width;
            //var dpi = cc.view._devicePixelRatio;

            var s = cc.view.getFrameSize();

            var pos = cc.v2(s.width/2, s.height*0.5);

            var button = wx.createUserInfoButton({
                type: 'text',
                text: '授权进入游戏',
                style: {
                    left: pos.x-60,
                    top: pos.y+20,
                    width: 120,
                    height: 40,
                    lineHeight: 40,
                    backgroundColor: '#1779a6',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 12,
                    borderRadius: 4
                }
            });
            button.onTap(function(res){
                console.log(res);
                if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
                    //cc.qianqista.login(false);
                    if(callback) callback(false);
                }
                else
                {
                    cc.sdk.userInfo = res.userInfo;
                    cc.qianqista.login(true,res.userInfo);
                    wx.postMessage({ message: "loginSuccess",userInfo:res.userInfo });
                    //var score = storage.getLevel();
                    //cc.sdk.uploadScore(score);
                    if(callback) callback(true);
                    //if(cc.sdk.main.quanxiansc)
                    //    cc.sdk.main.quanxiansc.hide();

                }
                button.destroy();
            });
        }
    },

    showClub: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(!this.clubBtn)
            {
                var s = cc.view.getFrameSize();
                //var dpi = cc.winSize.width/s.width;

                this.clubBtn = wx.createGameClubButton({
                    icon: 'green',
                    style: {
                        left: s.width*0.03,
                        top: s.height*0.03,
                        width: 40,
                        height: 40
                    }
                });
            }
            else
            {
                this.clubBtn.show();
            }

        }
    },

    hideClub: function()
    {
        if(this.clubBtn)
            this.clubBtn.hide()
    },

    openKefu: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            wx.openCustomerServiceConversation({});
        }
    },

    gameRecorderStart: function(){
        if(tt)
        {
            if(this.recordering) return;
            if(!this.recorderManage)
            {
                var self = this;
                const recorder = tt.getGameRecorderManager();
                this.recorderManage =  recorder;
                recorder.onStart(res =>{
                    console.log('录屏开始');
                    // do somethine;
                })

                recorder.onStop(res =>{
                    if(self.isSaveRecorder)
                    storage.setVideoPath(res.videoPath);
                    console.log(res.videoPath);
                    if(this.recordercallback) this.recordercallback();
                    this.recordering = false;
                    // do somethine;
                })
                recorder.onError(errMsg =>{
                    console.log(errMsg);
                    if(this.recordercallback) this.recordercallback();
                    this.recordering = false;
                    // do somethine;
                })
            }
            this.recorderManage.start({
                duration: 300,
            })
            this.recordercallback = null;
            this.recordering = true;
            this.isSaveRecorder = true;
            storage.setVideoPath("");
        }
        
    },
    gameRecorderStop: function(callback){
        if(tt)
        {
            this.recordercallback = callback;
            if(this.recorderManage)this.recorderManage.stop();
            // if(this.recordering)
            // {
            //     this.recordering = false;
            //     if(this.recorderManage)this.recorderManage.stop();
            // }
            // else
            // {
            //     if(callback) callback();
            // }
        }
        else
        {
            if(callback) callback();
        }
    },
    setSaveRecorder: function(isSaveRecorder){
        this.isSaveRecorder = isSaveRecorder;
    },

    getRecordering: function(){
        return this.recordering;
    },

    getNicks: function()
    {
        return ["惜爱","符号","GA","Wu","Vincent","刚","世界","Mr","Dick","陈俊士","虾仁","袁伟","misty","逆水寒"];
    }
};