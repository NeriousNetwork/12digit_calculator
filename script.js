'use strict';

//Calculator

//display
const display = document.getElementById('seg_dis');
const d_memory = document.querySelector('.memory');
const d_gt = document.querySelector('.gt');
const d_stall = document.querySelector('.stall');
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
const btn_mup = document.getElementById('btn--mup');
const btn_add = document.getElementById('btn--add');
const btn_eq = document.getElementById('btn--eq');

const oprs = [btn_eq, btn_add, btn_sub, btn_mul, btn_div, btn_prc]
//buttons - numerical
const btn_num = []
for (let i = 0; i < 10; i++) {//Iterates over all buttons with numbers and assigns it to an array
    btn_num[i] = document.getElementById(`btn--${i}`)
}
const btn_00 = document.getElementById('btn--00');
const btn_dec = document.getElementById('btn--.')


//defaul states
let state = false;
let mem = 0;
let total = 0;
let memory_active = false;
let register = ['', false]
let operation = 0;
let sum_array = [];
let simulate_zero = false;
let chain = false;
let eq_reg = ['', 0];
let stall = false;

//functions
const startup = function () {
    if (state === false) {
        //from off to on
        display.classList.remove('hidden');
        //set as 'on'
        state = true;
    } else {
        //if it is on, refresh all registers
        d_memory.classList.add('off');
        d_gt.classList.add('off')
        mem = 0;
        total = 0;
        memory_active = false;
        register = ['', false]
        operation = 0;
        sum_array = [];
        simulate_zero = false;
        chain = false;
        display.textContent = 0;
        tgl_stall(2);
    }
}
const tgl_stall = function (act) {
    if (act === 1) {
        d_stall.classList.add('on');
        d_stall.classList.remove('off');
        stall = true;
    } else {
        d_stall.classList.remove('on');
        d_stall.classList.add('off')
        stall = false
    }
}
const input = function (btnval) {
    //test
    if (state && !stall) {
        //simulate zero = from chain 
        //check if the length is leq 1, or if simulate zero is true
        if (simulate_zero == true || display.textContent.length <= 1) {
            //check if the text displayed is a '0' if it is so...
            if (display.textContent === '0' || simulate_zero == true) {
                console.log(simulate_zero)
                //if decimal was chosen and the number is 0, keep prefix zero
                if (btnval.textContent === '.') {
                    display.textContent == '0.'
                    simulate_zero = false;
                } else {
                    //replace the value
                    display.textContent = btnval.textContent;
                    //set total register
                    total = btnval.textContent * 1;
                    simulate_zero = false;
                }
            } else {
                //concatenate button value text
                display.textContent += btnval.textContent;
                //set new total
                total = (display.textContent) * 1;
            }
        } else {
            //use the restrict function in inputting the word
            display.textContent = restrict(1, display.textContent, btnval.textContent);
        }
    }
}
const restrict = function (type, a, b = '') {
    //Function restricts all inputs and outputs to twelve digits (13 letters if with decimal) and restricts decimals.
    //Output: 
    if (typeof a != 'string') {
        a = a.toString()
    }
    let isfloat = false;
    let len = 11;
    let combined = a + b;
    if (a.includes('.')) {
        len = 12;
        isfloat = true;
    }
    //Type one - normal input number
    if (type === 1) {
        //If length of a + b is greater than 12/13, disregard b
        if (combined.length > len) {
            return a
        } else if (b.includes('.') && isfloat == true) {
            //If trying to input a decimal but already float, ignore
            return a
        }
        //Else maintain combined
        total = combined * 1;
        console.log(total);
        return combined;
    } else if (type === 2) {
        //From operation
        let num_len
        num_len = a
        if (num_len.length > len) {
            tgl_stall(1);
            if (isfloat && num_len.substr(len - 1).includes('.')) {
                return num_len.substr(0, len - 1)

            }
            return num_len.substr(0, len)
        } else {
            return num_len
        }
    }
}
const arithmetic = function (ops) {
    let res = 0
    switch (ops) {
        case 1:
            //addition
            res = register[0] + total;
            break;
        case 2:
            //minus
            res = register[0] - total;
            break;
        case 3:
            //multiplication
            res = register[0] * total;
            break;
        case 4:
            //division
            res = register[0] / total;
            break;
        case 5:
            //percentage
            res = register[0] * (total / 100);
            console.log(res);
            break;
        // case 6:
        //     //markup
        //     res = register[0] / ((100 - total) / 100);
        //     console.log(res);
        //     break;
    }
    return res
}
const clause = function (ops) {
    let res = 0
    if (!stall && state) {
        if (chain) {
            if (total == 0 && display.textContent != '0') {
                operation = ops;
                console.log('Operation changed!')
            } else {
                res = restrict(2, arithmetic(operation));
                display.textContent = res;
                register[0] = res;
                total = 0;
                console.log(res)
                simulate_zero = true;
            }
        } else {
            register[0] = total;
            chain = true;
            total = 0;
            simulate_zero = true;
            operation = ops;
        }
    }
}
//     if (register[1] == true) {
//         register[1] = false;
//         res = register[0] + total;
//         display.textContent = res;
//         total = res;
//         register[0] = 0;
//     } else {
//         register[0] = total;
//         total = 0;
//         simulate_zero = true;
//         register[1] = true;
//     }
// }

//setting up event listeners
btn_on.addEventListener('click', startup)
//add to display when number buttons
for (let i = 0; i < 10; i++) {
    btn_num[i].addEventListener('click', function () {
        input(this);
        console.log(this)
    });
}
//set event listener for operations function
for (let i = 1; i < 6; i++) {
    oprs[i].addEventListener('click', function () {
        console.log(this, i);
        clause(i);
        console.log(total, register[0])
    });
}
btn_00.addEventListener('click', function () {
    input(btn_num[0]);
    input(btn_num[0]);
});
btn_dec.addEventListener('click', function () {
    input(this);
});
btn_eq.addEventListener('click', function () {
    let res
    console.log(operation)
    if (operation == 6) {
        console.log('chain eq')
        register[0] = total;
        total = eq_reg[0];
        operation = eq_reg[1];
        console.log(register[0], total, operation)
        res = restrict(2, arithmetic(operation))
        console.log(res)
        total = res;
        display.textContent = res;
        operation = 6;
    } else {
        console.log('normal eq')
        chain = false;
        res = restrict(2, arithmetic(operation));
        eq_reg = [total, operation]
        console.log(res);
        total = res;
        display.textContent = res;
        simulate_zero = false;
        register = ['', false];
        operation = 6;
        sum_array.push(total);
    }
});
btn_mup.addEventListener('click', function () {
    console.log('markup', operation)
    if (operation === 3 || operation === 4) {
        let mup
        console.log(total, register[0])
        if (operation == 3) {
            mup = register[0] + (register[0] * (total / 100))
        } else if (operation == 4) {
            mup = register[0] / (1 - (total / 100))
        }
        mup = restrict(2, mup);
        total = mup;
        display.textContent = mup;
        register = ['', false];
        simulate_zero = false;
        sum_array.push(total);
        operation = 0;
    }
});
btn_trnc.addEventListener('click', function () {
    if (!stall) {
        total = display.textContent.slice(0, -1) * 1;
        display.textContent = total;
    }
});


