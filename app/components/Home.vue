<template>
    <Page class="ns-dark" @loaded="onLoad" >
        <ActionBar flat="true" >
            <Label horizontalAlignment="center" text="Random Screens" ref="gallery" />
            <ActionItem  @tap="goToList" ios.position="left" icon="res://baseline_collections_white_24" android.position="actionBar" />
        </ActionBar>

    
        <GridLayout ref="step1" rows="*, 50" class="ns-dark" style="padding:10" @doubleTap="randomScreen" @longPress="randomScreen" @swipe="randomScreen">
    
            <Image ref="image" @tap="randomScreen" :visibility="this.image ? 'visible' : 'collapsed'" :src="this.image" row="0" stretch="aspectFit" @isLoading="onImageLoaded" />
            <GridLayout row="1" columns="auto,auto,*">
                <Button ref="publish" col="0" class="fas share" text.decode="Publish  &#xf14d; " @tap="publish" />
                <!-- <Button col="1" class="fas share" text.decode="Share  &#xf1e0; "/> -->
                <Button col="2" class="share fas" text.decode=" Next  &#xf35a; "  @tap="randomScreen" />
            </GridLayout>
            <ActivityIndicator rowSpan="2" :busy="this.isLoading" />
        </GridLayout>
   
    </Page>
</template>

<script>
import * as http from "http";
import List from "./List";
import firebase from "nativescript-plugin-firebase";
const SwipeDirection = require("tns-core-modules/ui/gestures").SwipeDirection;

export default {
    props: ["url"],

    data() {
        return {
            isLoading: false,
            
            image: (this.url) ? this.url : "~/images/logo_white.png",
            oldImage: null,
            seed: Math.random().toString(36).slice(2).substr(0, 6),
        }
    },
    mounted() {
      
        firebase.analytics.setScreenName({
            screenName: "Home"
        }).then(
            function() {
              
            }
        );
    },
    computed: {
        isLoading() {

        }
    },
    methods: {
        onLoad(){
         
            const ToolTip = require("nativescript-tooltip").ToolTip;
            const tip = new ToolTip(this.$refs.image.nativeView,{text:"Swipe ↔️ ↕️ or Touch",backgroundColor:"red",position:"top", style:"CustomToolTipLayoutStyle"});
            const t = new ToolTip(this.$refs.publish.nativeView, {
                text: "Publish screens to social gallery",
                position: "right",
                hideArrow: false,
                textColor: "white",
                backgroundColor: "red",
                style:"CustomToolTipLayoutStyle",
            });
            t.show();
            tip.show();
            
        },
        publish() {
            action("Choose Category", "Cancel", ["Funny", "NSFW", "Secret", "WTF"])
                .then(options => {
                    if (options != "Cancel") {
                        http.request({
                            url: "https://yourwebsite.ge/screen/add.php",
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            content: JSON.stringify({
                                image: this.image,
                                category: options,
                            })
                        }).then(response => {
                            var result = response.content.toJSON();
                            alert({
                                title: "Social",
                                message: result.response,
                                okButtonText: "OK"
                            }).then(() => {

                            });
                        }, error => {
                            console.error(error);
                        });
                    }
                });
        },
        goToList() {
            this.$navigateTo(List, {
                transition: {
                    name: 'slideLeft',
                    duration: 200
                },
                clearHistory: false,
            });
        },
        onImageLoaded(args) {
            var img = args.object;
            console.log("img.isLoading: " + img.isLoading);
            console.log("img.isLoaded: " + img.isLoaded);
        },
        randomScreen(args) {

          
            if(args.direction==1){

                   this.image = this.oldImage;
               
            } else {
                //  this.image = "~/images/logo_white.png";
                this.isLoading = true;
                this.seed = Math.random().toString(36).slice(2).substr(0, 6);
                firebase.analytics.logEvent({
                    key: "random_tap",
                    parameters: [ // optional
                        {
                            key: "random_id",
                            value: this.seed
                        }
                    ]
                }).then(
                    function() {
                        //console.log("Firebase Analytics event logged");
                    }
                );

                http.request({
                    url: "https://prnt.sc/" + this.seed,
                    method: "GET",

                }).then(response => {
                    const img = response.content.toString();
                    const paragraph = img;
                    const regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
                    const found = paragraph.match(regex);

                    if (found) {
                        
                        this.image = found[0];
                    } else {

                        this.seed = Math.random().toString(36).slice(2).substr(0, 6);
                        http.request({
                            url: "https://prnt.sc/" + this.seed,
                            method: "GET",

                        }).then(response => {
                            const img = response.content.toString();
                            const paragraph = img;
                            const regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
                            const found = paragraph.match(regex);

                            this.image = found[0];
                        });
                    }

                    this.isLoading = false;
                }, error => {
                    alert("Image has been deleted!");

                });

            }
          this.oldImage = this.image;
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
