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

        this.load = cc.find("load",this.node);
        this.loading = cc.find("load/loading",this.node);

        this.tili = cc.find("bottom/tilibg/num",this.bg).getComponent(cc.Label);
        this.hudun = cc.find("bottom/hudunbg/num",this.bg).getComponent(cc.Label);
        this.xiaotou = cc.find("bottom/xiaotoubg/num",this.bg).getComponent(cc.Label);

        this.tiliadd = cc.find("bottom/tilibg/add",this.bg);
        this.hudunadd = cc.find("bottom/hudunbg/add",this.bg);


        this.headbox = cc.find("headbox",this.bg);
        this.bottom = cc.find("bottom",this.bg);

        this.loadData();
    },

    updateUI: function()
    {
        var tili = storage.getGwtili();
        var hudun = storage.getGwhudun();
        this.tili.string = tili;
        this.hudun.string = hudun;

        var xiaotoudata = storage.getGwxiaotou();
        var xiaotou = 0;
        for(var i=0;i<xiaotoudata.length;i++)
        {
            if(xiaotoudata[i].state == 1) xiaotou+=1;
        }
        this.xiaotou.string = xiaotou;

        this.useShare = false;
        if(tili<=0)
        {
            this.tiliadd.active = true;

            if(cc.GAME.share)
            {
                var rad = parseInt(cc.GAME.gwtiliAd);
                if(!cc.GAME.hasVideo) rad = 100;
                if(Math.random()*100 < rad)
                {
                    this.useShare = true;
                    this.tiliadd.getChildByName("share").active = true;
                    this.tiliadd.getChildByName("video").active = false;
                }
                else
                {
                    this.tiliadd.getChildByName("share").active = false;
                    this.tiliadd.getChildByName("video").active = true;
                }
            }
            else
            {
                this.tiliadd.getChildByName("share").active = false;
                this.tiliadd.getChildByName("video").active = true;
            }
        }
        else
        {
            this.tiliadd.active = false;
        }

        this.useShare2 = false;
        if(hudun<=0)
        {
            this.hudunadd.active = true;

            if(cc.GAME.share)
            {
                var rad = parseInt(cc.GAME.gwhudunAd);
                if(!cc.GAME.hasVideo) rad = 100;
                if(Math.random()*100 < rad)
                {
                    this.useShare2 = true;
                    this.hudunadd.getChildByName("share").active = true;
                    this.hudunadd.getChildByName("video").active = false;
                }
                else
                {
                    this.hudunadd.getChildByName("share").active = false;
                    this.hudunadd.getChildByName("video").active = true;
                }
            }
            else
            {
                this.hudunadd.getChildByName("share").active = false;
                this.hudunadd.getChildByName("video").active = true;
            }
        }
        else
        {
            this.hudunadd.active = false;
        }
    },

    loadData: function()
    {
        this.load.active = true;
        this.loading.stopAllActions();
        this.loading.runAction(cc.repeatForever(cc.rotateBy(1,360)));

        var self = this;
        this.datas = [];
        if(cc.GAME.gwdatas.length>0)
        {
            this.datas = cc.GAME.gwdatas;
            self.load.active = false;
            self.updateItem();
        }
        else
        {
            cc.qianqista.randRobot(function(r){
                if(r.state == 200)
                {
                    var datas = r.data;
                    for(var i=0;i<datas.length;i++)
                    {
                        if(datas[i].openid == cc.qianqista.openid)
                        {
                            datas.splice(i,1);
                            break;
                        }
                    }
                    self.datas = datas;
                    cc.GAME.gwdatas = datas;
                    self.load.active = false;
                    self.updateItem();
                }
                else
                {
                    res.showToast("数据获取失败！");
                    self.hide();
                }
            });
        }

    },

    updateItem: function()
    {
        var headbox = cc.find("headbox",this.bg);
        var head = cc.find("head",headbox);
        var name = cc.find("name",headbox).getComponent(cc.Label);
        var coinnum = cc.find("coinnum",headbox).getComponent(cc.Label);

        this.maxIndex = Math.floor(Math.random()*3)+1;
        this.items = [];
        this.isAni = false;

        if(this.datas.length >= 2)
        {
            var secval = this.game.getSecVal();

            if(this.maxIndex == 1)
            {
                this.datas[0].award = secval*30;
                this.datas[1].award = secval*20;
                this.datas[2].award = secval*10;
            }
            else if(this.maxIndex == 2)
            {
                this.datas[0].award = secval*10;
                this.datas[1].award = secval*30;
                this.datas[2].award = secval*20;
            }
            else
            {
                this.datas[0].award = secval*10;
                this.datas[1].award = secval*20;
                this.datas[2].award = secval*30;
            }


            res.loadPic(this.datas[this.maxIndex-1].avatarUrl,head);
            name.string = storage.getLabelStr(this.datas[this.maxIndex-1].nick,12);
            coinnum.string = storage.castNum(this.datas[this.maxIndex-1].award);

            var itempos = [cc.v2(-150,100),cc.v2(150,100),cc.v2(0,-150)];
            for(var i=1;i<=3;i++)
            {
                var item = cc.find("nodesel/item"+i,this.bg);
                item.tid = i;
                item.position = itempos[i-1];
                item.opacity = 255;
                if(i<3) item.scale = 0.9;
                else item.scale = 1;

                var namebg = cc.find("namebg",item);
                var head = cc.find("head",namebg);
                var name = cc.find("name",namebg).getComponent(cc.Label);
                var coin = cc.find("coin",item).getComponent(cc.Label);
                var index = cc.find("index",item);
                var dun = cc.find("dun",item);

                namebg.active = false;
                coin.node.active = false;
                index.active = true;
                dun.active = false;

                item.namebg = namebg;
                item.index = index;
                item.coin = coin;
                item.dun = dun;

                res.loadPic(this.datas[i-1].avatarUrl,head);
                name.string = storage.getLabelStr(this.datas[i-1].nick,12);
                coin.string = storage.castNum(this.datas[i-1].award);

                this.items.push(item);
            }
        }
        else
        {
            res.showToast("数据获取失败！");
            this.hide();
        }
    },

    selItem: function(tid)
    {
        if(this.isAni) return;

        var tili = storage.getGwtili();
        if(tili<=0)
        {
            res.showToast("体力不足！");
            return;
        }
        else
        {
            storage.setGwtili(tili-1);
            storage.uploadGwtili();
        }

        this.isAni = true;
        cc.GAME.gwdatas = [];

        var self = this;

        for(var i=1;i<=3;i++)
        {
            var item = this.items[i-1];
            item.index.active = false;

            if(i != tid)
            {
                item.namebg.active = true;
                item.namebg.scaleX = 0;
                item.namebg.runAction(cc.scaleTo(0.5,1,1).easing(cc.easeSineIn()));

                var coin = item.coin.node;
                coin.active = true;
                coin.opacity = 0;
                coin.runAction(cc.sequence(
                    cc.delayTime(1),
                    cc.moveBy(0,0,80),
                    cc.fadeIn(0.1),
                    cc.moveBy(0.5,0,-80).easing(cc.easeBackIn())
                ));

                item.runAction(cc.sequence(
                    cc.delayTime(2),
                    cc.fadeOut(0.1)
                ));
            }
            else
            {
                item.runAction(cc.sequence(
                    cc.delayTime(2),
                    cc.spawn(
                        cc.scaleTo(1,1.2).easing(cc.easeSineIn()),
                        cc.moveTo(1,0,0).easing(cc.easeSineIn())
                    ),
                    cc.callFunc(function(){
                        item = self.items[tid-1];

                        item.namebg.active = true;
                        item.namebg.scaleX = 0;
                        item.namebg.runAction(cc.scaleTo(0.5,1,1).easing(cc.easeSineIn()));

                        var coin = item.coin.node;
                        coin.active = true;
                        coin.opacity = 0;
                        coin.runAction(cc.sequence(
                            cc.delayTime(1),
                            cc.moveBy(0,0,80),
                            cc.fadeIn(0.1),
                            cc.moveBy(0.5,0,-80).easing(cc.easeBackIn()),
                            cc.delayTime(1),
                            cc.callFunc(function(){
                                self.judgeWin(tid);
                            })
                        ));
                    })
                ));
            }
        }

        this.updateUI();
    },

    judgeWin: function(tid)
    {
        var win = this.maxIndex == tid ? 1 : 0;
        var r = Math.random();
        if(cc.GAME.gwdunrand)
        {
            if(cc.GAME.gwdunrand>2) r = 0.5;
            cc.GAME.gwdunrand += 1;
        }
        else
        {
            cc.GAME.gwdunrand = 1;
        }

        var dun = r <= 0.2 ? 1 : 0;

        if(dun == 1)
        {
            var item = this.items[tid-1];
            item.dun.active = true;
        }
        res.openUI("gwjudge",null,{win:win,award:this.datas[tid-1].award,dun:dun});

        this.headbox.active = false;
        this.bottom.active = false;
    },

    addtili: function()
    {
        var tili = storage.getGwtili();
        storage.setGwtili(tili+4);
        storage.uploadGwtili();
        this.updateUI();
    },

    addhudun: function()
    {
        var hudun = storage.getGwhudun();
        storage.setGwhudun(hudun+1);
        storage.uploadGwhudun();
        this.updateUI();
    },

    resetUI: function()
    {
        this.headbox.active = true;
        this.bottom.active = true;
        this.loadData();
        this.updateUI();
    },

    show: function()
    {

        this.game = cc.find("Canvas").getComponent("main");
        this.node.sc = this;
        this.initUI();
        this.updateUI();

        this.node.active = true;

        cc.qianqista.event("薅羊毛_打开");

        if(this.game.yindao == 12)
        {
            this.game.destoryYindao();
        }
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
        //cc.sdk.hideBanner();
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "item")
        {
            this.selItem(event.target.tid);
        }
        else if(data == "openxiaotou")
        {
            res.openUI("gwxiaotou");
        }
        else if(data == "addtili")
        {
            var self = this;
            if(this.useShare)
            {
                cc.sdk.share(function(r){
                    if(r)
                    {
                        self.addtili(true);
                    }
                },"garglewool");

                cc.qianqista.event("薅羊毛_分享加体力");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.addtili(true);
                    }
                });

                cc.qianqista.event("薅羊毛_视频加体力");
            }

        }
        else if(data == "addhudun")
        {
            var self = this;
            if(this.useShare2)
            {
                cc.sdk.share(function(r){
                    if(r)
                    {
                        self.addhudun(true);
                    }
                },"garglewool");

                cc.qianqista.event("薅羊毛_分享加护盾");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.addhudun(true);
                    }
                });

                cc.qianqista.event("薅羊毛_视频加护盾");
            }

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
