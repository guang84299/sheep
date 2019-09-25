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
        this.icon3_val = cc.find("box/icon3/val",this.bg).getComponent(cc.Label);
        this.icon3_val2 = cc.find("box/icon3/val2",this.bg).getComponent(cc.Label);
        this.icon4_val = cc.find("box/icon4/val",this.bg).getComponent(cc.Label);
        this.icon4_val2 = cc.find("box/icon4/val2",this.bg).getComponent(cc.Label);

        this.cost10 = cc.find("box/up10/costbg/cost",this.bg).getComponent(cc.Label);
        this.up_rate10 = cc.find("box/up10/desc",this.bg).getComponent(cc.Label);

        this.cost1 = cc.find("box/up1/costbg/cost",this.bg).getComponent(cc.Label);
        this.up_rate1 = cc.find("box/up1/desc",this.bg).getComponent(cc.Label);
    },

    updateUI: function()
    {
        var lv = storage.getCarHLv();
        this.title.string = "lv"+lv;

        var nexlLv = this.findNextBuoy(lv);

        this.pro.progress = lv/nexlLv;
        if(Math.abs(nexlLv-lv)<1)
            this.buoyDesc.string = "车辆数量已达最大值！";
        else
            this.buoyDesc.string = "下次增加车辆要达到"+nexlLv+"级";

        var nlv = lv+1;
        if(nlv>res.conf_truckHor.length) nlv = res.conf_truckHor.length;

        this.icon1_val.string = res.conf_truckHor[lv-1].speed;
        this.icon1_val2.string = "+"+(Number(res.conf_truckHor[nlv-1].speed)-Number(res.conf_truckHor[lv-1].speed)).toFixed(2);

        var pice = Number(res.conf_truckHor[lv-1].capacity);
        var pice2 = Number(res.conf_truckHor[nlv-1].capacity);

        this.icon3_val.string = storage.castNum(pice);
        this.icon3_val2.string = "+"+storage.castNum(pice2-pice);

        var carrySpeed = Number(res.conf_truckHor[lv-1].carrySpeed);
        var carrySpeed2 = Number(res.conf_truckHor[nlv-1].carrySpeed);

        this.icon4_val.string = storage.castNum(carrySpeed);
        this.icon4_val2.string = "+"+storage.castNum(carrySpeed2-carrySpeed);


        this.icon2_val.string = res.conf_truckHor[lv-1].num;
        this.icon2_val2.string = "+"+(Number(res.conf_truckHor[nlv-1].num)-Number(res.conf_truckHor[lv-1].num));


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
        var currNum = res.conf_truckHor[lv-1].num;
        for(var i=lv;i<res.conf_truckHor.length;i++)
        {
            if(currNum != res.conf_truckHor[i].num)
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
            if(lv+i<res.conf_truckHor.length)
            {
                var c = Number(res.conf_truckHor[lv+i].cost);
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
        var lv = storage.getCarHLv();
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

                storage.setCarHLv(lv+costDate.n);
                storage.uploadCarHLv();
                this.updateUI();
                this.game.carhup();

                this.isUpLevel = true;
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
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
                //cc.callFunc(function(){
                //    self.game.updateYindao();
                //})
            ));

        if(this.game.yindao == 3)
        {
            this.node.opacity = 0;
            this.lvup(10);
            this.hide();
        }
        else
        {
            cc.sdk.showBanner(this.bg,function(dis){
                if(dis<0)
                    self.bg.y -= dis;
            });
        }

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


        if(this.game.yindao == 3)
        {
            this.game.updateYindao(4);
            this.node.destroy();
        }
        else
        {
            cc.sdk.hideBanner();
        }

        if(this.isUpLevel)
        {
            this.game.carhupAni();
        }
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
