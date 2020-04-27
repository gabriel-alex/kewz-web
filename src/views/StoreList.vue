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
import StoreData from "../data/store.json";

export default {
    components: {
        StoreCard1,
    },
    data() {
		return {
			stores: StoreData
		}
	}
}
</script>