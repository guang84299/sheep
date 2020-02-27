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

        this.title = cc.find("biaoti/titlebg/num",this.bg).getComponent(cc.Label);
        //this.yang = cc.find("box/yang",this.bg).getComponent(cc.Label);
        //this.dao = cc.find("box/dao",this.bg).getComponent(cc.Label);
        this.yangIcon = cc.find("box7/yangIcon",this.bg);
        this.daoIcon = cc.find("box7/daoIcon",this.bg);

        var boxIndex = this.index;
        if(boxIndex<2) boxIndex = 2;
        if(boxIndex>7) boxIndex = 7;

        this.box = cc.find("box"+boxIndex,this.bg);
        this.box.active = true;
    },

    updateUI: function()
    {
        this.title.string = this.index;
        //this.yang.string = "牧场"+this.index+"可培育新羊";
        //this.dao.string = "牧场"+this.index+"可研发新刀";

        var awardLabel = null;
        var data = cc.res.conf_compose[this.index-1];
        if(this.index>=7)
        {
            var sheepConf = cc.config.sheepAnim[parseInt(data.newSheep)];
            res.setSpriteFrame("images/sheepIcon/sheepIcon"+sheepConf.lv,this.yangIcon);

            var sp = this.daoIcon.getComponent("sp.Skeleton");
            sp.setSkin("ani_"+data.newKnife);
        }
        else
         awardLabel = cc.find("ditu/award",this.box).getComponent(cc.Label);

        //var sp = cc.res["sheep_buoy.plist"].getSpriteFrame("buoyIcon"+data.newKnife+"_1");
        //this.daoIcon.getComponent(cc.Sprite).spriteFrame = sp;

        var now = new Date().getTime();

        for(var i=0;i<6;i++)
        {
            var num = parseInt(data["reward"+(i+1)]);
            if(num>0)
            {
                var cailiaoId = 0;
                if(i==1)
                {
                    cailiaoId = parseInt(data.wool);
                }
                else if(i==2)
                {
                    cailiaoId = parseInt(data.feed);
                }
                else if(i==3)
                {
                    cailiaoId = parseInt(data.ore);
                }
                else if(i==4)
                {
                    cailiaoId = parseInt(data.chart);
                }
                else if(i==5)
                {
                    if(awardLabel)
                        awardLabel.string = parseInt(num);
                }
                if(i>0 && i<5)
                {

                    storage.setCailiao(i,cailiaoId,storage.getCailiao(i,cailiaoId)+num);
                    storage.setCailiaoTime(i,cailiaoId,now);
                    //storage.uploadCailiao(i);
                }
                else
                {
                    if(i ==0)
                        this.game.addDiamond(num);
                    else
                    {
                        this.game.addCoin(num);
                    }
                }
            }

        }
    },

    lingqu: function(x2)
    {
        this.isClickLvup = true;
        cc.res.openUI("lvup",null,this.index);
        this.hide();
    },

    show: function(index)
    {
        this.index = index;
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


        if(this.game.yindao == 1)
        {
            this.node.opacity = 0;
            this.hide();
        }
        else
        {
            if(this.index>4)
            {
                cc.sdk.showSpot();
            }
            else
            {
                var self = this;
                cc.sdk.showBanner(20025,this.bg,function(dis){
                    if(dis<0)
                        self.bg.y -= dis;
                });
            }

        }

        cc.qianqista.event("解锁牧场_"+index);
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


        if(this.game.yindao == 1)
        {
            this.game.updateYindao(2);
        }
        else if(this.game.yindao == 5)
        {
            if(!this.isClickLvup)
            {
                this.game.updateYindao(6);
            }
            else
            {
                this.game.needYindaodoglock = true;
            }
        }

        if(this.index>2)
            this.game.click(null,"down");

        if(this.index == 3 && !this.isClickLvup)
        {
            this.game.openXiaotou(3);
            this.game.scheduleOnce(function(){
                res.openUI("yindao",null,8);
            },0.2);

        }
        else
        {
            if(this.index == 3)
                this.game.needYindaoxiaotou = true;
        }

        if(this.index == 4 && !this.isClickLvup)
        {
            res.openUI("yindao",null,10);
        }
        else
        {
            if(this.index == 4)
                this.game.needYindaodog = true;
        }

        if(this.index == 5 && !this.isClickLvup)
        {
            res.openUI("yindao",null,11);
        }
        else
        {
            if(this.index == 5)
                this.game.needYindaotanxian = true;
        }

        if(this.index == 6 && !this.isClickLvup)
        {
            res.openUI("yindao",null,12);
        }
        else
        {
            if(this.index == 6)
                this.game.needYindaogarglewool = true;
        }

        if(this.index<=4)
        {
            cc.sdk.hideBanner();
        }

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
            self.lingqu(true);
            //if(this.useShare)
            //{
            //    cc.sdk.share(function(r){
            //        if(r)
            //        {
            //            self.lingqu(true);
            //        }
            //    },"qiandao");
            //}
            //else
            //{
            //    cc.sdk.showVedio(function(r){
            //        if(r)
            //        {
            //            self.lingqu(true);
            //        }
            //    });
            //}

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
