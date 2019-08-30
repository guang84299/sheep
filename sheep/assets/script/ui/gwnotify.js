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


        this.items = [];
        for(var i=1;i<=2;i++)
        {
            var item = cc.find("item"+i,this.bg);
            item.active = false;
            this.items.push(item);
        }

        this.loadData();
    },

    loadData: function()
    {
        var self = this;
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
                self.updateUI();
            }
            else
            {
                res.showToast("数据获取失败！");
                self.hide();
            }
        });
    },

    updateUI: function()
    {
        var hundun = storage.getGwhudun();

        var d = this.datas[0];
        var data = {type:1,coin:0,name: d.nick,head: d.avatarUrl,state:1};

        if(hundun>0)
        {
            storage.setGwhudun(hundun-1);
            storage.uploadGwhudun();
            data.type = 0;
        }
        var secval = this.game.getSecVal();
        data.coin = secval*(Math.random()*20+10);

        var gwxiaotou = storage.getGwxiaotou();
        gwxiaotou.push(data);
        storage.setGwxiaotou(gwxiaotou);

        storage.setGwxiaotouTime(new Date().getTime());

        if(data.type == 1)
        {
            var item = this.items[0];
            item.active = true;
            var coin = cc.find("coin",item).getComponent(cc.Label);
            coin.string = storage.castNum(data.coin);
        }
        else
        {
            var item = this.items[1];
            item.active = true;
        }
    },

    lingqu: function(x2)
    {
        res.openUI("garglewool");

        this.scheduleOnce(function(){res.openUI("gwxiaotou");},0.1);


        this.hide();
    },

    show: function(data)
    {

        //this.main.wxQuanState(false);
        this.game = cc.find("Canvas").getComponent("main");
        this.node.sc = this;
        this.initUI();
        //this.updateUI();

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

        cc.qianqista.event("薅羊毛通知_打开");
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
            self.lingqu(true);
            cc.qianqista.event("薅羊毛通知_薅回来");
        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
