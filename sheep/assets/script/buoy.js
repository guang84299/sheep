
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {

    },

    initType: function(box,type)
    {
        this.game = cc.find("Canvas").getComponent("main");
        this.box = box;

        this.node.sc = this;
        this.collradius = this.node.width/2*this.node.scale;

        this.updateDt = 0;
        this.isUpdate = true;
        this.dir = cc.v2(0,-1).normalize();

        this.type = type;

        var sp = cc.res["sheep_buoy.plist"].getSpriteFrame("buoy"+this.box.knifeType+"_"+type);
        //cc.res.setSpriteFrame("images/buoy/buoy"+this.box.knifeType+"_"+type,this.node);
        this.node.getComponent(cc.Sprite).spriteFrame = sp;
        this.conf = this.box.conf;

        if(this.box.dog == 1)
        {
            this.rotateSpeed = cc.config.buoyRotateSpeed*this.conf.buoySpeed;
            this.moveSpeed = cc.config.buoyMoveSpeed*this.conf.buoySpeed;
        }
        else
        {
            this.rotateSpeed = cc.config.buoyRotateSpeed*0.1;
            this.moveSpeed = cc.config.buoyMoveSpeed*0.1;
        }

        this.touchTime = 0;
    },



    changeDir: function(pos)
    {
        if(this.node.position.sub(pos).mag()<10)
        {
            if(this.node.x<pos.x)
                pos = pos.add(cc.v2(10,0));
            else
                pos = pos.add(cc.v2(-10,0));
        }
        var dir = this.node.position.sub(pos).normalize();
        //var ang = Math.abs(dir.angle(cc.v2(1,0)));
        var r = Math.random()+0.1;
        if(Math.random()>0.5) r = -r;
        dir = cc.v2(dir.x,dir.y).rotateSelf(r);
        this.dir = dir;
    },

    updateMove: function(dt)
    {
        //旋转
        this.node.angle += this.rotateSpeed*dt;
        //移动
        var pos = this.node.position.add(this.dir.mul(this.moveSpeed*dt));
        var w = this.node.parent.width/2 - this.collradius;
        var h = this.node.parent.height - this.collradius;
        if(pos.x>w)
        {
            pos.x=w;
            this.changeDir(pos.add(cc.v2(100,0)));
        }
        else if(pos.x<-w)
        {
            pos.x=-w;
            this.changeDir(pos.add(cc.v2(-100,0)));
        }

        if(pos.y>-this.collradius)
        {
            pos.y = -this.collradius;
            this.changeDir(pos.add(cc.v2(0,100)));
        }
        else if(pos.y < -h)
        {
            pos.y = -h;
            this.changeDir(pos.add(cc.v2(0,-100)));
        }

        //var ang = Math.abs(this.dir.angle(cc.v2(1,0)));
        //if(ang<0.2 || ang>1.5)
        //{
        //    var dir = cc.v2(this.dir.x,this.dir.y).rotateSelf(0.3);
        //    this.dir = dir;
        //}

        this.node.position = pos;
    },

    changeUpdate: function(update)
    {
        if(this.isUpdate != update)
        {
            this.isUpdate = update;
            this.node.active = this.isUpdate;
        }
    },

    lvup: function()
    {
        this.conf = this.box.conf;
        this.rotateSpeed = cc.config.buoyRotateSpeed*this.conf.buoySpeed;
        this.moveSpeed = cc.config.buoyMoveSpeed*this.conf.buoySpeed;
    },

    touchBox: function()
    {
        if(this.box.dog != 1)
        {
            this.rotateSpeed = cc.config.buoyRotateSpeed*this.conf.buoySpeed;
            this.moveSpeed = cc.config.buoyMoveSpeed*this.conf.buoySpeed;

            this.touchTime = 1;
        }
    },

    updateSpeed: function()
    {
        this.rotateSpeed = cc.config.buoyRotateSpeed*this.conf.buoySpeed;
        this.moveSpeed = cc.config.buoyMoveSpeed*this.conf.buoySpeed;
    },

    updateAniconfig: function()
    {
        var sp = cc.res["sheep_buoy.plist"].getSpriteFrame("buoy"+this.box.knifeType+"_"+this.type);
        this.node.getComponent(cc.Sprite).spriteFrame = sp;
    },

    update: function(dt)
    {
        this.updateDt += dt;
        if(this.box.isUpdate && this.updateDt>1/30.0)
        {
            this.updateMove(this.updateDt);

            for(var i=0;i<this.box.buoys.length;i++)
            {
                var buoy = this.box.buoys[i];
                if(this.node != buoy)
                {
                    var dis = this.node.position.sub(buoy.position).mag();
                    if(dis<buoy.sc.collradius*2)
                    {
                        this.changeDir(buoy.position);
                        break;
                    }
                }
            }

            if(this.touchTime>0)
            {
                this.touchTime -= dt;
                if(this.touchTime<=0)
                {
                    this.touchTime = 0;
                    this.rotateSpeed = cc.config.buoyRotateSpeed*0.1;
                    this.moveSpeed = cc.config.buoyMoveSpeed*0.1;
                }
            }

            this.updateDt = 0;
        }
    }
});
