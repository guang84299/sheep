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
        this.lvs = [];
        for(var i=1;i<=3;i++)
        {
            var btn = cc.find("box/btn"+i,this.bg).getComponent(cc.Button);
            this.btns.push(btn);

            var lv = cc.find("box/lv"+i,this.bg).getComponent(cc.Label);
            this.lvs.push(lv);
        }

        this.coin_label = cc.find("box/coin",this.bg).getComponent(cc.Label);
    },

    updateUI: function()
    {
        this.coin_label.string = storage.castNum(this.award);
        var tlv = this.game.totalLvNum;
        var nickName = this.game.getNikeName(tlv);
        res.setSpriteFrameAtlas("images/name",nickName,this.namesp);

        var num = 0;
        if(nickName>=9) num+=1;
        if(nickName>=19) num+=1;
        if(nickName>=30) num+=1;

        var alvs = [9,19,30];

        var lingquNum = storage.getNameUp();
        for(var i=0;i<this.btns.length;i++)
        {
            var btn = this.btns[i];
            if(num>i && lingquNum<num && lingquNum<i+1)
            {
                btn.interactable = true;
                this.lvs[i].string = "0";
            }
            else
            {
                btn.interactable = false;

                if(lingquNum>i)
                {
                    this.lvs[i].string = "0";
                    cc.res.setSpriteFrame("images/nameup/yilingqu",btn.node.getChildByName("txt_lingqu"));
                }
                else
                {
                    this.lvs[i].string = parseInt(cc.res.conf_achievement[alvs[i]-1].condition) - tlv;
                }
            }
        }
    },

    lingqu: function(x2)
    {
        var lingquNum = storage.getNameUp();

        var award = 50*(lingquNum+1);
        //if(x2) award *= 2;
        this.game.addDiamond(award);

        storage.setNameUp(lingquNum+1);
        storage.uploadNameUp();

        res.showToast("钻石+"+storage.castNum(award));
        this.updateUI();


        //cc.res.showCoinAni();
    },

    sharelingqu: function()
    {
        this.game.addCoin(this.award);
        res.showToast("金币+"+storage.castNum(this.award));
        cc.res.showCoinAni();

        cc.find("btns/lingqu2",this.bg).getComponent(cc.Button).interactable = false;
    },

    show: function()
    {

        //this.main.wxQuanState(false);
        this.game = cc.find("Canvas").getComponent("main");
        this.node.sc = this;

        this.award = this.game.getSecVal()*100;

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

        cc.qianqista.event("等级成长_打开");
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
        var self = this;
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "share")
        {
            cc.sdk.share(function(r){
                if(r)
                {
                    self.sharelingqu();
                }
            },"nameup");
        }
        else if(data == "lingqu")
        {
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
