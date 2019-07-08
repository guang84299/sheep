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

        this.items = cc.find("box/items",this.bg).children;
        this.btn_lingqu = cc.find("box/lingqu",this.bg).getComponent(cc.Button);
        this.btn_lingqu2 = cc.find("box/lingqu2",this.bg).getComponent(cc.Button);
    },

    updateUI: function()
    {
        var loginDay = storage.getLoginDay();
        var qiandaoNum = storage.getQianDaoNum();
        this.qiandaoNum = qiandaoNum;
        var canSign = false;
        if(loginDay>qiandaoNum && qiandaoNum<7)
        {
            canSign = true;
        }

        for(var i=0;i<this.items.length;i++)
        {
            var item = this.items[i];
            var award = cc.find("award",item).getComponent(cc.Label);
            var desc = cc.find("desc",item).getComponent(cc.Label);

            var data = res.conf_qiandao[i];

            award.string = storage.castNum(Number(data.reward));
            if(i==qiandaoNum)
            {
                if(canSign)
                    item.color = cc.color(0,255,0);
            }
            else if(i<qiandaoNum)
            {
                item.color = cc.color(255,0,0);
            }
            else
            {
                item.color = cc.color(180,180,180);
            }
        }

        this.btn_lingqu.interactable = canSign;
        this.btn_lingqu2.interactable = canSign;
    },

    lingqu: function(x2)
    {
        var award = Number(res.conf_qiandao[this.qiandaoNum].reward);
        if(x2) award *= 2;
        this.game.addCoin(award);

        storage.setQianDaoNum((this.qiandaoNum+1));
        storage.uploadQianDaoNum();

        res.showToast("金币+"+storage.castNum(award));
        this.updateUI();

        this.game.task.updateUI();
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
            this.hide();
        }
        else if(data == "lingqu")
        {
            this.lingqu();
        }
        else if(data == "lingqu2")
        {
            var self = this;
            cc.sdk.showVedio(function(r){
                if(r)
                {
                    self.lingqu(true);
                }
            });

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
