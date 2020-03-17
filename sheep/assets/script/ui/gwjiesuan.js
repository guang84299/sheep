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

        this.btn_lingqu = cc.find("btns/lingqu",this.bg).getComponent(cc.Button);
        this.btn_lingqu2 = cc.find("btns/lingqu2",this.bg).getComponent(cc.Button);

        this.btn_lingqu.mcolor = this.btn_lingqu.node.color;
        this.btn_lingqu2.mcolor = this.btn_lingqu2.node.color;

        this.items = [];
        for(var i=1;i<=3;i++)
        {
            var item = cc.find("item"+i,this.bg);
            item.active = false;
            this.items.push(item);
        }
    },

    updateUI: function()
    {
        var item = this.items[this.awardType-1];
        item.active = true;
        var coin = cc.find("coin",item).getComponent(cc.Label);
        coin.string = storage.castNum(this.award);


        this.useShare = false;
        if(cc.GAME.share)
        {
            var rad = parseInt(cc.GAME.gwjiesuanAd);
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
        var award =this.award;
        if(x2) award *= 2;
        this.game.addCoin(award);
        res.showToast("金币+"+storage.castNum(award));

        this.hide();

        cc.res.showCoinAni();
    },

    show: function(data)
    {
        this.award = data.award;
        this.awardType = data.type;

        //this.main.wxQuanState(false);
        this.game = cc.find("Canvas").getComponent("main");
        this.node.sc = this;
        this.node.zIndex = 10001;
        this.initUI();
        this.updateUI();

        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));
        var self = this;
        cc.sdk.showBanner(20009,this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

        cc.qianqista.event("薅羊毛结算_打开");
    },

    hide: function()
    {
        //this.game.updateRed();
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

        res.getUI("garglewool").resetUI();
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.lingqu();
        }
        else if(data == "lingqu")
        {
            this.lingqu();
            cc.qianqista.event("薅羊毛结算_直接领取");
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
                },"gwjiesuan");

                cc.qianqista.event("薅羊毛结算_分享领取");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                },10011);
                cc.qianqista.event("薅羊毛结算_视频领取");
            }


        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
