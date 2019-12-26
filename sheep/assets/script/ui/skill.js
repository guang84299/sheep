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

        this.btn_lingqu2 = cc.find("btns/lingqu2",this.bg).getComponent(cc.Button);

        this.btn_lingqu2.mcolor = this.btn_lingqu2.node.color;

    },

    updateUI: function()
    {
        this.useShare = false;
        //if(cc.GAME.share)
        //{
        //    var rad = parseInt(cc.GAME.skillAd);
        //    if(Math.random()*100 < rad)
        //    {
        //        this.useShare = true;
        //        this.btn_lingqu2.node.getChildByName("share").active = true;
        //        this.btn_lingqu2.node.getChildByName("video").active = false;
        //    }
        //    else
        //    {
        //        this.btn_lingqu2.node.getChildByName("share").active = false;
        //        this.btn_lingqu2.node.getChildByName("video").active = true;
        //    }
        //}
        //else
        //{
        //    this.btn_lingqu2.node.getChildByName("share").active = false;
        //    this.btn_lingqu2.node.getChildByName("video").active = true;
        //}
        this.btn_lingqu2.node.getChildByName("share").active = false;
        this.btn_lingqu2.node.getChildByName("video").active = true;
    },

    lingqu: function(x2)
    {
        var time = 30.0/(60*60);
        var to = new Date().getTime() + time*60*60*1000;
        var task = {reward:7,time:time,tip:"30秒7倍收益",to:to};
        storage.addAddRateTask(task);
        this.game.initShouYi();

        res.showToast(task.tip);

        //this.updateUI();

        this.hide();
        //cc.res.showCoinAni();
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
        cc.sdk.showBanner(this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

        cc.qianqista.event("超级技能_打开");

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
                },"skill");

                cc.qianqista.event("超级技能_分享使用");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                });
                cc.qianqista.event("超级技能_视频使用");
            }

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
