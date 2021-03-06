var storage = require("storage");
var res = require("res");

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad: function()
    {
        this.game = cc.find("Canvas").getComponent("main");
        this.initUI();
        this.updateUI();
    },
    initUI: function()
    {
        this.desc = cc.find("desc",this.node).getComponent(cc.Label);
        this.num = cc.find("num",this.node).getComponent(cc.Label);
        this.node_lingqu = cc.find("lingqu",this.node);
        this.node_go = cc.find("go",this.node);

        this.awardCom = -1;
    },

    updateUI: function()
    {
        if(this.game)
        {
            var taskId = storage.getTask();
            if(taskId>=res.conf_task.length)
            {
                this.node.destroy();
            }
            else
            {
                this.task = res.conf_task[taskId-1];
                this.desc.string = this.task.text;
                this.award = Number(this.task.reward)*this.game.getSecVal();
                if(this.awardCom>0) this.award = this.awardCom;
                this.num.string = storage.castNum(this.award);
                this.node_lingqu.active = this.judgeUnLock();
                this.node_go.active = !this.node_lingqu.active;
                this.awardCom = this.award;
            }
        }
    },

    judgeUnLock: function()
    {
        //牧场解锁
        if(this.task.type == "0")
        {
            if(storage.getLock()>= parseInt(this.task.ranchId))
            {
                return true;
            }
        }
        //牧场升级
        else if(this.task.type == "1")
        {
            if(storage.getLevel(parseInt(this.task.ranchId)) >= parseInt(this.task.grade))
            {
                return true;
            }
        }
        //获得称号
        else if(this.task.type == "2")
        {
            if(this.getCurrNickId() >= parseInt(this.task.titleId))
            {
                return true;
            }
        }
        //签到
        else if(this.task.type == "3")
        {
            if(storage.getQianDaoNum() >= parseInt(this.task.signIn))
            {
                return true;
            }
        }
        //转盘
        else if(this.task.type == "4")
        {
            if(storage.getChoujiangToalNum() >= parseInt(this.task.turntable))
            {
                return true;
            }
        }
        //采集车升级
        else if(this.task.type == "5")
        {
            if(storage.getCarVLv() >= parseInt(this.task.transport1))
            {
                return true;
            }
        }
        //运输车升级
        else if(this.task.type == "6")
        {
            if(storage.getCarHLv() >= parseInt(this.task.transport2))
            {
                return true;
            }
        }
        return false;
    },

    lingqu: function()
    {
        this.game.addCoin(this.award);
        var taskId = storage.getTask();
        storage.setTask(taskId+1);
        storage.uploadTask();
        res.showToast("金币+"+this.num.string);
        this.awardCom = -1;
        this.updateUI();

        cc.res.showCoinAni();

        cc.qianqista.event("任务_领取");
    },

    getCurrNickId: function()
    {
        var tlv = this.game.totalLvNum;

        var n = 0;
        for(var i=0;i<res.conf_achievement.length;i++)
        {
            if(tlv<parseInt(res.conf_achievement[i].condition))
            {
                n = i;
                break;
            }
        }
        var len = res.conf_achievement.length-1;
        if(tlv>=parseInt(res.conf_achievement[len].condition))
            n = len+1;
        return n;
    },

    go: function()
    {
        if(this.node_lingqu.active)
        {
            this.lingqu();
            return;
        }
        //牧场解锁 //牧场升级
        if(this.task.type == "0" || this.task.type == "1")
        {
            var ranchId = parseInt(this.task.ranchId)-2;
            var h = this.game.boxs[0].height;
            var y = h*ranchId+487;
            this.game.scroll.scrollToOffset(cc.v2(0,y),1);
        }
        //采集车升级 //运输车升级
        else if(this.task.type == "5" || this.task.type == "6")
        {
            this.game.click(null,"up");
        }

        cc.qianqista.event("任务_前往");
    },


    click: function(event,data)
    {
        if(data == "lingqu")
        {
            this.lingqu();
        }
        else if(data == "go")
        {
            this.go();
        }

        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
