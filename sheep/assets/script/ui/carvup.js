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
        this.title = cc.find("title/lvbox/num1",this.bg).getComponent(cc.Label);
        this.buoyIcon = cc.find("box/buoyIcon",this.bg);
        this.pro =  cc.find("box/pro",this.bg).getComponent(cc.ProgressBar);
        this.buoyDesc = cc.find("box/buoyDesc",this.bg).getComponent(cc.Label);

        this.icon1_val = cc.find("box/icon1/val",this.bg).getComponent(cc.Label);
        this.icon1_val2 = cc.find("box/icon1/val2",this.bg).getComponent(cc.Label);
        this.icon2_val = cc.find("box/icon2/val",this.bg).getComponent(cc.Label);
        this.icon2_val2 = cc.find("box/icon2/val2",this.bg).getComponent(cc.Label);

        this.cost10 = cc.find("box/up10/costbg/cost",this.bg).getComponent(cc.Label);
        this.up_rate10 = cc.find("box/up10/desc",this.bg).getComponent(cc.Label);

        this.cost1 = cc.find("box/up1/costbg/cost",this.bg).getComponent(cc.Label);
        this.up_rate1 = cc.find("box/up1/desc",this.bg).getComponent(cc.Label);
    },

    updateUI: function()
    {
        var lv = storage.getCarVLv();
        this.title.string = "lv"+lv;

        //var nexlLv = this.findNextBuoy(lv);
        //
        //this.pro.progress = lv/nexlLv;
        //this.buoyDesc.string = "下次增加车辆要达到"+nexlLv+"级";

        var nlv = lv+1;
        if(nlv>res.conf_truckVic.length) nlv = res.conf_truckVic.length;

        this.icon1_val.string = res.conf_truckVic[lv-1].speed;
        this.icon1_val2.string = "+"+(Number(res.conf_truckVic[nlv-1].speed)-Number(res.conf_truckVic[lv-1].speed)).toFixed(2);

        var pice = Number(res.conf_truckVic[lv-1].capacity);
        var pice2 = Number(res.conf_truckVic[nlv-1].capacity);

        this.icon2_val.string = storage.castNum(pice);
        this.icon2_val2.string = "+"+storage.castNum(pice2-pice);


        var costDate = this.getCost(lv,1);
        this.cost1.string = storage.castNum(costDate.cost);
        this.up_rate1.string = costDate.n;

        var costDate = this.getCost(lv,10);
        this.cost10.string = storage.castNum(costDate.cost);
        this.up_rate10.string = costDate.n;
    },

    findNextBuoy: function(lv)
    {
        var nlv = lv;
        var currNum = res.conf_truckVic[lv-1].num;
        for(var i=lv;i<res.conf_truckVic.length;i++)
        {
            if(currNum != res.conf_truckVic[i].num)
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
            if(lv+i<res.conf_truckVic.length)
            {
                var c = Number(res.conf_truckVic[lv+i].cost);
                cost += c;
                n++;
            }
            else
            break;
        }
        return {cost:cost,n:n};
    },

    lvup: function(rate)
    {
        var lv = storage.getCarVLv();
        var costDate = this.getCost(lv,rate);

        if(costDate.n<1)
        {
            res.showToast("等级已满！");
        }
        else
        {
            if(this.game.coin>=costDate.cost)
            {
                this.game.addCoin(-costDate.cost);

                storage.setCarVLv(lv+costDate.n);
                storage.uploadCarVLv();
                this.updateUI();
                this.game.carvup();
                this.game.updateYindao();
            }
            else
            {
                res.showToast("金币不足！");
                cc.res.openUI("freecoin");
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

        var self = this;
        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    self.game.updateYindao();
                })
            ));
        var self = this;
        cc.sdk.showBanner(this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

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

        this.game.updateYindao();
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "up10")
        {
            this.lvup(10);
        }
        else if(data == "up1")
        {
            this.lvup(1);
        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
