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

    },

    updateUI: function()
    {
        this.coin_val.string = this.judgeUnLockNum();
    },

    judgeUnLockNum: function()
    {
        var lv = this.index;
        var lock = this.game.unLock;
        if(lock<30 && lv<=30)
        {
            var tlv = 0;
            for(var i=1;i<=lock;i++)
            {
                tlv += cc.storage.getLevel(i);
            }

            return parseInt(cc.res.conf_grade[lv-1].condition) - tlv;
        }
        return 0;
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

        cc.qianqista.event("牧场提示_打开");
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
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
