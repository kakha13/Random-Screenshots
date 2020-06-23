<template>
    <Page class="ns-dark" @loaded="pageLoaded">
        <ActionBar flat="true">
            <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
            <Label horizontalAlignment="center" text="Random Screens - Gallery" />
        </ActionBar>

			<RadListView layout="grid" itemHeight="100" for="item in items"  @itemTap="onItemTap">
				<v-template>
					<StackLayout class="grid-item" orientation="vertical">
						<Image height="200" borderRadius="5" stretch="aspectFill" :src="item.url"  />
                        <Label :text="item.category"></Label>
                        <Label text="DELETE" @tap="delItem(item.id)" :visibility="admin ? 'visible' : 'collapsed'"></Label>
					</StackLayout>
				</v-template>
			</RadListView>
      
        
    </Page>
</template>


<script>
import Home from "./Home";
import * as http from "http";
import firebase from "nativescript-plugin-firebase";
import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";

  import axios from "axios";
  export default {
    data() {
        return {
            items: [],
            admin:false,
           
        }
    },
    computed: {
      
       
    },
     mounted() {
           if(device.uuid == "178a73d1241f12e0") {
               this.admin = true;
           }

            axios({ method: "GET", "url": "https://yourwebsite.ge/screen/list.php" }).then(result => {
                this.items = result.data;
            }, error => {
                console.error(error);
            });

            firebase.analytics.setScreenName({
            screenName: "Gallery"
            }).then(
                function () {
                console.log("Gallery");
                }
            );
        },

    methods: {
        delItem: function(args){
            http.request({
                            url: "https://yourwebsite.ge/screen/delete.php",
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            content: JSON.stringify({
                                id: args,
                            })
                        }).then(response => {
                            console.log(response.content.toJSON());
                            console.log(response.content);
                        }, error => {
                            
                        });
        },
    onItemTap: function(event) {
        this.$navigateTo(Home, {
                props: {
                    url:this.$data.items[event.index].url,
                },
                transition: {
                    name: 'slideLeft',
                    duration: 200
                },
                
                clearHistory: false,
        });
        console.log("You tapped: " + this.$data.items[event.index].url);
    },
    
    

    }
  };
</script>

<style lang="scss" scoped>
   
</style>
