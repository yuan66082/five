import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore(
	'config',
	() => {
		// 棋盘大小
		const board_size = ref(10)
		// 连续多少棋子为胜利，默认为5
		const win_count = ref(5)

		return { board_size, win_count }
	},
	{
		persist: true,
	}
)
