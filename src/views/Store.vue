<template>
    <v-container>
        <v-row>
            <v-col v-for="store in stores" :key="`store-${store.id}`">
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
                { id:"1",
                name: "carrefour",
                address:"",
                postal_code:"54500",
                city:"Vandoeuvre",
                status:"open",
                logo:""},
                { id:"2",
                name: "match - Vélodrome",
                address:"square de liège",
                postal_code:"54500",
                city:"Vandoeuvre",
                status:"open",
                logo:""}
            ]
		}
	}
}
</script>