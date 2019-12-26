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

        this.icon1_desc = cc.find("box/icon1/desc",this.bg).getComponent(cc.Label);
        this.icon1_val = cc.find("box/icon1/val",this.bg).getComponent(cc.Label);
        this.icon2_desc = cc.find("box/icon2/desc",this.bg).getComponent(cc.Label);
        this.icon2_val = cc.find("box/icon2/val",this.bg).getComponent(cc.Label);

    },

    updateUI: function()
    {
        this.icon1_desc.string = "无";
        this.icon1_val.string = "0秒";

        this.icon2_desc.string = "无";
        this.icon2_val.string = "0秒";

        if(this.game.rateTask.length>0)
        {
            var now = new Date().getTime();
            if(this.game.rateTask.length>1)
            {
                //找到时间最长的
                var to = now;
                for(var i=0;i<this.game.rateTask.length;i++)
                {
                    var task = this.game.rateTask[i];
                    if(task.to>to)
                    {
                        to = task.to;
                    }
                }
                this.icon1_desc.string = "当前收益"+this.game.shouYiRate+"倍";
                this.icon1_val.string =  storage.getCountDown(now,to,3);
            }
            else
            {
                var task = this.game.rateTask[0];
                if(now<task.to)
                {
                    this.icon1_desc.string = task.tip;
                    this.icon1_val.string =  storage.getCountDown(now,task.to,3);
                }
            }

        }

        if(this.game.speedTask.length>0)
        {
            var now = new Date().getTime();
            var task = this.game.speedTask[0];
            if(now<task.to)
            {
                this.icon2_desc.string = task.tip;

                this.icon2_val.string = storage.getCountDown(now,task.to,3);
            }
        }
    },

    show: function(index)
    {
        this.index = index;
        cc.log(index);
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

        this.upDt = 0;
        //storage.playSound(res.audio_win);
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

        storage.playSound(res.audio_button);
        cc.log(data);
    },

    update: function(dt)
    {
        this.upDt += dt;
        if(this.upDt>1)
        {
            this.upDt = 0;
            this.updateUI();
        }
    }

    
});
