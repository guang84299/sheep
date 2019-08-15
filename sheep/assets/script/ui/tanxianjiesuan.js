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

        this.coinnum = cc.find("box/coinnum",this.bg).getComponent(cc.Label);
        this.diamondnum = cc.find("box/diamondnum",this.bg).getComponent(cc.Label);
        this.woolnum = cc.find("box/woolnum",this.bg).getComponent(cc.Label);
        this.feednum = cc.find("box/feednum",this.bg).getComponent(cc.Label);
        this.orenum = cc.find("box/orenum",this.bg).getComponent(cc.Label);
        this.chartnum = cc.find("box/chartnum",this.bg).getComponent(cc.Label);

        this.wool = cc.find("box/wool",this.bg);
        this.feed = cc.find("box/feed",this.bg);
        this.ore = cc.find("box/ore",this.bg);
        this.chart = cc.find("box/chart",this.bg);

        this.acoin = this.getAwardByType(1)*this.game.getSecVal()*(Math.floor(Math.random()*6)+10);
        this.adiamon = this.getAwardByType(2)*(Math.floor(Math.random()*3)+1);
        this.awool = this.getAwardByType(5);
        this.afeed = this.getAwardByType(6);
        this.aore = this.getAwardByType(7);
        this.achart = this.getAwardByType(8);

        if(this.acoin>0) this.game.addCoin(this.acoin);
        if(this.adiamon>0) this.game.addDiamond(this.adiamon);
        if(this.awool>0)
        {
            var data =  this.getAwardDataByType(5);
            var num = storage.getCailiao(data.type-4,data.id);
            storage.setCailiao(data.type-4,data.id,num+this.awool);
            res.setSpriteFrameAtlas("images/main","car_mao"+(parseInt(data.img)+1),this.wool);
        }
        if(this.afeed>0)
        {
            var data =  this.getAwardDataByType(6);
            var num = storage.getCailiao(data.type-4,data.id);
            storage.setCailiao(data.type-4,data.id,num+this.afeed);
            res.setSpriteFrame("images/cailiao/sl/"+data.img,this.feed);
        }
        if(this.aore>0)
        {
            var data =  this.getAwardDataByType(7);
            var num = storage.getCailiao(data.type-4,data.id);
            storage.setCailiao(data.type-4,data.id,num+this.aore);
            res.setSpriteFrame("images/cailiao/ks/"+data.img,this.ore);
        }
        if(this.achart>0)
        {
            var data =  this.getAwardDataByType(8);
            var num = storage.getCailiao(data.type-4,data.id);
            storage.setCailiao(data.type-4,data.id,num+this.achart);
            res.setSpriteFrame("images/cailiao/tz/"+data.img,this.chart);
        }
    },

    updateUI: function()
    {
        this.coinnum.string = "+"+storage.castNum(this.acoin);
        this.diamondnum.string =  "+"+storage.castNum(this.adiamon);
        this.woolnum.string =  "+"+this.awool;
        this.feednum.string =  "+"+this.afeed;
        this.orenum.string =  "+"+this.aore;
        this.chartnum.string =  "+"+this.achart;
    },

    getAwardByType: function(type)
    {
        var val = 0;
        if(this.jisuandata)
        {
            for(var i=0;i<this.jisuandata.length;i++)
            {
                var d = this.jisuandata[i];
                if(d.type == type)
                {
                    val+=1;
                }
            }
        }

        return val;
    },

    getAwardDataByType: function(type)
    {
        var data = null;
        if(this.jisuandata)
        {
            for(var i=0;i<this.jisuandata.length;i++)
            {
                var d = this.jisuandata[i];
                if(d.type == type)
                {
                    data = d;
                    break;
                }
            }
        }

        return data;
    },


    show: function(jisuandata)
    {
        this.jisuandata = jisuandata;
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
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                });
            }

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
