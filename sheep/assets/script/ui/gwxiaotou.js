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

        this.boxs = cc.find("box",this.bg).children;

    },

    updateUI: function()
    {
        var datas = storage.getGwxiaotou();

        for(var i=0;i<this.boxs.length;i++)
        {
            var box = this.boxs[i];
            if(datas.length>i)
            {
                box.active = true;

                var data = datas[i];

                var desc1 = cc.find("desc1",box);
                var desc2 = cc.find("desc2",box);
                var head = cc.find("head",box);
                var name = cc.find("name",box).getComponent(cc.Label);
                var coinnum = cc.find("coinnum",box).getComponent(cc.Label);
                var lingqu = cc.find("lingqu",box);
                var mask = cc.find("mask",box);

                if(data.type == 1)
                {
                    desc1.active = true;
                    desc2.active = false;
                    coinnum.string = storage.castNum(data.coin);
                }
                else
                {
                    desc1.active = false;
                    desc2.active = true;
                    coinnum.string = "";
                }

                res.loadPic(data.head,head);
                name.string = storage.getLabelStr(data.name,12);

                if(data.state == 1)
                {
                    lingqu.active = true;
                    mask.active = false;
                }
                else
                {
                    lingqu.active = false;
                    mask.active = true;
                }

                lingqu.tid = i;
            }
            else
            {
                box.active = false;
            }
        }
    },

    item: function(tid)
    {
        res.openUI("gwfanji",null,tid);
        this.hide();
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
        cc.sdk.showBanner(20011,this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

        cc.qianqista.event("薅羊毛小偷_打开");
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
        else if(data == "item")
        {
            var self = this;
            self.item(event.target.tid);

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
