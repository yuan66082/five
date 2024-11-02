<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useConfigStore } from '../stores'
import {RefreshLeft} from '@element-plus/icons-vue'
// import { ElMessage } from 'element-plus';
const config = useConfigStore()
// 定义一个黑方或白方回合的开关
const side = ref(true)
// 定义一个是否显示重开的开关
const restart = ref(false)
// 容器con的ref值
const ref_con = ref()
// 白方和黑方分别用white和black两个数组来表示已落下的棋子
const white:number[] = []
const black:number[] = []
// 创建一个棋子的节点
const create_new = () => {
    const el = document.createElement('div')
    el.classList.add('new-el')
    el.classList.add('glass-white')
    if (side.value) el.classList.add('new-el-black')
    else el.classList.add('new-el-white')
    return el
}

// 鼠标移入棋子格子
const mouseenter = (event: any) => {
    if(event.target.classList.contains('el') && event.target.innerHTML === '')
    event.target.classList.add(side.value?'hover-black':'hover-white')
}
// 鼠标移出棋子格子
const mouseleave = (event: any) => {
    if(event.target.classList.contains('el'))
    event.target.classList.remove(side.value?'hover-black':'hover-white')
}
// 落子
const down = (event: any,i:any) => {
    if (event.target.classList.contains('el') && event.target.innerHTML === '') {
        // 移除可能存在的类
        event.target.classList.remove('hover-black')
        event.target.classList.remove('hover-white')
        // 新建棋子元素并放置
        const new_el = create_new()
        event.target.appendChild(new_el)
        if (!black.some(v=>v===Number(i)) && !white.some(v=>v===Number(i))) {
            side.value ? black.push(Number(i)) : white.push(Number(i))
            const win = isWin(i)
            if (win) {
            win.win.forEach(n => {
                
                const el = document.querySelector(`[number="${n}"]`)
                el?.classList.add('win')
            })
                restart.value = true
            // alert(`${win.side === 'black' ? '黑方' : '白方'}胜利`)
            document.querySelectorAll('.el').forEach(el=>{
                (el.innerHTML === '') && (el.innerHTML = '  ')
            })
            }
            side.value = !side.value
        }
        
    }
    
}

/**
 * 计算是否获胜
 */
 function isWin(number1:number | string) {
    const number = Number(number1)
    // 定义达成获胜条件的棋子数组的四种情况
    const win1 = []
    const win2 = []
    const win3 = []
    const win4 = []
    // 算出落子在第几行
    const y = Math.ceil(number / config.board_size)
    const x = number % config.board_size
    // 从落子向前4个子开始，算到向后4个子
    for (let i = number - (config.win_count - 1); i < number + config.win_count; i++){
        // 如果算出的前移或后移与落子不在一行，则跳过此次循环
        if (Math.ceil(i / config.board_size) !== y) continue
        // 根据side变量分别计算黑白，看是否各自的数组中是否包含落子处前后各4子的数字，有了就s+1
        if (side.value ? black.includes(i) : white.includes(i)) {
            win1.push(i)
         }
        // 没有连续加5 个子，s重置为0
        else win1.splice(0)
        // 如果达到获胜条件，则返回black或white
        if (win1.length === config.win_count) return {
            side: side.value ? 'black' : 'white',
            win: win1
        }
    }

    // 纵向是否有连续获胜条件
    for(let j = number - (config.win_count - 1) * config.board_size; j < number + config.win_count * config.board_size; j+=config.board_size){
        if (j % config.board_size !== x) continue
        if(j<1||j>config.board_size*config.board_size) continue
        if (side.value ? black.includes(j) : white.includes(j)) win2.push(j)
        else win2.splice(0)
        if (win2.length === config.win_count) return {
            side: side.value ? 'black' : 'white',
            win: win2
        }
    }

    // 反斜杠方向是否有连续获胜条件
    for(let j = number - (config.win_count - 1) * config.board_size - config.win_count + 1 ; j < number + config.win_count * config.board_size + config.win_count; j+=config.board_size+1){
        // if (j % (config.size + 1) !== x) continue
        if(j<1||j>config.board_size*config.board_size) continue
        if (side.value ? black.includes(j) : white.includes(j)) win3.push(j)
        else win3.splice(0)
        if (win3.length === config.win_count) return {
            side: side.value ? 'black' : 'white',
            win: win3
        }
        if(j%config.board_size===0) break
    }

    // 正斜杠方向是否有连续获胜条件

    for(let j = number - (config.win_count - 1) * config.board_size + config.win_count - 1 ; j < number + config.win_count * config.board_size - config.win_count + 1; j+=config.board_size-1){
        // if (j % (config.size - 1) !== x) continue
        if(j<1||j>config.board_size*config.board_size) continue
        if (side.value ? black.includes(j) : white.includes(j)) win4.push(j)
        else win4.splice(0)
        if (win4.length === config.win_count) return {
            side: side.value ? 'black' : 'white',
            win: win4
        }
        if (j % config.board_size === 1) break
    }
}
onMounted(() => {
    ref_con.value.style.setProperty('--count',config.board_size)
})


</script>
<template>
    <div>
        <el-alert 
        v-if="restart" 
        :title="`恭喜${side ? '白方' : '黑方'}获胜！`" 
        type="success" 
        effect="light" 
        close-text="重开" 
        show-icon
        @close="$router.go(0)"
        style="position: fixed;top:0px;width:350px;margin:0 auto;z-index:200"
        />
        <div id="con" ref="ref_con">
            <!-- 旋转棋子的格子，应当处于隐形状态，只有鼠标悬停及落子后方可显示 -->
            <div v-for="i in config.board_size * config.board_size" :key="i" :number="i" class="el" @mouseenter.self.stop="mouseenter($event)" @mouseleave="mouseleave($event)" @click="down($event,i)"></div>
            <!-- 棋盘格的线 -->
            <div v-for="i in config.board_size " :key="i" :style="'--n:'+ i " class="line-x"></div>
            <div v-for="i in config.board_size " :key="i" :style="'--n:'+ i " class="line-y"></div>
        </div>
    </div>
</template>
<style>
*{
    margin: 0 auto;
    padding: 0;
    --board-width:95vw;
    @media screen and (width>900px)  {
        --board-width:95vh;
    }
    @media screen and (width<900px)  {
        --board-width:95vw;
    }
}
#con{
    width: var(--board-width);
    height:var(--board-width);
    border:1px solid #333;
    display: grid;
    grid-template-rows: repeat(var(--count),1fr);
    grid-template-columns: repeat(var(--count),1fr);
    grid-gap:0;
    position: relative;
    
}
.el{
    width: calc(var(--board-width) / var(--count));
    height: calc(var(--board-width) / var(--count));
    position: relative;
    /* background-color: lightblue; */
    border-radius: 50%;
    transform: scale(0.9);
    z-index: 99; 
}
.line-x{
    position: absolute;
    width:calc(100% - (var(--board-width) / var(--count)));
    height:1px;
    background-color: red;
    left:calc(var(--board-width) / var(--count) / 2);
    top:calc(var(--n) * (var(--board-width) / var(--count)) -  (var(--board-width) / var(--count)) / 2)
}
.line-y{
    
    position: absolute;
    width: 1px;
    height:calc(100% - (var(--board-width) / var(--count)));
    background-color: red;
    top: calc(var(--board-width) / var(--count) / 2);
    left:calc(var(--n) *(var(--board-width) / var(--count)) -  (var(--board-width) / var(--count)) / 2)
}
.el.hover-black{
    cursor: pointer;
    background-color: #333;
}
.el.hover-white{
    cursor: pointer;
    background-color: #eee;
}
/* 落下的棋子的样式 */
.new-el-white{
    position: absolute;
    z-index: 100;
    inset: 0;
    border-radius: 50%;
    background-color: #fff1;
    /* border:0.5px solid #fff; */
    box-shadow: 2px 2px 10px 1px #333,inset -1px -1px 5px 1px #fffe,inset 1px 1px 8px 1px #3339;
    backdrop-filter: blur(10px);
}

.new-el-black{
    position: absolute;
    z-index: 100;
    inset: 0;
    border-radius: 50%;
    background-color: #000d;
    /* border:0.5px solid #fff; */
    box-shadow: 2px 2px 10px 1px #333,inset -1px -1px 5px 1px #fffe,inset 1px 1px 8px 1px #3339;
    backdrop-filter: blur(10px);
}
.new-el-white::after,.new-el-black::after{
    content:'';
    position: absolute;
    left:30%;
    top:30%;
    width: 20%;
    height:17%;
    background-color: #fffe;
    border-radius: 50%;
}
.win .new-el{
    animation: win 0.5s ease infinite alternate;
}
@keyframes win {
    from{
        
    }
    to{
        
        background-image: radial-gradient(#f00e,#0000);
    }
}
</style>