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

        this.items = cc.find("items",this.bg).children;
        this.btn_lingqu = cc.find("btns/lingqu",this.bg).getComponent(cc.Button);
        this.btn_lingqu2 = cc.find("btns/lingqu2",this.bg).getComponent(cc.Button);

        this.btn_lingqu.mcolor = this.btn_lingqu.node.color;
        this.btn_lingqu2.mcolor = this.btn_lingqu2.node.color;
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
            var desc = cc.find("desc",item);
            var mask = cc.find("mask",item);

            var data = res.conf_qiandao[i];

            if(data.rewrdType == "2")
                award.string = "+1";
            else
                award.string = storage.castNum(Number(data.reward));
            if(i==qiandaoNum)
            {
                if(canSign)
                {
                    mask.active = false;
                    item.getComponent(cc.Button).interactable = true;
                }
            }
            else if(i<qiandaoNum)
            {
                mask.active = true;
                item.getComponent(cc.Button).interactable = false;
            }
            else
            {
                mask.active = false;
                item.getComponent(cc.Button).interactable = true;
            }
        }

        this.btn_lingqu.interactable = canSign;
        this.btn_lingqu2.interactable = canSign;
        if(canSign)
        {
            this.btn_lingqu.node.color = this.btn_lingqu.mcolor;
            this.btn_lingqu2.node.color = this.btn_lingqu2.mcolor;
        }
        else
        {
            this.btn_lingqu.node.color = cc.color(180,180,180);
            this.btn_lingqu2.node.color = cc.color(180,180,180);
        }

        this.useShare = false;
        if(cc.GAME.share)
        {
            var rad = parseInt(cc.GAME.qiandaoAd);
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

        //this.btn_lingqu2.node.active = cc.GAME.share;
    },

    lingqu: function(x2)
    {
        var data = res.conf_qiandao[this.qiandaoNum];
        if(data.rewrdType == "0")
        {
            var award = Number(data.reward);
            if(x2) award *= 2;
            this.game.addCoin(award);
            res.showToast("金币+"+storage.castNum(award));
        }
        else if(data.rewrdType == "1")
        {
            var award = Number(data.reward);
            if(x2) award *= 2;
            this.game.addDiamond(award);
            res.showToast("钻石+"+storage.castNum(award));
        }
        else
        {
            var award = Number(data.reward);
            var carNum = storage.getDogCardNum(award);
            carNum += 1;
            storage.setDogCardNum(award,carNum);
            storage.uploadDogCardNum(award);

            if(award == "4")
                res.showToast("史诗牧羊犬+1");
            else if(award == "5")
                res.showToast("传奇牧羊犬+1");
        }

        storage.setQianDaoNum((this.qiandaoNum+1));
        storage.uploadQianDaoNum();


        this.updateUI();

        this.game.task.updateUI();
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
        var self = this;
        cc.sdk.showBanner(this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

        cc.qianqista.event("签到_打开");
    },

    hide: function()
    {
        this.game.updateRed();
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
            cc.qianqista.event("签到_直接领取");
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

                cc.qianqista.event("签到_分享领取");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                });
                cc.qianqista.event("签到_视频领取");
            }


        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
