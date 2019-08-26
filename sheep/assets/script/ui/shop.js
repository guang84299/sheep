var storage = require("storage");
var res = require("res");
var sdk = require("sdk");
var config = require("config");

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

        this.top_btn = cc.find("top/btn",this.bg).getComponent(cc.Button);

        this.open1();

        this.upDt = 0;
    },

    updateUI: function()
    {
        var freeDiaNum = storage.getFreeDiaNum();
        if(freeDiaNum != 1)
        {
            this.top_btn.interactable = false;
        }
    },

    open1: function()
    {
        this.scroll1.active = true;
        this.scroll2.active = false;
        this.scroll3.active = false;

        this.data1 = [];
        for(var i=0;i<res.conf_shop.length;i++)
        {
            if(res.conf_shop[i].goodsType == "0")
                this.data1.push(res.conf_shop[i]);
        }
        this.addItem1();
    },

    open2: function()
    {
        this.scroll1.active = false;
        this.scroll2.active = true;
        this.scroll3.active = false;
        this.data2 = [];
        for(var i=0;i<res.conf_shop.length;i++)
        {
            if(res.conf_shop[i].goodsType == "1")
                this.data2.push(res.conf_shop[i]);
        }
        this.addItem2();
    },

    open3: function()
    {
        this.scroll1.active = false;
        this.scroll2.active = false;
        this.scroll3.active = true;

        this.data3 = [];
        for(var i=0;i<res.conf_shop.length;i++)
        {
            if(res.conf_shop[i].goodsType == "2")
                this.data3.push(res.conf_shop[i]);
        }
        this.addItem3();
    },

    addItem1: function()
    {
        var n = this.content1.childrenCount;
        if(n<this.data1.length)
        {
            var val = this.game.getSecVal();

            var data = this.data1[n];
            var item = cc.instantiate(this.item1);
            item.active = true;

            var coin = cc.find("coin",item).getComponent(cc.Label);
            var cost = cc.find("diamondbg/lay/cost",item).getComponent(cc.Label);
            var btn = cc.find("diamondbg",item);
            btn.tid = n;

            coin.string =  storage.castNum(Number(data.goods)*val);
            cost.string = storage.castNum(Number(data.cost));

            this.content1.addChild(item);

            this.scheduleOnce(this.addItem1.bind(this),0.1);
        }
    },

    addItem2: function()
    {
        var n = this.content2.childrenCount;
        if(n<this.data2.length)
        {
            var data = this.data2[n];
            var item = cc.instantiate(this.item2);
            item.active = true;
            item.tid = n;

            var desc = cc.find("desc",item).getComponent(cc.Label);
            var icon = cc.find("icon",item);
            var cost = cc.find("diamondbg/lay/cost",item).getComponent(cc.Label);
            var time = cc.find("time",item).getComponent(cc.Label);
            var diamondbg = cc.find("diamondbg",item);
            diamondbg.tid = n;
            var btn = cc.find("btn",item);
            btn.tid = n;

            desc.string = "收益x"+data.goodsLevel+"倍";
            cost.string = storage.castNum(Number(data.cost));
            cc.res.setSpriteFrameAtlas("images/shop","carv_"+(n+1),icon);

            var t = storage.getShopVcarTime(n);
            item.time = t;
            item.timeLabel = time;

            diamondbg.active = false;
            btn.active = false;
            time.node.active = false;
            if(t>0)
            {
                time.node.active = true;
            }
            else
            {
                if(data.costType == "1")
                {
                    btn.active = true;
                    var adNum = storage.getShopVcarAdNum(n);
                    var btn_str = cc.find("str",btn).getComponent(cc.Label);
                    btn_str.string = "观看"+adNum+"/"+data.cost+"次视频免费";
                }
                else
                {
                    diamondbg.active = true;
                }
            }

            this.content2.addChild(item);

            this.scheduleOnce(this.addItem2.bind(this),0.1);
        }
    },

    updateItem2: function(tid)
    {
        var item = this.content2.children[tid];
        var data = this.data2[tid];

        var t = storage.getShopVcarTime(tid);
        item.time = t;

        var time = cc.find("time",item).getComponent(cc.Label);
        var diamondbg = cc.find("diamondbg",item);
        var btn = cc.find("btn",item);

        diamondbg.active = false;
        btn.active = false;
        time.node.active = false;
        if(t>0)
        {
            time.node.active = true;
        }
        else
        {
            if(data.costType == "1")
            {
                btn.active = true;
                var adNum = storage.getShopVcarAdNum(tid);
                var btn_str = cc.find("str",btn).getComponent(cc.Label);
                btn_str.string = "观看"+adNum+"/"+data.cost+"次视频免费";
            }
            else
            {
                diamondbg.active = true;
            }
        }
    },

    updateItem2Time: function()
    {
        if(this.scroll2.active)
        {
            var n = this.content2.childrenCount;
            var now = new Date().getTime();
            for(var i=0;i<n;i++)
            {
                var item = this.content2.children[i];
                if(item.time>0)
                {
                    if(item.time>now)
                    {
                        item.timeLabel.string = storage.getCountDown(now,item.time);
                    }
                    else
                    {
                        storage.setShopVcarTime(i,0);
                        item.time = 0;

                        this.updateItem2(i);
                    }
                }
            }
        }
    },

    addItem3: function()
    {
        var n = this.content3.childrenCount;
        if(n<this.data3.length)
        {
            var data = this.data3[n];
            var item = cc.instantiate(this.item3);
            item.active = true;

            var desc = cc.find("desc",item).getComponent(cc.Label);
            var icon = cc.find("icon",item);
            var cost = cc.find("diamondbg/lay/cost",item).getComponent(cc.Label);
            var time = cc.find("time",item).getComponent(cc.Label);
            var diamondbg = cc.find("diamondbg",item);
            diamondbg.tid = n;
            var btn = cc.find("btn",item);
            btn.tid = n;

            desc.string = "收益x"+data.goodsLevel+"倍";
            cost.string = storage.castNum(Number(data.cost));
            cc.res.setSpriteFrameAtlas("images/shop","carh_"+(n+1),icon);

            var t = storage.getShopHcarTime(n);
            item.time = t;
            item.timeLabel = time;

            diamondbg.active = false;
            btn.active = false;
            time.node.active = false;
            if(t>0)
            {
                time.node.active = true;
            }
            else
            {
                if(data.costType == "1")
                {
                    btn.active = true;
                    var adNum = storage.getShopHcarAdNum(n);
                    var btn_str = cc.find("str",btn).getComponent(cc.Label);
                    btn_str.string = "观看"+adNum+"/"+data.cost+"次视频免费";
                }
                else
                {
                    diamondbg.active = true;
                }
            }

            this.content3.addChild(item);

            this.scheduleOnce(this.addItem3.bind(this),0.1);
        }
    },

    updateItem3: function(tid)
    {
        var item = this.content3.children[tid];
        var data = this.data3[tid];

        var t = storage.getShopHcarTime(tid);
        item.time = t;

        var time = cc.find("time",item).getComponent(cc.Label);
        var diamondbg = cc.find("diamondbg",item);
        var btn = cc.find("btn",item);

        diamondbg.active = false;
        btn.active = false;
        time.node.active = false;
        if(t>0)
        {
            time.node.active = true;
        }
        else
        {
            if(data.costType == "1")
            {
                btn.active = true;
                var adNum = storage.getShopHcarAdNum(tid);
                var btn_str = cc.find("str",btn).getComponent(cc.Label);
                btn_str.string = "观看"+adNum+"/"+data.cost+"次视频免费";
            }
            else
            {
                diamondbg.active = true;
            }
        }
    },

    updateItem3Time: function()
    {
        if(this.scroll3.active)
        {
            var n = this.content3.childrenCount;
            var now = new Date().getTime();
            for(var i=0;i<n;i++)
            {
                var item = this.content3.children[i];
                if(item.time>0)
                {
                    if(item.time>now)
                    {
                        item.timeLabel.string = storage.getCountDown(now,item.time);
                    }
                    else
                    {
                        storage.setShopHcarTime(i,0);
                        item.time = 0;

                        this.updateItem3(i);
                    }
                }
            }
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

        var self = this;
        cc.sdk.showBanner(this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });
        cc.qianqista.event("商店_打开");

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


    video_dia: function()
    {
        var award = 30;
        this.game.addDiamond(award);
        storage.setFreeDiaNum(0);
        res.showToast("钻石+"+storage.castNum(award));
        this.updateUI();
        this.game.updateRed();
        //cc.res.showCoinAni();
    },

    buycoin: function(tid)
    {
        var data = this.data1[tid];

        var cost = Number(data.cost);
        if(this.game.diamond>=cost)
        {
            var award =  Number(data.goods)*this.game.getSecVal();
            this.game.addCoin(award);
            this.game.addDiamond(-cost);

            res.showToast("金币+"+storage.castNum(award));
            cc.res.showCoinAni();
        }
        else
        {
            res.showToast("钻石不足！");
        }
    },

    buycarv: function(tid)
    {
        var data = this.data2[tid];

        var cost = Number(data.cost);
        if(this.game.diamond>=cost)
        {
            var mt = new Date();
            mt.setHours(23);
            mt.setMinutes(59);
            mt.setSeconds(59);

            var time =  (mt.getTime() - new Date().getTime())/(60*60*1000.0);

            var to = new Date().getTime() + time*60*60*1000;
            var task = {reward:parseFloat(data.goodsLevel),time:time,tip:"采集车加倍",to:to};
            storage.addAddRateTask(task);
            this.game.initShouYi();

            storage.setShopVcarTime(tid,to);
            this.game.addDiamond(-cost);
            this.updateItem2(tid);
        }
        else
        {
            res.showToast("钻石不足！");
        }
    },

    video_carv: function(tid)
    {
        var data = this.data2[tid];
        var adNum = storage.getShopVcarAdNum()+1;
        storage.setShopVcarAdNum(adNum);

        var cost = Number(data.cost);
        if(adNum>=cost)
        {
            var mt = new Date();
            mt.setHours(23);
            mt.setMinutes(59);
            mt.setSeconds(59);

            var time =  (mt.getTime() - new Date().getTime())/(60*60*1000.0);
            var to = new Date().getTime() + time*60*60*1000;
            var task = {reward:parseFloat(data.goodsLevel),time:time,tip:"采集车加倍",to:to};
            storage.addAddRateTask(task);
            this.game.initShouYi();

            storage.setShopVcarTime(tid,to);

        }
        this.updateItem2(tid);
    },

    buycarh: function(tid)
    {
        var data = this.data3[tid];

        var cost = Number(data.cost);
        if(this.game.diamond>=cost)
        {
            this.game.addDiamond(-cost);


            var mt = new Date();
            mt.setHours(23);
            mt.setMinutes(59);
            mt.setSeconds(59);

            var time =  (mt.getTime() - new Date().getTime())/(60*60*1000.0);

            var to = new Date().getTime() + time*60*60*1000;
            var task = {reward:parseFloat(data.goodsLevel),time:time,tip:"运输车加倍",to:to};
            storage.addAddRateTask(task);
            this.game.initShouYi();

            storage.setShopHcarTime(tid,to);
            this.updateItem3(tid);
        }
        else
        {
            res.showToast("钻石不足！");
        }
    },

    video_carh: function(tid)
    {
        var data = this.data3[tid];
        var adNum = storage.getShopHcarAdNum()+1;
        storage.setShopHcarAdNum(adNum);

        var cost = Number(data.cost);
        if(adNum>=cost)
        {
            var mt = new Date();
            mt.setHours(23);
            mt.setMinutes(59);
            mt.setSeconds(59);

            var time =  (mt.getTime() - new Date().getTime())/(60*60*1000.0);
            var to = new Date().getTime() + time*60*60*1000;
            var task = {reward:parseFloat(data.goodsLevel),time:time,tip:"运输车加倍",to:to};
            storage.addAddRateTask(task);
            this.game.initShouYi();

            storage.setShopHcarTime(tid,to);
        }
        this.updateItem3(tid);
    },

    click: function(event,data)
    {
        var self = this;
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
        else if(data == "video_dia")
        {
            sdk.showVedio(function(r){
                if(r)
                {
                    self.video_dia();
                }
            });

            cc.qianqista.event("商店_看视频获得钻石");
        }
        else if(data == "buycoin")
        {
            this.buycoin(event.target.tid);
            cc.qianqista.event("商店_购买金币");
        }
        else if(data == "buycarv")
        {
            this.buycarv(event.target.tid);
            cc.qianqista.event("商店_购买采集车");
        }
        else if(data == "video_carv")
        {
            sdk.showVedio(function(r){
                if(r)
                {
                    self.video_carv(event.target.tid);
                }
            });
            cc.qianqista.event("商店_视频购买采集车");
        }
        else if(data == "buycarh")
        {
            this.buycarh(event.target.tid);
            cc.qianqista.event("商店_购买运输车");
        }
        else if(data == "video_carh")
        {
            sdk.showVedio(function(r){
                if(r)
                {
                    self.video_carh(event.target.tid);
                }
            });
            cc.qianqista.event("商店_视频购买运输车");
        }

        storage.playSound(res.audio_button);
        cc.log(data);
    },

    update: function(dt)
    {
        this.upDt += dt;
        if(this.upDt>1)
        {
            this.upDt = 0;
            this.updateItem2Time();
            this.updateItem3Time();
        }
    }


});
