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
        this.pro = cc.find("box/pro",this.bg).getComponent(cc.ProgressBar);
        this.btn_lingqu2 = cc.find("btns/lingqu2",this.bg).getComponent(cc.Button);

        this.btn_lingqu2.mcolor = this.btn_lingqu2.node.color;

        this.heads = [];
        for(var i=1;i<=6;i++)
        {
            var head = cc.find("box/head"+i,this.bg);
            this.heads.push(head);
        }

        var self = this;
        cc.qianqista.datas(function(res){
            console.log('my datas:', res);
            var datas = res.data;
            if(res.state == 200 && datas)
            {
                if(datas.hasOwnProperty("gjiabeilist"))
                    cc.gjiabeilist = datas.gjiabeilist;
                self.updateHead();
            }
        });

        this.updateHead();
    },

    updateHead: function()
    {
        for(var i=0;i<6;i++)
        {
            if(i<cc.gjiabeilist.length)
            {
                cc.res.setSpriteFrameAtlas("images/shouyifanbei","touxiang",this.heads[i]);
            }
            else
            {
                cc.res.setSpriteFrameAtlas("images/shouyifanbei","touxiangkuang",this.heads[i]);
            }
        }
        this.pro.progress = cc.gjiabeilist.length/6;

        if(cc.gjiabeilist.length>0)
        {
            var rate = 2;
            var tips = "1人助力2倍收益";
            if(cc.gjiabeilist.length>=6)
            {
                rate = 4;
                tips = "6人助力4倍收益";
            }
            else if(cc.gjiabeilist.length>=3)
            {
                rate = 3;
                tips = "3人助力3倍收益";
            }

            var mt = new Date();
            mt.setHours(23);
            mt.setMinutes(59);
            mt.setSeconds(59);

            var time = (mt.getTime() - new Date().getTime())/(60*60*1000.0);

            var ishave = false;
            var isupdate = false;
            var rateTasks = storage.getAddRateTask();
            for(var i=0;i<rateTasks.length;i++)
            {
                var rateTask = rateTasks[i];
                if(rateTask.tip.indexOf("助力") != -1)
                {
                    ishave = true;
                    if(rateTask.reward != rate)
                    {
                        rateTasks[i].reward = rate;
                        rateTasks[i].time = time;
                        rateTasks[i].tip = tips;
                        storage.updateAddRateTask(rateTasks);
                        isupdate = true;
                    }
                    break;
                }
            }

            if(!ishave)
            {
                var to = new Date().getTime() + time*60*60*1000;
                var task = {reward:rate,time:time,tip:tips,to:to};
                storage.addAddRateTask(task);
            }

            if(!ishave || isupdate)
            {
                this.game.initShouYi();
            }
        }


    },

    updateUI: function()
    {
        //this.award = this.game.getSecVal()*60;
        this.useShare = true;
        this.btn_lingqu2.node.getChildByName("share").active = true;
        this.btn_lingqu2.node.getChildByName("video").active = false;


    },

    lingqu: function(x2)
    {
        var award = this.award;
        //if(x2) award *= 2;
        this.game.addCoin(award);

        res.showToast("金币+"+storage.castNum(award));
        this.updateUI();

        cc.res.showCoinAni();
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
                        //self.lingqu(true);
                    }
                },"shouyifanbei");
            }
            else
            {
                cc.sdk.showVedio(function(r){
                    if(r)
                    {
                        //self.lingqu(true);
                    }
                });
            }

        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
