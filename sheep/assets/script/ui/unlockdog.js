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

        this.coinicon = cc.find("btns/lingqu/lay/coin",this.bg);
        this.coinnum = cc.find("btns/lingqu/lay/num",this.bg).getComponent(cc.Label);
        this.btn_lingqu = cc.find("btns/lingqu",this.bg).getComponent(cc.Button);
        this.btn_lingqu2 = cc.find("btns/lingqu2",this.bg).getComponent(cc.Button);

        this.dogcard = cc.find("box/dogcard",this.bg);

        this.btn_lingqu2.mcolor = this.btn_lingqu2.node.color;

    },

    updateUI: function()
    {
        var conf = cc.res.conf_ranch[this.index-1];
        this.award = Number(conf.dogCost);
        if(this.index>1)
            this.award = this.game.boxs[this.index-1].sc.getUnlockCost()*this.award;
        this.isUseCoin = true;
        if(conf.costType == "1") this.isUseCoin = false;

        this.btn_lingqu.node.active = true;
        this.btn_lingqu2.node.active = false;

        this.coinnum.string = storage.castNum(this.award);

        if(this.isUseCoin)
        {
            cc.res.setSpriteFrameAtlas("images/common","coin",this.coinicon);
        }
        else
        {
            cc.res.setSpriteFrameAtlas("images/common","diamond",this.coinicon);
        }

        cc.res.setSpriteFrame("images/dogcard/card_"+storage.getDogCard(),this.dogcard);
        //else
        //{
        //    this.btn_lingqu.node.active = false;
        //    this.btn_lingqu2.node.active = true;
        //
        //    this.useShare = false;
        //    if(cc.GAME.share)
        //    {
        //        var rad = parseInt(cc.GAME.unlockdogAd);
        //        if(Math.random()*100 < rad)
        //        {
        //            this.useShare = true;
        //            this.btn_lingqu2.node.getChildByName("share").active = true;
        //            this.btn_lingqu2.node.getChildByName("video").active = false;
        //        }
        //        else
        //        {
        //            this.btn_lingqu2.node.getChildByName("share").active = false;
        //            this.btn_lingqu2.node.getChildByName("video").active = true;
        //        }
        //    }
        //    else
        //    {
        //        this.btn_lingqu2.node.getChildByName("share").active = false;
        //        this.btn_lingqu2.node.getChildByName("video").active = true;
        //    }
        //}

    },

    lingqu: function(x2)
    {
        var award = this.award;
        if(!this.isUseCoin)
        {
            if(this.game.diamond>=award)
            {
                this.game.addDiamond(-award);
                this.game.boxs[this.index-1].sc.tounlockdog();
                res.showToast("解锁成功！");
                this.hide();

                cc.qianqista.event("解锁牧羊犬_"+this.index);
            }
            else
            {
                res.showToast("钻石不足！");
            }
        }
        else
        {
            if(this.game.coin>=award)
            {
                this.game.addCoin(-award);
                this.game.boxs[this.index-1].sc.tounlockdog();
                res.showToast("解锁成功！");
                this.hide();

                cc.qianqista.event("解锁牧羊犬_"+this.index);
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
        var self = this;
        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    //self.game.updateYindao();
                })
            ));



        if(this.game.yindao == 2)
        {
            this.node.opacity = 0;
            this.lingqu();
            this.hide();
        }
        else
        {
            if(this.index>4)
            {
                cc.sdk.showSpot();
            }
            else
            {
                cc.sdk.showBanner(this.bg,function(dis){
                    if(dis<0)
                        self.bg.y -= dis;
                });
            }

        }

        cc.qianqista.event("解锁牧羊犬_打开");
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


        if(this.game.yindao == 2)
        {
            this.game.updateYindao();
            this.node.destroy();
        }
        else
        {

        }

        if(this.index<=4)
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
                },"unlockdog");
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
