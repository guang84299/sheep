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

        this.coinnum = cc.find("box/num",this.bg).getComponent(cc.Label);
        this.btn_lingqu2 = cc.find("btns/lingqu2",this.bg).getComponent(cc.Button);

        this.btn_lingqu2.mcolor = this.btn_lingqu2.node.color;

    },

    updateUI: function()
    {
        this.award = this.game.getSecVal()*100;
        this.useShare = false;
        if(cc.GAME.share)
        {
            var rad = parseInt(cc.GAME.freecoinAd);
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

        this.coinnum.string = storage.castNum(this.award);
    },

    lingqu: function(x2)
    {
        var award = this.award;
        //if(x2) award *= 2;
        this.game.addCoin(award);

        res.showToast("金币+"+storage.castNum(award));
        this.updateUI();

        cc.res.showCoinAni();

        this.hide();
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
        cc.sdk.showBanner(20007,this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

        cc.qianqista.event("免费金币_打开");
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
                },"qiandao");

                cc.qianqista.event("免费金币_分享领取");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                },10007);

                cc.qianqista.event("免费金币_视频领取");
            }

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
