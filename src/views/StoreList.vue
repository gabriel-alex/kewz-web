<template>
    <v-container>
        <v-row>
            <v-col cols="12" lg="3" md="4" sm="6" v-for="store in stores" :key="`store-${store.id}`">
                <StoreCard1 :store=store></StoreCard1>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import StoreCard1 from "../components/StoreCard1";

export default {
    components: {
        StoreCard1,
    },
    data() {
		return {
			stores: [
                { id:1,
                name: "carrefour",
                address:"",
                postal_code:"54500",
                city:"Vandoeuvre",
                status:"open",
                logo:"./assets/640px-Carrefour_2009.svg.png",
                meantime: 10 },
                { id: 2,
                name: "match - Vélodrome",
                address:"square de liège",
                postal_code:"54500",
                city:"Vandoeuvre",
                status:"open",
                logo:"./assets/logo-match.gif",
                meantime: 20},
                { id: 3,
                name: "match - Vélodrome",
                address:"square de liège",
                postal_code:"54500",
                city:"Vandoeuvre",
                status:"open",
                logo:"./assets/logo-match.gif",
                meantime: 30},
                { id:4,
                name: "match - Vélodrome",
                address:"square de liège",
                postal_code:"54500",
                city:"Vandoeuvre",
                status:"open",
                logo:"./assets/logo-match.gif",
                meantime: 30},
                { id:5,
                name: "match - Vélodrome",
                address:"square de liège",
                postal_code:"54500",
                city:"Vandoeuvre",
                status:"open",
                logo:"./assets/logo-match.gif",
                meantime: 15},
                { id:6,
                name: "match - Vélodrome",
                address:"square de liège",
                postal_code:"54500",
                city:"Vandoeuvre",
                status:"open",
                logo:"./assets/logo-match.gif",
                meantime: 18}
            ]
		}
	}
}
</script>