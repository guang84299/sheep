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

        this.coinicon = cc.find("box/coin",this.bg);
        this.coinnum = cc.find("box/num",this.bg).getComponent(cc.Label);
        this.btn_lingqu = cc.find("btns/lingqu",this.bg).getComponent(cc.Button);
        this.btn_lingqu2 = cc.find("btns/lingqu2",this.bg).getComponent(cc.Button);

        this.btn_lingqu2.mcolor = this.btn_lingqu2.node.color;

    },

    updateUI: function()
    {
        this.isUseCoin = true;
        if(this.isUseCoin)
        {
            this.coinicon.active = true;
            this.coinnum.node.active = true;
            this.btn_lingqu.active = true;
            this.btn_lingqu2.active = false;

            this.award = this.game.getSecVal()*60;
            this.coinnum.string = storage.castNum(this.award);
        }
        else
        {
            this.coinicon.active = false;
            this.coinnum.node.active = false;
            this.btn_lingqu.active = false;
            this.btn_lingqu2.active = true;

            this.useShare = false;
            if(cc.GAME.share)
            {
                var rad = parseInt(cc.GAME.freecoinAd);
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
        }

    },

    lingqu: function(x2)
    {
        if(x2)
        {
            this.game.boxs[this.index-1].sc.tounlockdog();
            res.showToast("解锁成功！");
            this.hide();
        }
        else
        {
            var award = this.award;
            if(this.game.coin>=award)
            {
                this.game.addCoin(-award);
                this.game.boxs[this.index-1].sc.tounlockdog();
                res.showToast("解锁成功！");
                this.hide();
            }
            else
            {
                res.showToast("金币不足！");
            }
        }

        //this.updateUI();

        //cc.res.showCoinAni();
    },

    show: function(index)
    {
        this.index = index;
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
        else if(data == "lingqu")
        {
            this.lingqu();
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
