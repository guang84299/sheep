var storage = require("storage");
var res = require("res");

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad: function()
    {
        this.initUI();
    },

    initUI: function()
    {
        this.mask = cc.find("mask",this.node);
        this.hand = cc.find("hand",this.node);

        this.hand.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5,0.3).easing(cc.easeSineIn()),
            cc.scaleTo(0.5,0.4).easing(cc.easeSineIn())
        )));
        this.updateYindao();
    },

    updateYindao: function()
    {
        this.scheduleOnce(this.updateUI.bind(this),0.1);
    },

    updateUI: function()
    {
        if(this.game.yindao == 1)
        {
            var box = this.game.boxs[0].getChildByName("box");
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            pos.y -= box.height/2;
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 2 || this.game.yindao == 6 || this.game.yindao == 10)
        {
            var box = this.game.task.node;
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            pos.x += box.width/2;
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 3)
        {
            var box = cc.find("head/carvup",this.game.scrollContent);
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 4)
        {
            var box = cc.find("ui_carvup/bg/box/up1",this.game.node);
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 5)
        {
            var box = cc.find("ui_carvup/bg/close",this.game.node);
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 7)
        {
            var box = cc.find("head/carhup",this.game.scrollContent);
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 8)
        {
            var box = cc.find("ui_carhup/bg/box/up1",this.game.node);
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 9)
        {
            var box = cc.find("ui_carhup/bg/close",this.game.node);
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 11)
        {
            var box = this.game.boxs[0].getChildByName("box_lvup");
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 12)
        {
            var box = cc.find("ui_lvup/bg/box/up1",this.game.node);
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 13)
        {
            var box = cc.find("ui_lvup/bg/close",this.game.node);
            var pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.mask.setContentSize(box.getContentSize());
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
        }
        else if(this.game.yindao == 14)
        {
            this.hide();
        }
    },


    show: function()
    {
        this.game = cc.find("Canvas").getComponent("main");
        this.node.sc = this;


        this.node.active = true;
    },

    hide: function()
    {
        this.node.destroy();
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }

        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
