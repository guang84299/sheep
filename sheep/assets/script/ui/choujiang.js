var storage = require("storage");
var res = require("res");
var sdk = require("sdk");

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad: function()
    {

        
    },
    initUI: function()
    {
        this.bg = cc.find("bg",this.node);
        this.txt_time = cc.find("txt_time/num",this.bg).getComponent("cc.Label");
        this.txt_num = cc.find("txt_num/num",this.bg).getComponent("cc.Label");
        this.btn_choujiang = cc.find("bg/box/choujiang",this.node).getComponent("cc.Button");
        this.btn_vedio_lingqu = cc.find("bg/btns/lingqu2",this.node).getComponent("cc.Button");
        this.btn_lingqu = cc.find("bg/btns/lingqu",this.node).getComponent("cc.Button");
        this.btn_lingqu_ban = cc.find("bg/btns/lingqu",this.node);

        this.tiliBtn = cc.find("bg/tiliBtn",this.node).getComponent("cc.Button");

        this.deng1 = cc.find("box/deng",this.bg);
        //this.deng2 = cc.find("box/deng2",this.bg);
        //this.deng3 = cc.find("box/deng3",this.bg);
        //this.deng4 = cc.find("box/deng4",this.bg);

        this.btn_lingqu.node.active = false;
        this.btn_vedio_lingqu.node.active = false;

        this.boxs = cc.find("box/boxs",this.bg).children;
        this.awards = res.conf_choujiang;

        for(var i=0;i<this.boxs.length;i++)
        {
            var box = this.boxs[i];
            var data = res.conf_choujiang[i];
            box.guang = cc.find("guang",box);
            box.mask = cc.find("mask",box);

            box.guang.active = true;
            box.guang.opacity = 0;
            box.mask.active = true;
            box.mask.opacity = 0;

            var icon = cc.find("box/icon",box);
            var desc = cc.find("box/desc",box).getComponent(cc.Label);
            desc.string = data.tips;
            icon.width = 40;
            icon.height = 40;
            if(data.rewardType == "0")
            {
                res.setSpriteFrameAtlas("images/common","coin",icon);
                desc.node.color = cc.color(225,130,6);
            }
            else if(data.rewardType == "1")
            {
                res.setSpriteFrameAtlas("images/rank","quik",icon);
                desc.node.color = cc.color(105,12,255);
            }
            else if(data.rewardType == "2")
            {
                res.setSpriteFrameAtlas("images/rank","up",icon);
                desc.node.color = cc.color(189,43,7);
            }
            else if(data.rewardType == "3")
            {
                res.setSpriteFrameAtlas("images/common","diamond",icon);
                desc.node.color = cc.color(225,130,6);
            }
        }
    },

    updateUI: function(isAmin)
    {
        var choujiangNum = storage.getChoujiangNum();
        this.txt_num.string = choujiangNum+"/5";
        if(!isAmin)
        this.btn_choujiang.interactable = choujiangNum>0 ? true : false;

        var choujiangTime = storage.getChoujiangTime();
        var now = new Date().getTime();
        if(choujiangNum < 5)
        {
            if(now - choujiangTime>10*60*1000)
            {
                var num = Math.floor((now - choujiangTime)/(10*60*1000));
                choujiangNum += num;
                if(choujiangNum>5) choujiangNum = 5;
                storage.setChoujiangNum(choujiangNum);
                this.txt_num.string = choujiangNum+"/5";
                if(!isAmin)
                this.btn_choujiang.interactable = choujiangNum>0 ? true : false;
            }

            this.updateTime();
        }

        this.tiliBtn.node.active = choujiangNum>0 ? false : true;
    },

    updateTime: function()
    {
        this.node.stopAllActions();

        var self = this;
        var choujiangNum = storage.getChoujiangNum();
        if(choujiangNum<5)
        {
            var choujiangTime = storage.getChoujiangTime();
            var now = new Date().getTime();
            var time = 10*60*1000 - (now - choujiangTime);

            var h = Math.floor(time/(60*60*1000));
            var m = Math.floor((time - h*60*60*1000)/(60*1000));
            var s = Math.floor(((time - h*60*60*1000 - m*60*1000))/1000);
            //var sh = h < 10 ? "0"+h : h;
            var sm = m < 10 ? "0"+m : m;
            var ss = s < 10 ? "0"+s : s;
            this.txt_time.string = sm+":"+ss;

            if(time<1000)
            {
                choujiangNum+=1;
                storage.setChoujiangNum(choujiangNum);
                storage.setChoujiangTime(now);
                this.txt_num.string = choujiangNum+"/5";
                this.btn_choujiang.interactable = choujiangNum>0 ? true : false;
            }
            this.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(function(){
                    self.updateTime();
                })
            ));
        }
        else
        {
            this.updateUI();
        }
    },


    show: function()
    {
        //this.main.wxQuanState(false);
        this.game = cc.find("Canvas").getComponent("main");
        this.node.sc = this;

        this.initUI();
        this.updateUI();

        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));

        var self = this;
        cc.sdk.showBanner(20005,this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

        cc.qianqista.event("抽奖_打开");

    },

    hide: function()
    {
        if(this.btn_vedio_lingqu.node.active || this.btn_lingqu.node.active)
        {
            this.lingqu();
        }
        this.game.updateRed();
        //this.main.wxQuanState(true);
        var self = this;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    self.node.destroy();
                })
            ));
        cc.sdk.hideBanner();
    },

    choujiangAmin: function(num,awardIndex,callback)
    {
        var self = this;
        var t = 0.1;
        var dt = 0.05;
        if(num>5)
        {
            dt = dt + (num-5)*0.05;
        }

        for(var i=0;i<this.boxs.length;i++)
        {
            var box = this.boxs[i];

            var ac = cc.sequence(
                cc.delayTime(dt*i),
                cc.fadeIn(0),
                cc.delayTime(t),
                cc.fadeOut(0)
            );

            var ac2 = cc.sequence(
                cc.delayTime(dt*i),
                cc.fadeOut(0),
                cc.delayTime(t),
                cc.fadeIn(0)
            );
            if(num==1)
                box.mask.opacity = 255;
            box.mask.runAction(ac2);

            if(i == this.boxs.length-1 || num == 8)
            {
                ac = cc.sequence(
                    cc.delayTime(dt*i),
                    cc.fadeIn(0),
                    cc.delayTime(t),
                    cc.fadeOut(0),
                    cc.callFunc(function(){
                        num++;
                        if(num>8)
                        {
                            callback();
                        }
                        else
                        {
                            self.choujiangAmin(num,awardIndex,callback);
                        }
                    })
                );

            }

            box.guang.runAction(ac);

            if(num == 8)
                break;
        }

        if(num < 8)
        {
            this.deng1.active = true;

            var i = 1;
            this.schedule(function(){
                cc.res.setSpriteFrame("images/choujiang/deng"+i,self.deng1);
                i ++;
                if(i>4) i = 1;
            },0.1,8);
            //this.deng2.runAction(cc.blink(0.8,3));
            //this.deng3.runAction(cc.blink(0.8,4));
            //this.deng4.runAction(cc.blink(0.8,5));
        }

    },

    choujiang: function()
    {
        var self = this;
        this.btn_choujiang.interactable = false;
        var awardIndex = 0;

        var r = Math.random()*100;
        var weight = 0;
        for(var i=this.awards.length-1;i>=0;i--)
        {
            var award = this.awards[i];
            weight += Number(award.weight);
            if(r<=weight)
            {
                awardIndex = i;
                break;
            }
        }

        this.choujiangAmin(1,awardIndex,function(){
            var box = self.boxs[awardIndex];
            box.mask.opacity = 0;
            box.guang.opacity = 255;

            self.deng1.active = false;

            self.btn_vedio_lingqu.node.active = true;
            self.btn_lingqu.node.active = true;
            var dis = cc.sdk.getBannerDis(self.btn_lingqu.node);
            if(dis<0) self.bg.y -= dis;
            self.updateAdType();
            self.updateUI(true);
        });


        this.awardIndex = awardIndex;
        var choujiangNum = storage.getChoujiangNum();
        storage.setChoujiangNum(choujiangNum-1);
        if(choujiangNum == 5)
        {
            storage.setChoujiangTime(new Date().getTime());
        }

        storage.setChoujiangToalNum(storage.getChoujiangToalNum()+1);
        storage.uploadChoujiangToalNum();

        this.game.task.updateUI();

        cc.storage.playSound(cc.res.audio_choujiang);
    },

    lingqu: function(isVedio)
    {
        var awardData = this.awards[this.awardIndex];
        if(awardData.rewardType == "0")
        {
            var award = this.game.getSecVal()*Number(awardData.reward);
            if(isVedio) award*=5;
            this.game.addCoin(award);
            res.showToast("金币+"+storage.castNum(award));
            cc.res.showCoinAni();
        }
        else if(awardData.rewardType == "1")
        {
            var time = parseFloat(awardData.time);
            var to = new Date().getTime() + time*60*60*1000;
            var task = {reward:parseInt(awardData.rate),time:time,tip:awardData.tips,to:to};
            storage.addAddSpeedTask(task);
            this.game.initShouYi();

            res.showToast(awardData.tips);
        }
        else if(awardData.rewardType == "2")
        {
            var time = parseFloat(awardData.time);
            var to = new Date().getTime() + time*60*60*1000;
            var task = {reward:parseInt(awardData.rate),time:time,tip:awardData.tips,to:to};
            storage.addAddRateTask(task);
            this.game.initShouYi();

            res.showToast(awardData.tips);
        }
        else if(awardData.rewardType == "3")
        {
            var award = Number(awardData.reward);
            if(isVedio) award*=5;
            this.game.addDiamond(award);
            res.showToast("钻石+"+storage.castNum(award));
            //cc.res.showCoinAni();
        }

        this.btn_choujiang.interactable = true;
        this.btn_vedio_lingqu.node.active = false;
        this.btn_lingqu.node.active = false;
        this.updateUI();
    },

    updateAdType: function()
    {
        this.useShare = false;
        if(cc.GAME.share)
        {
            var rad = parseInt(cc.GAME.choujiangAd);
            if(!cc.GAME.hasVideo) rad = 100;
            if(Math.random()*100 < rad)
            {
                this.useShare = true;
                this.btn_vedio_lingqu.node.getChildByName("share").active = true;
                this.btn_vedio_lingqu.node.getChildByName("video").active = false;
            }
            else
            {
                this.btn_vedio_lingqu.node.getChildByName("share").active = false;
                this.btn_vedio_lingqu.node.getChildByName("video").active = true;
            }
        }
        else
        {
            this.btn_vedio_lingqu.node.getChildByName("share").active = false;
            this.btn_vedio_lingqu.node.getChildByName("video").active = true;
        }

        this.useShare2 = false;
        if(cc.GAME.share)
        {
            var rad = parseInt(cc.GAME.choujiangTiliAd);
            if(!cc.GAME.hasVideo) rad = 100;
            if(Math.random()*100 < rad)
            {
                this.useShare2 = true;
                this.tiliBtn.node.getChildByName("share").active = true;
                this.tiliBtn.node.getChildByName("video").active = false;
            }
            else
            {
                this.tiliBtn.node.getChildByName("share").active = false;
                this.tiliBtn.node.getChildByName("video").active = true;
            }
        }
        else
        {
            this.tiliBtn.node.getChildByName("share").active = false;
            this.tiliBtn.node.getChildByName("video").active = true;
        }
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "choujiang")
        {
            this.choujiang();
            cc.qianqista.event("抽奖_点击");
        }
        else if(data == "lingqu")
        {
            this.lingqu();
            cc.qianqista.event("抽奖_领取");
        }
        else if(data == "vedio_lingqu")
        {
            var self = this;
            if(this.useShare)
            {
                cc.sdk.share(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                },"choujiang");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                },10002);
            }
            cc.qianqista.event("抽奖_2倍领取");
        }
        else if(data == "tili")
        {
            var self = this;
            if(this.useShare2)
            {
                cc.sdk.share(function(r){
                    if(r)
                    {
                        storage.setChoujiangNum(2);
                        self.updateUI();
                    }
                },"choujiangtili");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        storage.setChoujiangNum(2);
                        self.updateUI();
                    }
                },10003);

            }
            cc.qianqista.event("抽奖_加次数");

        }

        storage.playSound(res.audio_button);
        cc.log(data);
    }


});
