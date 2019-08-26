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
        //this.title = cc.find("title",this.bg).getComponent(cc.Label);

        this.coin_val = cc.find("coin",this.bg).getComponent(cc.Label);

        this.btn_lingqu2 = cc.find("btns/lingqu2",this.bg).getComponent(cc.Button);
    },

    updateUI: function()
    {
        this.coin_val.string = storage.castNum(this.award);

        this.useShare = false;
        if(cc.GAME.share)
        {
            var rad = parseInt(cc.GAME.lixianAd);
            if(!cc.GAME.hasVideo) rad = 100;
            if(Math.random()*100 < rad)
            {
                this.useShare = true;
                this.btn_lingqu2.node.getChildByName("share").active = true;
                this.btn_lingqu2.node.getChildByName("video").active = false;
            }
            else
            {
                this.btn_lingqu2.node.getChildByName("share").active = false;
                this.btn_lingqu2.node.getChildByName("video").active = true;
            }
        }
        else
        {
            this.btn_lingqu2.node.getChildByName("share").active = false;
            this.btn_lingqu2.node.getChildByName("video").active = true;
        }
    },

    lingqu: function(x2)
    {
        var award = this.award;
        if(x2) award *= 5;
        this.game.addCoin(award);
        this.hide();
        cc.res.showCoinAni();
    },

    show: function(award)
    {
        this.award = award;
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
        cc.sdk.showBanner();

        cc.qianqista.event("离线收益_打开");
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
            this.lingqu();
            this.hide();
        }
        else if(data == "lingqu")
        {
            this.lingqu();
            cc.qianqista.event("离线收益_直接领取");
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
                },"lixian");

                cc.qianqista.event("离线收益_分享领取");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                });
                cc.qianqista.event("离线收益_视频领取");
            }

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
