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
        this.title = cc.find("title",this.bg).getComponent(cc.Label);
        this.buoyIcon = cc.find("box/buoyIcon",this.bg);
        this.pro =  cc.find("box/pro",this.bg).getComponent(cc.ProgressBar);
        this.buoyDesc = cc.find("box/buoyDesc",this.bg).getComponent(cc.Label);

        this.icon1_val = cc.find("box/icon1/val",this.bg).getComponent(cc.Label);
        this.icon1_val2 = cc.find("box/icon1/val2",this.bg).getComponent(cc.Label);
        this.icon2_val = cc.find("box/icon2/val",this.bg).getComponent(cc.Label);
        this.icon2_val2 = cc.find("box/icon2/val2",this.bg).getComponent(cc.Label);
        this.icon3_val = cc.find("box/icon3/val",this.bg).getComponent(cc.Label);
        this.icon3_val2 = cc.find("box/icon3/val2",this.bg).getComponent(cc.Label);
        this.icon4_val = cc.find("box/icon4/val",this.bg).getComponent(cc.Label);
        this.icon4_val2 = cc.find("box/icon4/val2",this.bg).getComponent(cc.Label);

        this.cost = cc.find("box/cost",this.bg).getComponent(cc.Label);
        this.up_rate = cc.find("box/up/rate",this.bg).getComponent(cc.Label);

        this.xrate = 1;
        this.upcost = 0;
        this.uplv = 0;
    },

    updateUI: function()
    {
        var lv = storage.getLevel(this.index);
        this.title.string = "牧场"+this.index+"等级"+lv;

        var nexlLv = this.findNextBuoy(lv);
        res.setSpriteFrame("images/buoy/buoyIcon"+res.conf_base[nexlLv-1].buoyNum,this.buoyIcon);

        this.pro.progress = lv/nexlLv;
        this.buoyDesc.string = "下次增加剪刀要达到"+nexlLv+"级";

        var nlv = lv+1;
        if(nlv>res.conf_base.length) nlv = res.conf_base.length;

        this.icon1_val.string = res.conf_base[lv-1].growSpeed+"秒";
        this.icon1_val2.string = (Number(res.conf_base[nlv-1].growSpeed)-Number(res.conf_base[lv-1].growSpeed)).toFixed(2)+"秒";

        var pice = Number(res.conf_price[lv-1]["price"+this.index]);
        var pice2 = Number(res.conf_price[nlv-1]["price"+this.index]);

        this.icon2_val.string = storage.castNum(pice);
        this.icon2_val2.string = "+"+storage.castNum(pice2-pice);

        this.icon3_val.string = res.conf_base[lv-1].buoyNum;
        this.icon3_val2.string = "+"+(Number(res.conf_base[nlv-1].buoyNum)-Number(res.conf_base[lv-1].buoyNum));

        this.icon4_val.string = res.conf_base[lv-1].buoySpeed;
        this.icon4_val2.string = "+"+(Number(res.conf_base[nlv-1].buoySpeed)-Number(res.conf_base[lv-1].buoySpeed)).toFixed(2);

        if(this.xrate == 1)
        {
            var costDate = this.getCost(lv,1);
            this.cost.string = storage.castNum(costDate.cost);
            this.up_rate.string = "升级X"+costDate.n;
            this.upcost = costDate.cost;
            this.uplv = costDate.n;
        }
        else if(this.xrate == 2)
        {
            var costDate = this.getCost(lv,10);
            this.cost.string = storage.castNum(costDate.cost);
            this.up_rate.string = "升级X"+costDate.n;
            this.upcost = costDate.cost;
            this.uplv = costDate.n;
        }
        else if(this.xrate == 3)
        {
            var costDate = this.getCost(lv,100);
            this.cost.string = storage.castNum(costDate.cost);
            this.up_rate.string = "升级X"+costDate.n;
            this.upcost = costDate.cost;
            this.uplv = costDate.n;
        }
    },

    findNextBuoy: function(lv)
    {
        var nlv = lv;
        var currNum = res.conf_base[lv-1].buoyNum;
        for(var i=lv;i<res.conf_base.length;i++)
        {
            if(currNum != res.conf_base[i].buoyNum)
            {
                nlv = i+1;
                break;
            }
        }
        return nlv;
    },

    getCost: function(lv,num)
    {
        var cost = 0;
        var n = 0;
        for(var i=0;i<num;i++)
        {
            if(lv+i<res.conf_cost.length)
            {
                var c = Number(res.conf_cost[lv+i]["ranch"+this.index]);
                if(this.game.coin>=cost+c)
                {
                    cost += c;
                    n++;
                }
                else
                {
                    break;
                }
            }
            else
            break;
        }
        return {cost:cost,n:n};
    },

    lvup: function()
    {
        if(this.game.coin>=this.upcost && this.uplv>0)
        {
            this.game.addCoin(-this.upcost);
            var lv = storage.getLevel(this.index);
            storage.setLevel(this.index,lv+this.uplv);
            storage.uploadLevel(this.index);
            this.updateUI();
            this.game.lvupBox(this.index);
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
        cc.sdk.showBanner();

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
        else if(data == "rate")
        {
            if(event.target.name == "toggle1")
                this.xrate = 1;
            else if(event.target.name == "toggle2")
                this.xrate = 2;
            else
                this.xrate = 3;
            this.updateUI();
        }
        else if(data == "up")
        {
            this.lvup();
        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
