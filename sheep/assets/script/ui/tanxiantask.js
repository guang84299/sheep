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
        var taskId = storage.getTxTask();
        var lv = storage.getTxLv();
        var val = this.game.getSecVal();
        var coin = storage.getTxTaskCoin();
        if(coin == 0)
        {
            coin = val*50;
            storage.setTxTaskCoin(coin);
        }
        var diamond = 5;

        for(var i=0;i<this.boxs.length;i++)
        {
            var box = this.boxs[i];
            var desc = cc.find("desc",box).getComponent(cc.Label);
            var desc2 = cc.find("desc2",box).getComponent(cc.Label);
            var state = cc.find("state",box).getComponent(cc.Label);
            var coinnum = cc.find("coinnum",box).getComponent(cc.Label);
            var diamondnum = cc.find("diamondnum",box).getComponent(cc.Label);
            var lingqu = cc.find("lingqu",box);

            desc.string = "通过"+((taskId+i)*5)+"关";
            desc2.string = lv+"/"+((taskId+i)*5);
            coinnum.string = storage.castNum(coin);
            diamondnum.string = diamond;

            lingqu.tid = i;

            if(lv>=(taskId+i)*5)
            {
                if(storage.getTxTaskLq(i) == 1)
                {
                    state.string = "已领取";
                    lingqu.active = false;
                }
                else
                    lingqu.active = true;
            }
            else
            {
                state.string = "未完成";
                lingqu.active = false;
            }
        }
    },

    lingqu: function(tid)
    {
        var coin = storage.getTxTaskCoin();
        this.game.addCoin(coin);
        this.game.addDiamond(5);

        storage.setTxTaskLq(tid,1);

        var b = true;
        for(var i=0;i<4;i++)
        {
            if(storage.getTxTaskLq(i) == 0)
            {
                b = false;
                break;
            }
        }

        if(b)
        {
            var taskId = storage.getTxTask();
            storage.setTxTask(taskId+4);
            for(var i=0;i<4;i++)
                storage.setTxTaskLq(i,0);
            storage.uploadTxTask();
        }

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
        cc.sdk.showBanner();

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
            self.lingqu(event.target.tid);
            //if(this.useShare)
            //{
            //    cc.sdk.share(function(r){
            //        if(r)
            //        {
            //            self.lingqu(true);
            //        }
            //    },"tili");
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
