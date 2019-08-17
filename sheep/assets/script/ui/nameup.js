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

        this.namesp = cc.find("box/name",this.bg);

        this.btns = [];
        for(var i=1;i<=3;i++)
        {
            var btn = cc.find("box/btn"+i,this.bg).getComponent(cc.Button);
            this.btns.push(btn);
        }

    },

    updateUI: function()
    {
        var tlv = this.game.totalLvNum;
        var nickName = this.game.getNikeName(tlv);
        res.setSpriteFrameAtlas("images/name",nickName,this.namesp);

        var num = 0;
        if(nickName>=9) num+=1;
        if(nickName>=19) num+=1;
        if(nickName>=30) num+=1;

        var lingquNum = storage.getNameUp();
        for(var i=0;i<this.btns.length;i++)
        {
            var btn = this.btns[i];
            if(num>i && lingquNum<num && lingquNum<i+1)
            {
                btn.interactable = true;
            }
            else
            {
                btn.interactable = false;
            }
        }
    },

    lingqu: function(x2)
    {
        var award = 500;
        //if(x2) award *= 2;
        this.game.addDiamond(award);

        var lingquNum = storage.getNameUp();
        storage.setNameUp(lingquNum+1);
        storage.uploadNameUp();

        res.showToast("钻石+"+storage.castNum(award));
        this.updateUI();


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
        else if(data == "share")
        {
            cc.sdk.share(function(r){
                if(r)
                {

                }
            },"nameup");
        }
        else if(data == "lingqu")
        {
            var self = this;
            self.lingqu(true);
            //if(this.useShare)
            //{
            //    cc.sdk.share(function(r){
            //        if(r)
            //        {
            //            self.lingqu(true);
            //        }
            //    },"nameup");
            //}
            //else
            //{
            //    cc.sdk.showVedio(function(r){
            //        if(r)
            //        {
            //            self.lingqu(true);
            //        }
            //    });
            //}

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
