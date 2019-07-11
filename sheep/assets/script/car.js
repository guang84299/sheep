
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.game = cc.find("Canvas").getComponent("main");

        this.node.sc = this;
        this.node.zIndex = 999;
        this.updateDt = 0;
        this.dir = -1;
        this.index = -1;
        this.ny = this.node.y;

        this.lv = cc.storage.getCarVLv();
        this.conf = cc.res.conf_truckVic[this.lv-1];
        this.speed = 10/Number(this.conf.speed);
        this.coin = 0;
        this.isRun = false;
    },

    run: function()
    {
        this.isRun = true;
        var num = this.game.unLock;
        var h = this.game.boxs[0].height;
        var y = 0;
        var dt = 0.5;
        var t = this.speed;
        if(this.dir == -1)
        {
            this.index = num;
            t = this.speed*num;
            this.dir = 1;
            cc.res.setSpriteFrame("images/main/car_down",this.node);
        }
        else
        {
            this.index --;
            if(this.index<0) this.dir = -1;
            cc.res.setSpriteFrame("images/main/car_up",this.node);
        }

        if(this.index == -1)
        {
            y = this.ny;
        }
        else if(this.index == num)
        {
            y = this.game.boxs[this.index-1].y-h/2;
        }
        else
        {
            if(this.index == num-1) t = 0.5;
            y = this.game.boxs[this.index].y-h/2;
        }

        var self = this;
        this.node.runAction(cc.sequence(
            cc.moveTo(t,cc.v2(this.node.x,y)),
            cc.callFunc(function(){
                if(self.dir == 1)
                {
                    if(self.index < num && self.index>=0)
                    {
                        var box = self.game.boxs[self.index].getComponent("box");
                        var coin = Number(self.conf.capacity)-self.coin;
                        if(box.coin>0 && coin>0)
                        {
                            coin = box.getCoin(coin);
                            self.coin += coin;
                            self.addMao(y);
                        }
                    }
                }

                if(self.index == -1)
                {
                    self.subMao();
                }

            }),
            cc.delayTime(dt),
            cc.callFunc(this.run.bind(this))
        ));
    },

    addMao: function(h)
    {
        var mao = new cc.Node();
        mao.addComponent(cc.Sprite);
        mao.x = -170;
        mao.y = h;
        mao.zIndex = this.node.zIndex+1;
        this.node.parent.addChild(mao);

        cc.res.setSpriteFrame("images/box/mao/3",mao);

        var self = this;
        mao.runAction(cc.sequence(
            cc.moveTo(0.3,this.node.position).easing(cc.easeSineIn()),
            cc.callFunc(function(){
                if(self.node.childrenCount==0)
                {
                    mao.position = cc.v2(0,0);
                    mao.parent = self.node;
                }
                else
                {
                    mao.destroy();
                }
            })
        ));
    },

    subMao: function()
    {
        if(this.node.childrenCount>0)
        {
            var mao = this.node.children[0];
            mao.position = this.node.position;
            mao.parent = this.node.parent;

            var self = this;
            mao.runAction(cc.sequence(
                cc.moveBy(0.3,cc.v2(0,100)).easing(cc.easeSineIn()),
                cc.callFunc(function(){
                    self.game.addFacCoin(self.coin);
                    self.coin = 0;
                }),
                cc.removeSelf()
            ));
        }

        this.node.destroyAllChildren();
    },

    lvup: function()
    {
        this.lv = cc.storage.getCarVLv();
        this.conf = cc.res.conf_truckVic[this.lv-1];
        this.speed = 10/Number(this.conf.speed);
    },

    update: function(dt)
    {
        this.updateDt += dt;
        if(this.updateDt>1/30.0)
        {
            //this.updateMove(this.updateDt);



            this.updateDt = 0;
        }
    }
});
