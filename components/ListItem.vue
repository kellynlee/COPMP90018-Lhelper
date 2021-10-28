<template>
	<u-row>
			<u-col span="10"><p class="item-title">{{item.word}}</p></u-col>
			<u-col span="2">
				<u-icon v-if="item.star" name="heart-red" custom-prefix="custom-icon" color="#f06292"></u-icon>
			</u-col>
		</u-row>
		<p>{{"ADD TIME:"+item.added_time}}</p>
		<p>{{"HITS:"+getHits(item)}}</p>
		<u-row gutter="2" class="collapse-card" justify="space-around">
			<u-col span="4">
				<button class="button uni-button" @click="onClickStar(item,index)">
					<u-icon name="heart" custom-prefix="custom-icon"></u-icon>{{item.star? "Unstar":"Star"}}
					</button>
			</u-col>
			<u-col span="4"><button class="button uni-button"><u-icon name="pencil" custom-prefix="custom-icon"></u-icon>Review</button></u-col>
	</u-row>
</template>

<script>
		
	export default {
		props:{
			item:Object
		}
	}
</script>

<style>
</style>
