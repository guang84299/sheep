var storage = require("storage");
var res = require("res");

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

        this.tili = cc.find("box/tililay/tili",this.bg).getComponent(cc.Label);
        this.level = cc.find("box/levellay/level",this.bg).getComponent(cc.Label);
        this.num = cc.find("box/numlay/num",this.bg).getComponent(cc.Label);
        this.timeLabel = cc.find("box/numlay/time",this.bg).getComponent(cc.Label);

        this.btn_enter = cc.find("btns/enter",this.bg);

        var txTime = storage.getTxTime();
        if(txTime==0)
        {
            storage.setTxNum(5);
            storage.uploadTxNum();
        }

    },

    updateUI: function()
    {
        this.tili.string = "30";
        this.level.string = storage.getTxLv();
        this.num.string = storage.getTxNum()+"/5";
        this.timeLabel.string = "";

        var txTime = storage.getTxTime();
        if(txTime>0)
        {
            var now = new Date().getTime();
            if(now>=txTime)
            {
                storage.setTxTime(0);
                storage.setTxNum(5);
                storage.uploadTxNum();
                this.updateUI();
            }
            else
            {
                this.timeLabel.string = "("+storage.getCountDown(now,txTime,3)+")";
                this.scheduleOnce(this.updateUI.bind(this),1);
            }
        }

    },

    updateVedio: function()
    {
        var txNum = storage.getTxNum();
        if(txNum<=0)
        {
            this.btn_enter.getChildByName("state1").active = false;
            var state2 = this.btn_enter.getChildByName("state2");
            state2.active = true;

            this.useShare = false;
            if(cc.GAME.share)
            {
                var rad = parseInt(cc.GAME.txnumAd);
                if(!cc.GAME.hasVideo) rad = 100;
                if(Math.random()*100 < rad)
                {
                    this.useShare = true;
                    state2.getChildByName("share").active = true;
                    state2.getChildByName("video").active = false;
                }
                else
                {
                    state2.getChildByName("share").active = false;
                    state2.getChildByName("video").active = true;
                }
            }
            else
            {
                state2.getChildByName("share").active = false;
                state2.getChildByName("video").active = true;
            }
        }
        else
        {
            this.btn_enter.getChildByName("state1").active = true;
            this.btn_enter.getChildByName("state2").active = false;
        }
    },

    enter: function()
    {
        var num = storage.getTxNum();
        if(num>0)
        {
            var txTime = storage.getTxTime();
            if(txTime == 0)
            {
                storage.setTxTime(new Date().getTime()+5*60*1000);
            }
            storage.setTxNum(num-1);
            storage.uploadTxNum();
            res.openUI("tanxiangame",null,this.index);
            this.hide();

            this.game.updateRed();
        }
        else
        {
            //res.showToast("剩余次数为0！");
            this.click(null,"lingqu2");
        }
    },

    lingqu: function()
    {
        var num = storage.getTxNum();
        storage.setTxNum(num+4);
        storage.uploadTxNum();
        this.updateVedio();
    },

    show: function(jisuandata)
    {
        if(typeof jisuandata == "number")
        {
            this.index = jisuandata;
        }

        //this.main.wxQuanState(false);
        this.game = cc.find("Canvas").getComponent("main");
        this.node.sc = this;
        this.initUI();
        this.updateUI();
        this.updateVedio();

        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));

        var self = this;
        cc.sdk.showBanner(20022,this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

        if(jisuandata && typeof jisuandata == "object")
        {
            res.openUI("tanxianjiesuan",null,jisuandata);
        }

        cc.qianqista.event("探险主界面_打开");

        if(this.game.yindao == 11)
        {
            this.game.destoryYindao();
        }
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

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "enter")
        {
            this.enter();
        }
        else if(data == "award")
        {
            res.openUI("tanxiantask");
        }
        else if(data == "lingqu2")
        {
            var self = this;
            if(this.useShare)
            {
                cc.sdk.share(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                },"tanxian");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                },10026);
            }

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
