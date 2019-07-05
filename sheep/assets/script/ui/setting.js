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
        this.music_text = cc.find("box/music/text",this.bg).getComponent(cc.Label);
        this.music_toggle = cc.find("box/music/toggle",this.bg).getComponent(cc.Toggle);

        this.sound_text = cc.find("box/sound/text",this.bg).getComponent(cc.Label);
        this.sound_toggle = cc.find("box/sound/toggle",this.bg).getComponent(cc.Toggle);

        this.vibrate_text = cc.find("box/vibrate/text",this.bg).getComponent(cc.Label);
        this.vibrate_toggle = cc.find("box/vibrate/toggle",this.bg).getComponent(cc.Toggle);
    },

    updateUI: function()
    {
        var music = storage.getMusic();
        var sound = storage.getSound();
        var vibrate = storage.getVibrate();
        if(music)
        {
            this.music_text.string = "音乐：开";
            this.music_toggle.isChecked = true;
        }
        else
        {
            this.music_text.string = "音乐：关";
            this.music_toggle.isChecked = false;
        }

        if(sound)
        {
            this.sound_text.string = "音效：开";
            this.sound_toggle.check();
        }
        else
        {
            this.sound_text.string = "音效：关";
            this.sound_toggle.uncheck();
        }

        if(vibrate)
        {
            this.vibrate_text.string = "震动：开";
            this.vibrate_toggle.check();
        }
        else
        {
            this.vibrate_text.string = "震动：关";
            this.vibrate_toggle.uncheck();
        }
    },

    updateCkState: function()
    {
        storage.setMusic(this.music_toggle.isChecked?1:0);
        storage.setSound(this.sound_toggle.isChecked?1:0);
        storage.setVibrate(this.vibrate_toggle.isChecked?1:0);
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
        else if(data == "music")
        {
            this.updateCkState();
            //if(storage.getMusic() == 0)
            //    storage.stopMusic();
            //else
            //    storage.playMusic(res.audio_bgm);
        }
        else if(data == "sound")
        {
            this.updateCkState();
        }
        else if(data == "vibrate")
        {
            this.updateCkState();
        }
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
