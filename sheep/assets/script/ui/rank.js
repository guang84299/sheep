var storage = require("storage");
var res = require("res");
var sdk = require("sdk");

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

        this.scroll1 = cc.find("box/scroll1",this.bg);
        this.scroll2 = cc.find("box/scroll2",this.bg);
        this.scroll3 = cc.find("box/scroll3",this.bg);

        this.item1 = cc.find("item",this.scroll1);
        this.item2 = cc.find("item",this.scroll2);
        this.item3 = cc.find("item",this.scroll3);

        this.content1 = cc.find("view/content",this.scroll1);
        this.content2 = cc.find("view/content",this.scroll2);
        this.content3 = cc.find("view/content",this.scroll3);

        this.me_rank = cc.find("me/rank",this.scroll3).getComponent(cc.Label);
        this.me_lingqu = cc.find("me/lingqu",this.scroll3).getComponent(cc.Button);

        var self = this;
        cc.qianqista.rankScore(function(res2){
            self.worldrank = res2.data;
            self.open1();
        });

        this.maxRank = storage.getMaxRank();
    },

    updateUI: function()
    {

    },

    open1: function()
    {
        this.scroll1.active = true;
        this.scroll2.active = false;
        this.scroll3.active = false;

        this.addItem1();
    },

    open2: function()
    {
        this.scroll1.active = false;
        this.scroll2.active = true;
        this.scroll3.active = false;

        this.addItem2();
    },

    open3: function()
    {
        this.scroll1.active = false;
        this.scroll2.active = false;
        this.scroll3.active = true;

        if(!this.yesRank)
        {
            this.yesRank = storage.getYesRank();
            this.me_rank.string = "我的排名："+this.yesRank;

            this.awardId = -1;
            var yestime = storage.getYesRankTime();
            var now = new Date().getTime();
            if(this.yesRank != 0 && res.isRestTime(yestime,now))
            {
                for(var i=0;i<res.conf_rankAward.length;i++)
                {
                    var data = res.conf_rankAward[i];
                    if(this.yesRank>=parseInt(data.front) &&
                        this.yesRank<=parseInt(data.back) )
                    {
                        this.awardId = i;
                        break;
                    }
                }
            }

            if(this.awardId == -1)
            {
                this.me_lingqu.interactable = false;
            }
            else
            {
                this.me_lingqu.interactable = true;
            }
        }

        this.addItem3();
    },

    addItem1: function()
    {
        var n = this.content1.childrenCount;
        if(n<this.worldrank.length)
        {
            var data = this.worldrank[n];
            var item = cc.instantiate(this.item1);
            item.active = true;

            var rank = cc.find("rank",item).getComponent(cc.Label);
            var name = cc.find("name",item).getComponent(cc.Label);
            var score = cc.find("score",item).getComponent(cc.Label);
            var icon = cc.find("icon",item);

            rank.string = data.id;
            name.string = storage.getLabelStr(data.nick,8);
            score.string = storage.castNum(data.score);
            res.loadPic(data.avatarUrl,icon);

            this.content1.addChild(item);

            this.scheduleOnce(this.addItem1.bind(this),0.1);
        }
    },

    addItem2: function()
    {
        var n = this.content2.childrenCount;
        if(n<res.conf_rankUp.length)
        {
            var data = res.conf_rankUp[n];
            var item = cc.instantiate(this.item2);
            item.active = true;
            item.tid = data.id;

            var desc1 = cc.find("desc1",item).getComponent(cc.Label);
            var desc2 = cc.find("desc2",item).getComponent(cc.Label);
            var state = cc.find("state",item).getComponent(cc.Label);
            var lingqu = cc.find("lingqu",item);
            lingqu.tid = data.id;

            desc1.string = data.tips1;
            desc2.string = data.tips2;
            state.string = "未完成";
            if(storage.isRankUp(data.id))
            {
                state.string = "已完成";
            }
            else
            {
                if(this.maxRank!=0 && this.maxRank<=parseInt(data.back))
                {
                    lingqu.active = true;
                }
            }

            this.content2.addChild(item);

            this.scheduleOnce(this.addItem2.bind(this),0.1);
        }
    },

    addItem3: function()
    {
        var n = this.content3.childrenCount;
        if(n<res.conf_rankAward.length)
        {
            var data = res.conf_rankAward[n];
            var item = cc.instantiate(this.item3);
            item.active = true;

            var desc = cc.find("desc",item).getComponent(cc.Label);
            var desc1 = cc.find("desc1",item).getComponent(cc.Label);
            var desc2 = cc.find("desc2",item).getComponent(cc.Label);
            var desc3 = cc.find("desc3",item).getComponent(cc.Label);

            desc.string = data.head;
            desc1.string = data.title1;
            desc2.string = data.title2;
            desc3.string = data.title3;

            this.content3.addChild(item);

            this.scheduleOnce(this.addItem3.bind(this),0.1);
        }
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


        cc.qianqista.event("排行_打开");

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


    lingqu2: function(tid)
    {
        var item = this.content2.children[tid-1];
        var state = cc.find("state",item).getComponent(cc.Label);
        var lingqu = cc.find("lingqu",item);

        lingqu.active = false;
        state.string = "已领取";

        var data = res.conf_rankUp[tid-1];
        var award = parseInt(data.reward)*this.game.getSecVal();
        this.game.addCoin(award);

        storage.addRankUp(parseInt(data.id));
        storage.uploadRankUp();

        res.showToast("金币+"+storage.castNum(award));
    },

    lingqu3: function()
    {
        this.me_lingqu.interactable = false;

        var data = res.conf_rankAward[this.awardId];
        var award = parseInt(data.reward1)*this.game.getSecVal();
        this.game.addCoin(award);

        //data.reward2 = parseInt(data.reward2);
        //data.reward3 = parseFloat(data.reward3);
        //data.time1 = parseFloat(data.time1);
        //data.time2 = parseFloat(data.time2);
        //data.speedLimit = parseFloat(data.speedLimit);

        storage.setYesRankTime(new Date().getTime());

        var task1 = {reward:parseInt(data.reward2),time:parseFloat(data.time1)};
        var task2 = {reward:parseFloat(data.reward3),time:parseFloat(data.time2)};
        storage.addAddRateTask(task1);
        storage.addAddSpeedTask(task2);

        this.game.initShouYi();

        res.showToast("金币+"+storage.castNum(award));
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "toggle")
        {
            if(event.target.name == "toggle1")
                this.open1();
            else if(event.target.name == "toggle2")
                this.open2();
            else if(event.target.name == "toggle3")
                this.open3();
        }
        else if(data == "lingqu2")
        {
            this.lingqu2(event.target.tid);
            cc.qianqista.event("排行_领取2");
        }
        else if(data == "lingqu3")
        {
            this.lingqu3();
            cc.qianqista.event("排行_领取3");
        }

        storage.playSound(res.audio_button);
        cc.log(data);
    }


});
