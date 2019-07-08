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
        this.txt_time = cc.find("box/txt_time/num",this.bg).getComponent("cc.Label");
        this.txt_num = cc.find("box/txt_num/num",this.bg).getComponent("cc.Label");
        this.pan = cc.find("box/panbg/pan",this.bg);
        this.btn_choujiang = cc.find("bg/box/choujiang",this.node).getComponent("cc.Button");
        this.btn_vedio_lingqu = cc.find("bg/box/vedio_lingqu",this.node).getComponent("cc.Button");
        this.btn_lingqu = cc.find("bg/box/lingqu",this.node).getComponent("cc.Button");
        this.btn_lingqu_ban = cc.find("bg/box/lingqu/ban",this.node);
    },

    updateUI: function()
    {
        var choujiangNum = storage.getChoujiangNum();
        this.txt_num.string = choujiangNum+"/5";
        this.btn_choujiang.interactable = choujiangNum>0 ? true : false;

        var choujiangTime = storage.getChoujiangTime();
        var now = new Date().getTime();
        if(choujiangNum < 5)
        {
            if(now - choujiangTime>5*60*1000)
            {
                var num = Math.floor((now - choujiangTime)/(5*60*1000));
                choujiangNum += num;
                if(choujiangNum>5) choujiangNum = 5;
                storage.setChoujiangNum(choujiangNum);
                this.txt_num.string = choujiangNum+"/5";
                this.btn_choujiang.interactable = choujiangNum>0 ? true : false;
            }

            this.updateTime();
        }
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
            var time = 5*60*1000 - (now - choujiangTime);

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

        this.awards = res.conf_choujiang;


        cc.qianqista.event("抽奖_打开");

    },

    hide: function()
    {
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

    choujiang: function()
    {
        var self = this;
        this.btn_choujiang.interactable = false;
        var ang = 360/this.awards.length;
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

        var roatate = 360 - (ang*awardIndex + ang/2 - this.pan.angle%360);
        this.pan.runAction(cc.sequence(
            cc.rotateBy(3.5,-(360*4+roatate)).easing(cc.easeSineInOut()),
            cc.callFunc(function(){
                //self.btn_choujiang.interactable = true;
                self.btn_vedio_lingqu.node.active = true;
                self.btn_lingqu.node.active = true;
                self.updateUI();
                cc.log(self.awards[awardIndex]);
            }),
            cc.delayTime(0.1),
            cc.callFunc(function(){
                self.btn_lingqu.node.y -= sdk.getBannerDis(self.btn_lingqu_ban);
            })
        ));
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
    },

    lingqu: function(isVedio)
    {
        var awardData = this.awards[this.awardIndex];
        if(awardData.rewardType == "0")
        {
            var award = this.game.getSecVal()*Number(awardData.reward);
            if(isVedio) award*=2;
            this.game.addCoin(award);
            res.showToast("金币+"+storage.castNum(award));
        }
        else if(awardData.rewardType == "1")
        {
            var task = {reward:parseInt(awardData.rate),time:parseFloat(awardData.time)};
            storage.addAddSpeedTask(task);
            this.game.initShouYi();

            res.showToast(awardData.tips);
        }
        else if(awardData.rewardType == "2")
        {
            var task = {reward:parseInt(awardData.rate),time:parseFloat(awardData.time)};
            storage.addAddRateTask(task);
            this.game.initShouYi();

            res.showToast(awardData.tips);
        }

        this.btn_choujiang.interactable = true;
        this.btn_vedio_lingqu.node.active = false;
        this.btn_lingqu.node.active = false;
        this.updateUI();
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
            sdk.showVedio(function(r){
                if(r)
                {
                    self.lingqu(true);
                }
            });
            cc.qianqista.event("抽奖_2倍领取");
        }

        storage.playSound(res.audio_button);
        cc.log(data);
    }


});
