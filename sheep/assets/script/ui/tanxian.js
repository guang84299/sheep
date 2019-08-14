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
                this.num.string = this.num.string+"("+storage.getCountDown(now,txTime,3)+")";
                this.scheduleOnce(this.updateUI.bind(this),1);
            }
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
                storage.setTxTime(new Date().getTime()+60*60*1000);
            }
            storage.setTxNum(num-1);
            storage.uploadTxNum();
            res.openUI("tanxiangame");
            this.hide();

            this.game.updateRed();
        }
        else
        {
            res.showToast("剩余次数为0！");
        }
    },

    show: function(jisuandata)
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
        cc.sdk.showBanner(this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

        if(jisuandata)
        {
            res.openUI("tanxianjiesuan",null,jisuandata);
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
                },"qiandao");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                });
            }

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
