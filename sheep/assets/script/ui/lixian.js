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

        this.btn_lingqu2 = cc.find("btns/lingqu2",this.bg);
    },

    updateUI: function()
    {
        this.coin_val.string = storage.castNum(this.award);

        this.btn_lingqu2.active = cc.GAME.share;
    },

    lingqu: function(x2)
    {
        var award = this.award;
        if(x2) award *= 2;
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
        }
        else if(data == "lingqu2")
        {
            var self = this;
            cc.sdk.share(function(r){
                if(r)
                {
                    self.lingqu(true);
                }
            },"lixian");

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
