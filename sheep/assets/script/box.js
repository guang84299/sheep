
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.node.sc = this;
        this.isUpdate = true;

        this.lv_label = cc.find("box_lvup/lv",this.node).getComponent(cc.Label);
        this.index_label = cc.find("box_lvup/index",this.node).getComponent(cc.Label);

        this.updateUI();
    },

    init: function(index)
    {
        this.game = cc.find("Canvas").getComponent("main");
        this.index = index;

        this.lv = cc.storage.getLevel(index);
        this.coin = cc.storage.getLevelCoin(index);
        this.dog = cc.storage.getLevelDog(index);
        this.compose = cc.res.conf_compose[index-1];
        this.isUnLockSheep = cc.storage.getSheep(parseInt(this.compose.id));
        this.isUnLockBuoy = cc.storage.getBuoy(parseInt(this.compose.newKnife));
        this.conf = cc.res.conf_base[this.lv-1];
        this.pice = cc.res.conf_price[this.lv-1]["price"+index];
        if(this.isUnLockSheep == 3)
            this.pice *= 1.3 ;
        this.knifeType = cc.res.conf_grade[1-1].knifeType;
        if(this.isUnLockBuoy == 3)
            this.knifeType = cc.res.conf_grade[index-1].knifeType;

        this.type = parseInt(cc.res.conf_ranch[index-1].type);
        var nextIndex = index;
        if(nextIndex>=cc.res.conf_ranch.length)
            nextIndex = cc.res.conf_ranch.length-1;
        this.nextType = parseInt(cc.res.conf_ranch[nextIndex].type);
        this.growSpeed = this.conf.growSpeed;
        this.isUnLock = false;
        this.upDt = 0;
        this.saveDt = 0;

        this.sheeps = [];
        this.buoys = [];

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
            cc.find("node_mao",this.node).active = false;
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

        var icon = this.type+1;

        cc.res.setSpriteFrameAtlas("images/box","bg"+icon,this.node);
        if(this.type != this.nextType)
        {
            this.boxbg2 =  cc.find("bg2",this.node);
            cc.res.setSpriteFrameAtlas("images/box","bg2"+icon,this.boxbg2);
            //cc.find("node_hua",this.node).active = true;
        }

        this.initDog();


    },

    initUnlock: function(lock)
    {
        var desc = cc.find("box/lock2/desc",this.node).getComponent(cc.Label);
        desc.string = cc.res.conf_grade[lock].condition;
    },

    updateUI: function()
    {
        this.lv_label.string = "lv"+this.lv;
        this.index_label.string = this.index;
    },

    initSheep: function(isAni)
    {
        this.isUnLock = true;
        var box = cc.find("box",this.node);

        cc.find("lock",box).active = false;
        cc.find("lock2",box).active = false;

        this.sheeps = [];
        this.addSheep(isAni);
        //for(var i=0;i<6;i++)
        //{
        //    for(var j=0;j<6;j++)
        //    {
        //        var sheep = cc.instantiate(cc.res["prefab_sheep"]);
        //        sheep.x = (i-3)*60 + 30;
        //        sheep.y = -50*j -40;
        //        //sheep.zIndex = 2;
        //        box.addChild(sheep);
        //
        //        if(Math.random()>0.5) sheep.scaleX = -1;
        //
        //        this.sheeps.push(sheep);
        //    }
        //}

        this.buoys = [];
        for(var i=0;i<this.conf.buoyNum;i++)
        {
            var buoy = cc.instantiate(cc.res["prefab_buoy"]);
            buoy.x =  (i-4)*70 + 30;
            buoy.y = -50 - 200*(i%2);
            buoy.zIndex = 1;
            buoy.getComponent("buoy").initType(this,i+1);
            box.addChild(buoy);

            this.buoys.push(buoy);

            //if(this.dog != 1)
            //    buoy.active = false;
        }

        cc.find("node_mao",this.node).active = true;
        this.mao = cc.find("node_mao/mao",this.node);
        this.coinnum = cc.find("node_mao/coinbg/num",this.node).getComponent(cc.Label);
        this.coinnum.string = cc.storage.castNum(this.coin);

        this.proMao();
    },

    addSheep: function(isAni)
    {
        var num = Number(cc.res.conf_sheep[this.lv-1]["ranch"+this.index]);
        if(this.sheeps.length<num)
        {
            var p = cc.config.sheepPos[this.sheeps.length];
            p = cc.v2((p.x-4)*60 + 30,-50*(p.y-1) -40);

            var box = cc.find("box",this.node);

            var sheep = cc.instantiate(cc.res["prefab_sheep"]);
            sheep.position = p;
            sheep.scale = 3;
            sheep.x += (Math.random()-0.5)*300;
            sheep.y -= 200;
            box.addChild(sheep);

            var scaleX = 1;
            if(Math.random()>0.5)
            {
                scaleX = -1;
                sheep.scaleX = -3;
            }

            this.sheeps.push(sheep);

            if(this.index>3 && !isAni)
            {
                sheep.position = p;
                sheep.scaleX = scaleX;
                sheep.scaleY = 1;
                this.addSheep(isAni);
            }
            else
            {
                sheep.runAction(cc.spawn(
                    cc.moveTo(0.5,p).easing(cc.easeSineInOut()),
                    cc.scaleTo(0.5,scaleX,1).easing(cc.easeSineIn())
                ));

                var self = this;
                sheep.runAction(cc.sequence(
                    cc.delayTime(0.2),
                    cc.callFunc(function(){
                        self.addSheep(isAni);
                    })
                ));
            }

        }
    },

    proMao: function()
    {
        this.mao.destroyAllChildren();
        var icon = this.type+1;
        if(this.isUnLockSheep != 3)
            icon = 1;
        var node = cc.res.playAnim("images/box/mao"+icon,4,1,1,null,false);
        this.mao.addChild(node);
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

            if(this.isUpdate) this.node.opacity = 255;
            else this.node.opacity = 0;
        }
    },

    lvup: function()
    {
        this.lv = cc.storage.getLevel(this.index);
        this.conf = cc.res.conf_base[this.lv-1];
        this.pice = cc.res.conf_price[this.lv-1]["price"+this.index];
        if(this.isUnLockSheep == 3)
            this.pice *= 1.3;
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
            buoy.zIndex = 1;
            buoy.getComponent("buoy").initType(this,i+1);
            box.addChild(buoy);

            this.buoys.push(buoy);

            //if(this.dog != 1)
            //    buoy.active = false;
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

        this.lock_name = cc.find("box/lock/name",this.node);
        this.lock_desc = cc.find("box/lock/desc",this.node).getComponent(cc.Label);
        this.lock_cost = cc.find("box/lock/coinbg/cost",this.node).getComponent(cc.Label);
        this.lock_sheepIcon = cc.find("box/lock/sheepIcon",this.node);
        this.lock_saoguang = cc.find("box/lock/mask/saoguang",this.node);

        var conf = cc.res.conf_ranch[this.index-1];
        this.unLockCost = this.getUnlockCost();

        this.lock_desc.string = conf.tips;
        this.lock_cost.string = cc.storage.castNum(this.unLockCost);

        var icon = this.type+1;
        cc.res.setSpriteFrame("images/sheepIcon/sheepIcon"+icon,this.lock_sheepIcon);
        cc.res.setSpriteFrameAtlas("images/box","title_"+icon,this.lock_name);

        this.lock_saoguang.x = -340;
        this.lock_saoguang.stopAllActions();
        this.lock_saoguang.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(0.6,630,0).easing(cc.easeSineIn()),
            cc.moveBy(0,-630,0),
            cc.delayTime(2)
        )));
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

                if(this.index<=4)
                {
                    var compose = cc.res.conf_compose[this.index-1];
                    cc.storage.setSheep(parseInt(compose.id),3);
                    cc.storage.setBuoy(parseInt(compose.newKnife),3);

                    cc.storage.uploadSheep(parseInt(compose.id));
                    cc.storage.uploadBuoy(parseInt(compose.newKnife));

                    this.useNewSheep();
                    this.useNewBuoy();
                }

                this.initSheep(true);
                this.game.updateUI();
                if(lock+1>=3)
                this.game.addBox();

                if(!this.game.car2.isRuning)
                    this.game.car2.run();

                cc.res.openUI("unlockbox",null,this.index);

                this.box_dog.active = this.isUnLock;
            }
        }
        else
        {
            cc.res.showToast("金币不足！");
            cc.res.openUI("freecoin");
        }
    },

    getUnlockCost: function()
    {
        var conf = cc.res.conf_ranch[this.index-1];
        var cost = 0;
        for(var i=1;i<=29;i++)
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
        cost = cost*36*parseInt(conf.time);
        return cost;
    },

    getCoin: function(coin)
    {
        var gcoin = 0;
        if(coin>=this.coin)
        {
            gcoin = this.coin;
            this.coin = 0;
        }
        else
        {
            gcoin = coin;
            this.coin -= coin;
        }
        this.proMao();
        this.upDt = 0;
        this.coinnum.string = cc.storage.castNum(this.coin);
        return gcoin;
    },

    addXiaotou: function()
    {
        this.isXiaotou = true;
        this.coinnum.node.color = cc.color(255,0,0);

        this.schedule(this.xiaotouCoin,2);
    },

    subXiaotou: function()
    {
        this.isXiaotou = false;
        this.coinnum.node.color = cc.color(255,255,255);
        this.unschedule(this.xiaotouCoin);
    },

    xiaotouCoin: function()
    {
        if(this.coin>0)
        {
            var cost = this.pice*(1/this.growSpeed)*36*2;
            if(this.coin<cost)  cost = this.coin;
            this.coin -= cost;
            this.coinnum.string = cc.storage.castNum(this.coin);

            if(this.game.thief_btn && this.game.thief_btn.coinLabel)
            {
                this.game.thief_btn.coinLabel.coin += cost;
                this.game.thief_btn.coinLabel.string = cc.storage.castNum(this.game.thief_btn.coinLabel.coin);
            }
            //cc.res.showSubcoin(cc.v2(-170,-50), this.node,cc.storage.castNum(cost));
        }

    },

    update: function(dt)
    {
        if(this.isUnLock)
        {
            if(this.dog == 1)
            {
                this.upDt += dt;
                this.saveDt += dt;
                if(this.upDt>2)
                {
                    this.upDt = 0;

                    this.coin += this.pice*(1/this.growSpeed)*36*2;
                    this.coinnum.string = cc.storage.castNum(this.coin);
                }

                if(this.saveDt>5)
                {
                    this.saveDt = 0;
                    cc.storage.setLevelCoin(this.index,this.coin);
                }
            }

            if(this.dog > 1)
            {
                this.dogUnlokDt += dt;
                if(this.dogUnlokDt>1)
                {
                    this.updateDogUnlock();
                }
            }
        }

    },

    touchBox: function(pos)
    {
        if(this.isUpdate && this.isUnLock)
        {
            var pos2 = this.node.parent.convertToWorldSpaceAR(this.node.position).sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            pos2.y -= this.node.height/2;
            if(pos2.sub(pos).mag()<this.node.height/2)
            {
                for(var i=0;i<this.buoys.length;i++)
                {
                    this.buoys[i].sc.touchBox();
                }
            }
            //cc.log(pos2.sub(pos).mag());
            //for(var i=0;i<this.sheeps.length;i++)
            //{
            //    this.sheeps[i].sc.touchBox(pos);
            //}
        }
    },

    touchBoxAddCoin: function()
    {
        this.coin += this.pice*(1/this.growSpeed)*1*3;
        this.coinnum.string = cc.storage.castNum(this.coin);

        cc.storage.setLevelCoin(this.index,this.coin);
    },

    initDog: function()
    {
        this.box_dog = cc.find("box_dog",this.node);
        this.dog_dog = cc.find("box_dog/dog",this.node);
        this.dog_dog_dog = cc.find("box_dog/dog/dog",this.node);
        this.dog_dog_qipao = cc.find("box_dog/dog/qipao",this.node);
        this.dog_dog_qipao_txt = cc.find("txt",this.dog_dog_qipao).getComponent(cc.Label);

        this.dog_lock = cc.find("box_dog/lock",this.node);
        this.dog_lock_txt = cc.find("box_dog/lock/btn2/timebg/txt",this.node).getComponent(cc.Label);
        this.dog_lock_btn1 = cc.find("btn1",this.dog_lock);
        this.dog_lock_btn2 = cc.find("btn2",this.dog_lock);
        if(this.dog == 0)
        {
            this.dog_lock.active = true;
            this.dog_lock_btn1.active = true;
            this.dog_lock_btn2.active = false;
            this.dog_dog.active = false;

            this.dog_lock_btn1.runAction(cc.repeatForever(
                cc.sequence(
                    cc.rotateTo(0.1,20).easing(cc.easeSineIn()),
                    cc.rotateTo(0.1,0).easing(cc.easeSineIn()),
                    cc.rotateTo(0.1,-20).easing(cc.easeSineIn()),
                    cc.rotateTo(0.1,0).easing(cc.easeSineIn()),
                    cc.delayTime(1)
                )
            ));
        }
        else if(this.dog == 1)
        {
            this.dog_lock.active = false;
            this.dog_dog_qipao.active = false;
            this.dog_dog.active = true;
        }
        else if(this.dog > 1)
        {
            this.dog_lock.active = true;
            this.dog_lock_btn1.active = false;
            this.dog_lock_btn2.active = true;
            this.dog_dog.active = false;
        }
        this.dogUnlokDt = 0;

        this.box_dog.active = this.isUnLock;
    },

    updateDogUnlock: function()
    {
        var now = new Date().getTime();
        var time = this.dog - now;
        if(time>0)
        {
            var h = Math.floor(time/(60*60*1000));
            var m = Math.floor((time - h*60*60*1000)/(60*1000));
            var s = Math.floor(((time - h*60*60*1000 - m*60*1000))/1000);
            //var sh = h < 10 ? "0"+h : h;
            var sm = m < 10 ? "0"+m : m;
            var ss = s < 10 ? "0"+s : s;
            this.dog_lock_txt.string = sm+":"+ss;
        }
        else
        {
            this.unlockdog();
        }
    },

    unlockdog: function()
    {
        this.dog = 1;
        this.dog_lock.active = false;
        this.dog_dog.active = true;
        cc.storage.setLevelDog(this.index,1);
        cc.storage.uploadLevelDog(this.index);

        for(var i=0;i<this.buoys.length;i++)
        {
            this.buoys[i].sc.updateSpeed();
        }

        this.dog_dog_qipao.active = true;
        this.dog_dog_qipao_txt.string = cc.res.conf_dogText[0].text;
        this.dog_dog_qipao.scale = 0;
        this.dog_dog_qipao.runAction(cc.sequence(
            cc.scaleTo(0.2,1).easing(cc.easeSineIn()),
            cc.delayTime(5),
            cc.fadeOut(1)
        ));

        cc.storage.playSound(cc.res.audio_dog);
    },

    tounlockdog: function()
    {
        if(this.dog == 0)
        {
            var conf = cc.res.conf_ranch[this.index-1];

            var now = new Date().getTime();
            this.dog = now + Number(conf.dogTime)*1000;
            cc.storage.setLevelDog(this.index,this.dog);
            cc.storage.uploadLevelDog(this.index);
            this.updateDogUnlock();

            this.dog_lock_btn1.active = false;
            this.dog_lock_btn2.active = true;
        }
    },

    updatedog: function()
    {
        var acc = this.dog_dog_qipao.getActionByTag(1);
        if(acc && !acc.isDone()) return;
        var n = Math.floor(Math.random()*7)+1;

        var sp = this.dog_dog_dog.getComponent("sp.Skeleton");
        sp.setAnimation(0,"99",false);
        sp.setCompleteListener(function(){
            sp.setAnimation(0,"0"+n,true);
            //cc.log("setEndListener");
        });
        //cc.res.setSpriteFrame("images/sheepIcon/sheepIcon"+i,this.dog_dog);

        //this.dog_dog_dog.runAction(cc.jumpTo(0.5,this.dog_dog_dog.position,30,3));

        var i = Math.floor(Math.random()*(cc.res.conf_dogText.length-1))+1;

        this.dog_dog_qipao.active = true;
        this.dog_dog_qipao.scale = 0;
        this.dog_dog_qipao_txt.string = cc.res.conf_dogText[i].text;
        var ac = cc.sequence(
            cc.fadeIn(0.1),
            cc.scaleTo(0.2,1).easing(cc.easeSineIn()),
            cc.delayTime(3),
            cc.fadeOut(1)
        );
        ac.setTag(1);
        this.dog_dog_qipao.runAction(ac);

        this.game.addDiamond(1);
        cc.res.showDiamond(this.dog_dog_dog.position, this.dog_dog);

        cc.storage.playSound(cc.res.audio_dog);
    },

    useNewSheep: function()
    {
        this.isUnLockSheep = cc.storage.getSheep(parseInt(this.compose.id));
        this.pice = cc.res.conf_price[this.lv-1]["price"+this.index];
        if(this.isUnLockSheep == 3)
            this.pice *= 1.3;
        for(var i=0;i<this.sheeps.length;i++)
        {
            this.sheeps[i].sc.updateAniconfig();
        }
    },

    useNewBuoy: function()
    {
        this.isUnLockBuoy = cc.storage.getBuoy(parseInt(this.compose.newKnife));
        this.knifeType = cc.res.conf_grade[1-1].knifeType;
        if(this.isUnLockBuoy == 3)
            this.knifeType = cc.res.conf_grade[this.index-1].knifeType;
        for(var i=0;i<this.buoys.length;i++)
        {
            this.buoys[i].sc.updateAniconfig();
        }
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
        else if(data == "unlockdog")
        {
            var self = this;
            if(this.dog == 0)
            {
                //this.game.hideYindao();
                cc.res.openUI("unlockdog",null,this.index);
            }
            else if(this.dog > 1)
            {
                cc.sdk.showVedio(function(r){
                    if(r) self.unlockdog();
                });
            }
        }
        else if(data == "dog")
        {
            this.updatedog();
        }
        else if(data == "lock2")
        {
            cc.res.openUI("boxtishi",null,this.index);
        }
        cc.storage.playSound(cc.res.audio_button);
        cc.log(data);
    }
});
