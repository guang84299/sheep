
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.node.sc = this;
        this.isUpdate = true;

        this.lv_label = cc.find("box_lvup/lv",this.node).getComponent(cc.Label);

        this.updateUI();
    },

    init: function(index)
    {
        this.game = cc.find("Canvas").getComponent("main");
        this.index = index;
        this.lv = cc.storage.getLevel(index);
        this.conf = cc.res.conf_base[this.lv-1];
        this.pice = cc.res.conf_price[this.lv-1]["price"+index];
        this.growSpeed = this.conf.growSpeed;
        this.isUnLock = false;
        var lock = cc.storage.getLock();
        if(index<=lock)
        {
            this.initSheep();
        }
        else
        {
            cc.find("box/lock",this.node).active = false;
            cc.find("box/lock2",this.node).active = true;
            cc.find("box_lvup",this.node).active = false;
            if(this.game.judgeUnLock(index))
            {
                this.toUnlock();
            }
            else
            {
                this.initUnlock(index-1);
                cc.log("index=",index);
            }
        }
    },

    initUnlock: function(lock)
    {
        var desc = cc.find("box/lock2/desc",this.node).getComponent(cc.Label);
        desc.string = "牧场总等级"+cc.res.conf_grade[lock].condition+"级解锁";
    },

    updateUI: function()
    {
        this.lv_label.string = "lv."+this.lv;
    },

    initSheep: function()
    {
        this.isUnLock = true;
        var box = cc.find("box",this.node);

        cc.find("lock",box).active = false;
        cc.find("lock2",box).active = false;

        this.sheeps = [];
        for(var i=0;i<8;i++)
        {
            for(var j=0;j<6;j++)
            {
                var sheep = cc.instantiate(cc.res["prefab_sheep"]);
                sheep.x = (i-4)*70 + 30;
                sheep.y = -50*j -30;
                //sheep.zIndex = 2;
                box.addChild(sheep);

                if(Math.random()>0.5) sheep.scaleX = -1;

                this.sheeps.push(sheep);
            }
        }

        this.buoys = [];
        for(var i=0;i<this.conf.buoyNum;i++)
        {
            var buoy = cc.instantiate(cc.res["prefab_buoy"]);
            buoy.x =  (i-4)*70 + 30;
            buoy.y = -50 - 200*(i%2);
            //buoy.zIndex = 1;
            buoy.getComponent("buoy").initType(this,i+1);
            box.addChild(buoy);

            this.buoys.push(buoy);
        }

    },

    changeUpdate: function(update)
    {
        if(this.isUpdate != update)
        {
            this.isUpdate = update;

            if(this.isUnLock)
            {
                for(var i=0;i<this.buoys.length;i++)
                {
                    this.buoys[i].sc.changeUpdate(this.isUpdate);
                }
                for(var i=0;i<this.sheeps.length;i++)
                {
                    this.sheeps[i].sc.changeUpdate(this.isUpdate);
                }
            }

        }
    },

    lvup: function()
    {
        this.lv = cc.storage.getLevel(this.index);
        this.conf = cc.res.conf_base[this.lv-1];
        this.pice = cc.res.conf_price[this.lv-1]["price"+this.index];
        this.growSpeed = this.conf.growSpeed;

        for(var i=0;i<this.buoys.length;i++)
        {
            this.buoys[i].getComponent("buoy").lvup();
        }
        var box = cc.find("box",this.node);
        for(var i=this.buoys.length;i<this.conf.buoyNum;i++)
        {
            var buoy = cc.instantiate(cc.res["prefab_buoy"]);
            buoy.x =  (i-4)*70 + 30;
            buoy.y = -50 - 200*(i%2);
            //buoy.zIndex = 1;
            buoy.getComponent("buoy").initType(this,i+1);
            box.addChild(buoy);

            this.buoys.push(buoy);
        }

        for(var i=0;i<this.sheeps.length;i++)
        {
            this.sheeps[i].getComponent("sheep").lvup();
        }
        this.updateUI();
    },

    toUnlock: function()
    {
        var box = cc.find("box",this.node);
        cc.find("lock",box).active = true;
        cc.find("lock2",box).active = false;

        this.lock_name = cc.find("box/lock/name",this.node).getComponent(cc.Label);
        this.lock_desc = cc.find("box/lock/desc",this.node).getComponent(cc.Label);
        this.lock_cost = cc.find("box/lock/cost",this.node).getComponent(cc.Label);
        this.lock_sheepIcon = cc.find("box/lock/sheepIcon",this.node);

        var conf = cc.res.conf_ranch[this.index-1];
        this.unLockCost = this.getUnlockCost();
        this.lock_name.string = conf.name;
        this.lock_desc.string = conf.tips;
        this.lock_cost.string = cc.storage.castNum(this.unLockCost);

        var icon = parseInt((this.index-1)/3)+1;
        cc.res.setSpriteFrame("images/sheepIcon/sheepIcon"+icon,this.lock_sheepIcon);
    },

    unlock: function()
    {
        var cost = this.unLockCost;
        if(this.game.coin>=cost)
        {
            this.game.addCoin(-cost);

            var lock = cc.storage.getLock();
            if(this.index==lock+1)
            {
                var box_lvup = cc.find("box_lvup",this.node);
                box_lvup.active = true;
                box_lvup.opacity = 0;
                var h = box_lvup.height;
                box_lvup.height = 0;
                this.schedule(function(){
                    box_lvup.height += 8;
                    if(box_lvup.height>h-2)
                    {
                        box_lvup.opacity = 255;
                    }
                },0.05,h/8);

                cc.storage.setLock(lock+1);
                cc.storage.uploadLock();

                this.initSheep();
                this.game.updateUI();
                if(lock+1>=3)
                this.game.addBox();
            }
        }
    },

    getUnlockCost: function()
    {
        var conf = cc.res.conf_ranch[this.index-1];
        var cost = 0;
        for(var i=1;i<=14;i++)
        {
            var c = parseInt(conf["cost"+i]);
            if(c == 0) break;
            else
            {
                var pirce = Number(cc.res.conf_price[c-1]["price"+i]);
                var speed = Number(cc.res.conf_base[c-1].growSpeed);
                cost += pirce/speed;
            }
        }
        cost = cost*48*parseInt(conf.time);
        return cost;
    },

    click: function(event,data)
    {
        if(data == "up")
        {
            cc.res.openUI("lvup",null,this.index);
        }
        else if(data == "unlock")
        {
            this.unlock();
        }
        cc.log(data);
    }
});
