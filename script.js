'use strict';

//Calculator

//display
const display = document.getElementById('seg_dis');
const d_memory = document.querySelector('.memory');
const d_gt = document.querySelector('.gt');
//buttons - functions
const btn_on = document.getElementById('btn--on');
const btn_madd = document.getElementById('mem-add');
const btn_msub = document.getElementById('mem--sub');
const btn_mrec = document.getElementById('mem--recall');
const btn_gt = document.getElementById('mem-gt');
const btn_off = document.getElementById('btn--off')

const btn_div = document.getElementById('btn--div');
const btn_trnc = document.getElementById('btn--trunc');
const btn_mul = document.getElementById('btn--mul');
const btn_prc = document.getElementById('btn--prc');
const btn_sub = document.getElementById('btn--min');
const btn_mup = document.getElementById('btn--min');
const btn_add = document.getElementById('btn--add');
const btn_eq = document.getElementById('btn--eq');

//buttons - numerical
const btn_num = []
for (let i = 0; i < 10; i++) {
    btn_num[i] = document.getElementById(`btn--${i}`)
}
console.log(btn_num)
const btn_00 = document.getElementById('btn--00');
const btn_dec = document.getElementById('btn--.')

let state = false;
let mem = 0;
let total = 0;
let memory_active = false;
let register = ['', false]
let operation = 0;
let sum_array = [];
let simulate_zero = false;

//functions
const startup = function () {
    if (state === false) {
        //off
        display.classList.remove('hidden');
        state = true;
    } else {
        d_memory.classList.add('off');
        d_gt.classList.add('off')
        sum_array = []
        mem = 0;
        total = 0;
        memory_active = false
        display.textContent = '0';
    }
}
const input = function (btnval) {
    if (state) {
        if (display.textContent.length <= 1 || simulate_zero == true) {
            if (display.textContent === '0' || simulate_zero == true) {
                if (btnval.textContent === '.') {
                    display.textContent == '0.'
                } else {
                    display.textContent = btnval.textContent;
                    total = btnval.textContent * 1;
                }
            } else {
                display.textContent += btnval.textContent;
                total = (display.textContent + btnval.textContent) * 1;
            }
        } else {
            display.textContent = restrict(1, display.textContent, btnval.textContent);
        }
    }
    simulate_zero = false;
}
const restrict = function (type, a, b) {
    let isfloat = false;
    let len = 11;
    let combined = a + b;
    if (a.includes('.')) {
        len = 12;
        isfloat = true;
    }
    //inputting numbers
    if (type === 1) {
        if (combined.length > len) {
            return a
        } else if (b.includes('.') && isfloat == true) {
            return a
        }
        total = combined * 1;
        console.log(total);
        return combined;
    }
}

const clause = function (ops) {
    let res = 0
    if (register[1] == true) {
        register[1] = false;
        res = register[0] + total;
        display.textContent = res;
        total = res;
        register[0] = 0;
    } else {
        register[0] = total;
        total = 0;
        simulate_zero = true;
        register[1] = true;
    }
}

btn_on.addEventListener('click', startup)
//add to display when number buttons
for (let i = 0; i < 10; i++) {
    btn_num[i].addEventListener('click', function () {
        input(this);
    });
}
btn_00.addEventListener('click', function () {
    input(btn_num[0]);
    input(btn_num[0]);
})
btn_dec.addEventListener('click', function () {
    input(this);
})
btn_add.addEventListener('click', function () {
    clause(1)
})
