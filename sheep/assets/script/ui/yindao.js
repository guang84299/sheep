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
        this.mask = cc.find("mask",this.node);
        this.hand = cc.find("hand",this.node);
        this.game = cc.find("Canvas").getComponent("main");
        this.descbg = cc.find("descbg",this.node);
        this.desc = cc.find("descbg/desc",this.node);

        this.hand.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5,0.8).easing(cc.easeSineIn()),
            cc.scaleTo(0.5,1).easing(cc.easeSineIn())
        )));

        //this.mask2 = cc.find("mask2",this.node);
        //this.mask3 = cc.find("mask3",this.node);

        if(this.yindao == 0)
            this.updateYindao();
        else
        {
            this.scheduleOnce(this.updateYindao2.bind(this),0.1);
        }
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
        //this.desc.string = "引导"+this.game.yindao;
        cc.res.setSpriteFrame("images/yindao/ydwz0"+this.game.yindao,this.desc);

        if(this.game.yindao == 1)
        {
            box = this.game.boxs[0].getChildByName("box").getChildByName("border");
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            pos.y -= box.height/2;
        }
        else if(this.game.yindao == 2)
        {
            box = cc.find("box_dog/lock/btn1",this.game.boxs[0]);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 3)
        {
            box = cc.find("head/carvup",this.game.scrollContent);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));


            //this.mask2.active = true;
            //this.mask3.active = true;
            //
            //var box2 = cc.find("head/carhup",this.game.scrollContent);
            //var pos2 = box2.parent.convertToWorldSpaceAR(box2.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            //this.mask2.getComponent(cc.Mask).spriteFrame = box2.getComponent(cc.Sprite).spriteFrame;
            //this.mask2.position = pos2;
            //this.mask2.setContentSize(box2.getContentSize());
            //
            //var box3 = this.game.boxs[0].getChildByName("box_lvup");
            //var pos3 = box3.parent.convertToWorldSpaceAR(box3.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            //this.mask3.getComponent(cc.Mask).spriteFrame = box3.getComponent(cc.Sprite).spriteFrame;
            //this.mask3.position = pos3;
            //this.mask3.setContentSize(box3.getContentSize());
        }
        else if(this.game.yindao == 4)
        {
            box = cc.find("head/carhup",this.game.scrollContent);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 5)
        {
            box = this.game.boxs[0].getChildByName("box_lvup").getChildByName("yindao");
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 6)
        {
            box = this.game.boxs[1].getChildByName("box").getChildByName("border");
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            pos.y -= box.height/2;

            this.hide();
        }

        if(box)
        {
            if(this.game.yindao == 2 || this.game.yindao == 3 || this.game.yindao == 4 || this.game.yindao == 5)
            {
                var s = box.getContentSize();
                s.width *= 1.3;
                s.height *= 1.4;
                this.mask.setContentSize(s);
            }
            else
            {
                this.mask.setContentSize(box.getContentSize());
            }
            if(this.game.yindao == 1 || this.game.yindao == 6)
            {
                this.mask.getComponent(cc.Mask).spriteFrame = box.getChildByName("yindao").getComponent(cc.Sprite).spriteFrame;
            }
            else
            {
                this.mask.getComponent(cc.Mask).spriteFrame = box.getComponent(cc.Sprite).spriteFrame;
            }
            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;

            this.descbg.position = pos.add(cc.v2(0,this.mask.getContentSize().height/2+40));
            if(this.game.yindao == 2 || this.game.yindao == 3)
                this.descbg.x += 60;
            else if(this.game.yindao == 4 || this.game.yindao == 5)
                this.descbg.x -= 50;

        }

    },

    updateYindao2: function()
    {
        var box = null;
        var pos = null;
        cc.res.setSpriteFrame("images/yindao/ydwz0"+this.yindao,this.desc);

        this.game.yindao = this.yindao;
        storage.setYinDao(this.yindao);
        storage.uploadYinDao();

        if(this.yindao == 7)
        {
            box = this.game.alarm_btn;
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.node.runAction(cc.sequence(
                cc.delayTime(14),
                cc.removeSelf()
            ));
        }
        else if(this.yindao == 8)
        {
            box = this.game.thief_btn;
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }

        if(box)
        {
            var s = box.getContentSize();
            //s.width *= 1.2;
            //s.height *= 1.2;
            this.mask.setContentSize(s);

            this.mask.getComponent(cc.Mask).spriteFrame = box.getChildByName("yindao").getComponent(cc.Sprite).spriteFrame;

            this.mask.position = pos;
            this.hand.position = pos;
            this.hand.y -= 50;

            this.descbg.position = pos.add(cc.v2(0,this.mask.getContentSize().height/2+40));

            if(this.yindao ==7)
                this.descbg.x += 180;
            else if(this.yindao == 8)
                this.descbg.x += 50;
        }
    },


    show: function(yindao)
    {
        this.yindao = yindao;
        if(!this.yindao) this.yindao = 0;
        this.game = cc.find("Canvas").getComponent("main");
        this.node.sc = this;


        this.node.active = true;
        this.node.stopAllActions();
        this.initUI();

        cc.log("yindao:",yindao);
    },

    hide: function()
    {
        var self = this;
        this.node.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.callFunc(function(){
                self.node.destroy();
            })
        ));

    },

    click: function(event,data)
    {
        if(data == "close")
        {
            if(this.yindao>6)
            {
                this.hide();
            }

        }

        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
