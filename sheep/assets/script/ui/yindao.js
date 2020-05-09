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

        this.hand.stopAllActions();
        this.hand.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5,0.8).easing(cc.easeSineIn()),
            cc.scaleTo(0.5,1).easing(cc.easeSineIn())
        )));


        this.scheduleOnce(this.updateStep.bind(this),0.1);

    },



    updateStep: function()
    {
        this.game.yindao = this.yindao;
        storage.setYinDao(this.yindao);
        storage.uploadYinDao();

        //第一大步
        var box = null;
        var pos = null;
        cc.res.setSpriteFrame("images/yindao/ydwz0"+this.game.yindao,this.desc);

        if(this.yindao == 1)
        {
            box = this.game.boxs[0].getChildByName("box").getChildByName("border");
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            pos.y -= box.height/2;
        }
        else if(this.yindao == 2)
        {
            box = cc.find("head/carvup",this.game.scrollContent);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.yindao == 3)
        {
            box = cc.find("head/carhup",this.game.scrollContent);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.yindao == 4)
        {
            box = this.game.boxs[0].getChildByName("box_lvup").getChildByName("yindao");
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.yindao == 5)
        {
            box = this.game.boxs[1].getChildByName("box").getChildByName("border");
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            pos.y -= box.height/2;

            this.game.scroll.vertical = true;

            this.hide();
        }
        else if(this.game.yindao == 6)
        {
            box = cc.find("box_dog/lock/btn1",this.game.boxs[1]);
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.game.yindao == 7)
        {
            this.hide();
        }
        else if(this.yindao == 8)
        {
            box = this.game.alarm_btn;
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            this.node.runAction(cc.sequence(
                cc.delayTime(14),
                cc.removeSelf()
            ));
        }
        else if(this.yindao == 9)
        {
            box = this.game.thief_btn;
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.yindao == 10)
        {
            this.descbg.active = false;
            box = this.game.btn_dog;
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.yindao == 11)
        {
            this.descbg.active = false;
            box = this.game.btn_tanxian;
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }
        else if(this.yindao == 12)
        {
            this.descbg.active = false;
            box = this.game.btn_garglewool;//.getChildByName("garglewool");
            pos = box.parent.convertToWorldSpaceAR(box.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }

        if(box)
        {
            if(this.yindao == 3 || this.yindao == 4 || this.yindao == 6 )
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
            if(this.yindao == 1 || this.yindao == 5 || this.yindao == 8 || this.yindao == 9)
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
            if(this.yindao == 1 || this.yindao == 2 || this.yindao == 6)
                this.descbg.x += 60;
            else if(this.yindao == 3 || this.yindao == 4)
                this.descbg.x -= 50;
            else if(this.yindao == 8)
                this.descbg.x += 180;
            else if(this.yindao == 9)
                this.descbg.x += 50;
            else if(this.yindao == 10)
            {
                this.descbg.x += 50;
                this.descbg.y -= 90;
            }
            else if(this.yindao == 11)
            {
                this.descbg.x += 60;
                this.descbg.y -= 90;
            }
            else if(this.yindao == 12)
            {
                this.descbg.x += 80;
                this.descbg.y -= 30;
            }
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
            if(this.yindao>5)
            {
                this.hide();
            }

        }

        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
