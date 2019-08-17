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

        //this.title = cc.find("title",this.bg).getComponent(cc.Label);
        //this.yang = cc.find("box/yang",this.bg).getComponent(cc.Label);
        //this.dao = cc.find("box/dao",this.bg).getComponent(cc.Label);
        this.yangIcon = cc.find("box/yangIcon",this.bg);
        this.daoIcon = cc.find("box/daoIcon",this.bg);
        this.awards = cc.find("box/awards",this.bg).children;
        this.btn_lingqu2 = cc.find("btns/lingqu2",this.bg).getComponent(cc.Button);

        this.btn_lingqu2.mcolor = this.btn_lingqu2.node.color;

    },

    updateUI: function()
    {
        //this.title.string = "恭喜解锁牧场"+this.index;
        //this.yang.string = "牧场"+this.index+"可培育新羊";
        //this.dao.string = "牧场"+this.index+"可研发新刀";

        var data = cc.res.conf_compose[this.index-1];
        var sheepConf = cc.config.sheepAnim[parseInt(data.newSheep)];
        if(this.index == 1)
        {
            this.btn_lingqu2.node.active = false;
            res.setSpriteFrame("images/sheepIcon/sheepIcon1",this.yangIcon);
        }
        else
            res.setSpriteFrame("images/sheepIcon/sheepIcon"+sheepConf.lv,this.yangIcon);

        //var sp = cc.res["sheep_buoy.plist"].getSpriteFrame("buoyIcon"+data.newKnife+"_1");
        //this.daoIcon.getComponent(cc.Sprite).spriteFrame = sp;

        var sp = this.daoIcon.getComponent("sp.Skeleton");
        sp.setSkin("ani_"+data.newKnife);


        var now = new Date().getTime();

        for(var i=0;i<this.awards.length;i++)
        {
            var item = this.awards[i];
            var num = parseInt(data["reward"+(i+1)]);
            if(num>0)
            {
                item.active = true;
                var icon = cc.find("icon",item);
                var award = cc.find("award",item).getComponent(cc.Label);
                var cailiaoId = 0;
                if(i==1)
                {
                    award.string = "新羊毛*"+num;
                    cailiaoId = parseInt(data.wool);
                    cc.res.setSpriteFrameAtlas("images/main","car_mao"+(parseInt(data.woolImage)+1),icon);
                }
                else if(i==2)
                {
                    award.string = "新饲料*"+num;
                    cailiaoId = parseInt(data.feed);
                    cc.res.setSpriteFrame("images/cailiao/sl/"+data.feedImage,icon);
                }
                else if(i==3)
                {
                    award.string = "新矿石*"+num;
                    cailiaoId = parseInt(data.ore);
                    cc.res.setSpriteFrame("images/cailiao/ks/"+data.oreImage,icon);
                }
                else if(i==4)
                {
                    award.string = "新图纸*"+num;
                    cailiaoId = parseInt(data.chart);
                    cc.res.setSpriteFrame("images/cailiao/tz/"+data.chartImage,icon);
                }

                if(i>0)
                {

                    storage.setCailiao(i,cailiaoId,storage.getCailiao(i,cailiaoId)+num);
                    storage.setCailiaoTime(i,cailiaoId,now);
                    //storage.uploadCailiao(i);
                }
                else
                {
                    this.game.addDiamond(num);
                }
            }
            else
            {
                item.active = false;
            }
        }
    },

    lingqu: function(x2)
    {
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
        var self = this;
        cc.sdk.showBanner(this.bg,function(dis){
            if(dis<0)
                self.bg.y -= dis;
        });

        this.game.hideYindao();

        if(this.game.yindao == 14)
        {
            this.game.updateYindao();
            cc.res.openUI("yindao");
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
        cc.sdk.hideBanner();

        this.game.updateYindao();
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
