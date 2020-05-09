var storage = require("storage");
var res = require("res");
const {ccclass, property} = cc._decorator;

@ccclass
export default class shareaward extends cc.Component {

   
    award = 0;
    game = null;
    // onLoad () {}

    start () {
       this.updateUI();
       var coin_val = cc.find("bg/goldbg/num",this.node).getComponent(cc.Label);
       coin_val.string = storage.castNum(this.award);
    }

    updateUI()
    {
       
    }

    lingqu(){
        this.game.addCoin(this.award);
        storage.setVideoPath("");
        this.hide();
        cc.res.showCoinAni();
    }

    show(data){
        this.game = cc.find("Canvas").getComponent("main");
        this.award = this.game.getSecVal()*10*60;
        cc.sdk.showBanner();
    }

    hide(){
        this.node.destroy();
        cc.sdk.hideBanner();
    }

    click(event,data){
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "lingqu")
        {
            var self = this;
            cc.sdk.share(function(r){
                if(r) self.lingqu();
            });
            
        }
       
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
