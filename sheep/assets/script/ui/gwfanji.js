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
        this.node_hao = cc.find("node_hao",this.node);

        this.timeLabel = cc.find("timebg/time",this.node_hao).getComponent(cc.Label);
        this.pro = cc.find("pro",this.node_hao).getComponent(cc.ProgressBar);
        this.btn_haota = cc.find("buttondi/haota",this.node);

        this.pro.progress = 0;
    },

    updateUI: function()
    {
        var item = cc.find("item",this.node_hao);

        var namebg = cc.find("namebg",item);
        var head = cc.find("head",namebg);
        var name = cc.find("name",namebg).getComponent(cc.Label);
        var coin = cc.find("coin",item).getComponent(cc.Label);

        res.loadPic(this.data.head,head);
        name.string = storage.getLabelStr(this.data.name,12);
        coin.string = storage.castNum(this.award);
    },

    haota: function()
    {
        if(this.node_hao.active)
        {
            var p = this.pro.progress;
            p += 1/30;
            if(p>1) p = 1;
            this.pro.progress = p;

            this.btn_haota.scaleY = 0.8;
        }
        else
        {
            this.hide();
        }
    },

    update: function(dt)
    {
        if(this.node_hao.active)
        {
            if(this.dtime>0)
            {
                this.upDt += dt;
                if(this.upDt>=1)
                {
                    this.upDt = 0;
                    this.dtime -= 1;
                    this.timeLabel.string = this.dtime;
                    if(this.dtime<=0)
                    {
                        this.hide();
                    }
                }

                this.proDt += dt;
                if(this.proDt>0.2)
                {
                    this.proDt = 0;
                    var p = this.pro.progress;
                    p -= 1/60.0;
                    if(p<0) p = 0;
                    this.pro.progress = p;
                }
            }

            if(this.btn_haota.scaleY != 1)
            {
                this.btnDt += dt;
                if(this.btnDt>0.1)
                {
                    this.btnDt = 0;
                    this.btn_haota.scaleY = 1;
                }
            }
        }


    },

    show: function(index)
    {
        this.game = cc.find("Canvas").getComponent("main");

        this.index = index;
        var datas = storage.getGwxiaotou();
        this.data = datas[index];
        datas[index].state = 0;
        storage.setGwxiaotou(datas);

        var secval = this.game.getSecVal();
        this.award = secval*(Math.random()*20+10);


        this.node.sc = this;
        this.node.zIndex = 10001;
        this.upDt = 0;
        this.dtime = 15;
        this.proDt = 0;
        this.btnDt = 0;
        this.initUI();
        this.updateUI();

        this.node.active = true;

        cc.qianqista.event("薅羊毛反击_打开");
    },

    hide: function()
    {
        //this.main.wxQuanState(true);
        var self = this;
        this.node.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    self.node.destroy();
                })
            ));
        //cc.sdk.hideBanner();

        if(this.node_hao.active)
        {
            var p = this.pro.progress;
            var type = 1;
            if(p<0.8 && p>= 0.5) type = 2;
            else if(p<0.5) type = 3;

            res.openUI("gwjiesuan",null,{type:type,award:this.award*p});
        }
        else
        {
            res.getUI("garglewool").resetUI();
        }
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "haota")
        {
            this.haota();
        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
