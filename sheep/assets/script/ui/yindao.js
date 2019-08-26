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
        this.game = cc.find("Canvas").getComponent("main");
        this.desc = cc.find("desc",this.node).getComponent(cc.Label);

        this.hand.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5,0.3).easing(cc.easeSineIn()),
            cc.scaleTo(0.5,0.4).easing(cc.easeSineIn())
        )));
        this.updateYindao();
    },

    updateYindao: function()
    {
        this.node.opacity = 0;
        this.desc.string = "";
        this.scheduleOnce(this.updateUI.bind(this),0);
    },

    updateUI: function()
    {
        this.node.opacity = 255;
        var box = null;
        var pos = null;
        if(this.game.yindao == 1 || this.game.yindao == 2)
        {
            box = this.game.boxs[0].getChildByName("box").getChildByName("border");
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            pos.y -= box.height/2;

            if(this.game.yindao == 2)
            {
                this.desc.string = "点击小羊，让飞刀动起来吧！";
            }
        }
        else if(this.game.yindao == 3)
        {
            box = cc.find("box_dog/lock/btn1",this.game.boxs[0]);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 4)
        {
            box = cc.find("ui_unlockdog/bg/btns/lingqu",this.game.node);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 5 || this.game.yindao == 9 || this.game.yindao == 13)
        {
            box = this.game.task.node;
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            pos.x += box.width/2;
        }
        else if(this.game.yindao == 6)
        {
            box = cc.find("head/carvup",this.game.scrollContent);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 7)
        {
            box = cc.find("ui_carvup/bg/box/up1",this.game.node);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 8)
        {
            box = cc.find("ui_carvup/bg/close",this.game.node);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 10)
        {
            box = cc.find("head/carhup",this.game.scrollContent);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 11)
        {
            box = cc.find("ui_carhup/bg/box/up1",this.game.node);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 12)
        {
            box = cc.find("ui_carhup/bg/close",this.game.node);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        //else if(this.game.yindao == 11)
        //{
        //    box = this.game.boxs[0].getChildByName("box_lvup");
        //    pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        //}
        //else if(this.game.yindao == 12)
        //{
        //    box = cc.find("ui_lvup/bg/box/up1",this.game.node);
        //    pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        //}
        //else if(this.game.yindao == 13)
        //{
        //    box = cc.find("ui_lvup/bg/close",this.game.node);
        //    pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        //}
        else if(this.game.yindao == 14)
        {
            this.hide();
        }
        else if(this.game.yindao == 15)
        {
            box = cc.find("ui_unlockbox/bg/btns/lingqu2",this.game.node);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 16)
        {
            box = cc.find("ui_lvup/bg/toggles/toggle2/Background",this.game.node);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 17 || this.game.yindao == 18)
        {
            box = cc.find("ui_lvup/bg/box2/yang/peiyu",this.game.node);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 19)
        {
            box = cc.find("ui_lvup/bg/toggles/toggle3/Background",this.game.node);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 20 || this.game.yindao == 21)
        {
            box = cc.find("ui_lvup/bg/box2/yang/peiyu",this.game.node);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 22)
        {
            this.hide();
        }
        if(box)
        {
            this.mask.setContentSize(box.getContentSize());
            if(this.game.yindao == 1 || this.game.yindao == 2 || this.game.yindao == 5 || this.game.yindao == 9 || this.game.yindao == 13)
            {
                cc.log("this.game.yindao="+this.game.yindao);
                this.mask.getComponent(cc.Mask).spriteFrame = box.getChildByName("yindao").getComponent(cc.Sprite).spriteFrame;
            }
            else
            {
                this.mask.getComponent(cc.Mask).spriteFrame = box.getComponent(cc.Sprite).spriteFrame;
            }
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;
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
