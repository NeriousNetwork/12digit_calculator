"use strict";

//Calculator

class Calculator {
  /*
Describes a calculator generic class (not essentially just a 12-digit calculator)
display = an array of all editable elements in the display
buttons = an array of all buttons in the calculator
*/
  #operations = []; //List of all operations in tuples (stored value, operation)
  /*
  0 - Reserved
  1 - Addition
  2 - Subtraction
  3 - Multiplication
  4 - Division
  5 - 'Percentage'
  6 - 'Mark-Up'
  7 - 'Truncate' //should be added to just Calculator?
  99 - Equals
   */
  #totals = []; //List of all appended results from '=' or 'MU'
  #memory_register = 0; //list of all saved values in memory
  #grandtotal_register = [];
  display_value = 0; //value of current display
  display_valuestr = "";
  #state = false; //0 if calculator is off, 1 if on.
  #stall = false; //0 if stall is off, 1 if on
  #simulatezero = false; //a simulate zero
  lastpressed;
  //chain = false;
  #equalsoperation = [];
  constructor() {
    //get and log all the tags with 'data-display attributes'
    const interfaces = {}; //to prevent undefined error
    const dataelemattrib = document.querySelectorAll("[data-element]");
    dataelemattrib.forEach(function (node) {
      //pushes all buttons, displays and chassis to a dict
      //   //(node);
      //   //(node.dataset.display);
      //   //(interfaces);
      if (interfaces === undefined) {
        interfaces[node.dataset.element] = [node];
      }
      if (node.dataset.element in interfaces) {
        interfaces[node.dataset.element].push(node);
      } else {
        interfaces[node.dataset.element] = [node];
      }
    });
    //set buttons array
    this.interfaces = interfaces;

    //set display node
    this.label_display = interfaces["display"].find(
      (display) => display.dataset.display == "on"
    );
    this.label_memory = interfaces["display"].find(
      (display) => display.dataset.display == "memory"
    );

    this.label_grandtotal = interfaces["display"].find(
      (display) => display.dataset.display == "grandTotal"
    );
    //sets chassis
    this.chassis = interfaces["container"]?.find(
      (container) => container.dataset.container == "chassis"
    );
  }

  wipeMem() {
    /*
      Wipes all registers and storage. Usually used for off/clear.
    */
    this.display(0);
    this.#totals = [];
    this.label_display.textContent = 0;
    this.#totals = [];
    this.#memory_register = 0;
    this.display_valuestr = "";
    this.display_value = 0;
    this.#grandtotal_register = [];

    this.#simulatezero = false;
    //this.chain = false;
    calc.label_memory.classList.remove("on");
    calc.label_memory.classList.add("off");
    this.#operations = [];
    this.#equalsoperation = [];
    this.stall(0);
    this.label_grandtotal.classList.add("off");
    this.label_grandtotal.classList.remove("on");
  }

  onClear() {
    //turn on and clear handler
    //("On clear!");
    if (this.#state == true) {
      this.wipeMem();
      //remove stall
    } else {
      //turn on
      this.label_display.classList.remove("hidden");
      this.#state = true;
      this.stall(0);
    }
  }

  turnOff() {
    //off handler
    if (this.#state === true) {
      this.#state = false;
      this.label_display.classList.add("hidden");
      this.wipeMem();
    }
  }

  canAccept() {
    //Generalized can-accept, returns false if state is 0 or stall is 1
    if (this.#state == true && this.#stall == false) {
      return true;
    } else {
      //("Locked!");
      return false;
    }
  }

  stall(flip = 1) {
    //Stalls (1) or unstalls (0) the calculator
    const stall_display = this.interfaces["display"].find(
      (display) => display.dataset.display == "halt"
    );
    if (flip) {
      //stall
      this.#stall = true;
      stall_display.classList.remove("off");
      stall_display.classList.add("on");
    } else {
      //unstall
      this.#stall = false;
      stall_display.classList.add("off");
      stall_display.classList.remove("on");
    }
  }

  input(button) {
    if (!this.canAccept()) return;
    const btn_val = button.dataset.value;
    /*
      Handles button inputs from data-button: input elements
      */

    //simulate zero handler
    if (this.#simulatezero) {
      //simulate zero handler
      this.display_valuestr = "";
      this.display_value = 0;
      this.#simulatezero = false;
    }
    if (this.display_valuestr.includes(".") && btn_val === ".") return; //reject already decimal
    this.display_valuestr = `${this.display_valuestr}${btn_val}`;
    this.display_value = +`${this.display_value}${btn_val}`;
    if (+this.display_valuestr === this.display_value) {
      //if the numerical version of the string is similar to the numerical variable, display and end
      this.label_display.textContent = +this.display_value;
    } else {
      //decimal handler
      //(this.display_valuestr, this.display_value);
      if (this.display_valuestr.slice(-1) === ".") {
        //checks if the last index of the string is a decimal, then if it is, it displays the display value with a decimal literal
        this.label_display.textContent = `${this.display_value}.`;
      } else {
        if (this.display_valuestr.includes(".")) {
          //returns the display value.
          this.display_value = +`${this.display_valuestr}`;
          this.label_display.textContent = +this.display_value;
        }
      }
    }
  }

  display(value) {
    //generalized function to show something on the calculator screen
    if (this.canAccept()) {
      this.label_display.classList.add("hidden");
      this.display_value = +value;
      this.label_display.textContent = value;
      setTimeout(() => this.label_display.classList.remove("hidden"));

      //grandtotal handler
      if (!+value) return;
      if (+value === this.grandTotal) {
        this.label_grandtotal.classList.remove("off");
        this.label_grandtotal.classList.add("on");
      } else {
        this.label_grandtotal.classList.add("off");
        this.label_grandtotal.classList.remove("on");
      }
    }
  }

  computation(a, b = 0, operation = 0) {
    //generalized function for all arithmetic
    let res;
    switch (operation) {
      case 0:
        //fallback
        return a;
      case 1:
        //Addition
        res = a + b;
        break;
      case 2:
        res = a - b;
        break;
      case 3:
        //Multiplication
        res = a * b;
        break;
      case 4:
        //Division
        res = a / b;
        break;
      case 5:
        res = a * (b / 100);
        break;
      //Percentage
      case 6:
        //Mark-up
        const [, last_op] = this.lastOperation;
        if (last_op === 3) {
          res = a + a * (b / 100);
        } else if (last_op === 4) {
          res = a / (1 - b / 100);
        } else {
          res = undefined;
        }
      //case 7:
      //Truncate available as method
      //case 99:
      //Equality available as a method
    }
    return res;
  }
  truncate() {
    this.display_valuestr = this.display_valuestr.slice(0, -1);
    //(this.display_valuestr);
    if (this.display_valuestr == "") {
      this.display_value = 0;
      this.display(0);
      this.display_valuestr = 0 + "";
    } else {
      this.display_value = +this.display_valuestr;
      this.display_valuestr = this.display_value + "";
      this.display(this.display_value);
    }
  }
  restDisplay(res) {
    this.display_value = res;
    this.display_valuestr = res + "";
    this.#simulatezero = true;
    this.display(res);
  }
  operation(btn, style = 1) {
    let btn_val;
    if (btn.dataset?.operation) {
      btn_val = +btn.dataset.operation;
    } else {
      btn_val = btn;
    }
    const last_op = this.lastOperation;
    let res;
    //("In operation", btn_val);

    if (btn_val === 7) {
      this.truncate();
      return;
    }
    if (!last_op) {
      this.#operations.push([this.display_value, btn_val, true]);
      this.#simulatezero = true;
      //("No last op");
      return;
    } else {
      //percentage handler
      if (btn_val === 5 || btn_val === 6) {
        res = this.computation(last_op[0], this.display_value, btn_val);
        if (!res) return;
        this.restDisplay;
        this.#grandtotal_register.push(res);
        this.#operations.push([this.display_value, 99, false]);
        this.#operations.push(res, 0, false);
        return res;
      }
      //equals hander
      if (last_op[1] === 99 && btn_val === 99) {
        res = this.computation(
          this.display_value,
          this.#equalsoperation[0],
          this.#equalsoperation[1]
        );
        this.restDisplay(res);
        this.#grandtotal_register.push(res);
        this.#operations.push([res, 99, false]);
        return res;
      } else {
        if (this.#simulatezero == true) {
          this.#operations.push([this.display_value, btn_val, true]);
          this.#simulatezero = true;
          return;
        }
        //("Last operation not an equal operation");
        if (last_op[2] == false) {
          //("Appending empty operation.");
          this.#operations.push([this.display_value, btn_val, true]);
          this.#simulatezero = true;
        } else {
          //("Performing operation");
          res = this.computation(last_op[0], this.display_value, last_op[1]);
          //(calc);

          this.#simulatezero = true;
          if (style === 1) this.display(res);
          if (btn_val === 99) {
            this.#operations.push([res, btn_val, false]);
            this.#grandtotal_register.push(res);
          } else {
            this.#operations.push([res, btn_val, true]);
          }
        }
      }
    }
    return res;
  }

  equals() {
    const last_op = this.lastOperation;
    if (!last_op) return;
    if (last_op[1] === 99) {
      //read from this.#equalsoperation
      this.operation(99);
    } else {
      this.#equalsoperation = [this.display_value, last_op[1]];
      this.operation(99);
    }

    //append
  }

  grandTot() {
    const total = this.grandTotal;
    this.restDisplay(total);
    this.display(total);
    this.#operations.push([this.display_value, 0, false]);
  }

  memory(btn) {
    const fx = btn.dataset.memory;
    this.#simulatezero = true;
    switch (fx) {
      case "memory_recall":
        this.memory_recall();
        calc.label_memory.classList.remove("on");
        calc.label_memory.classList.add("off");
        return;
      case "memory_add":
        this.#memory_register += +this.display_value;
        return;
      case "memory_subtract":
        this.#memory_register -= +this.display_value;
        return;
    }
  }

  memory_recall() {
    //(this.lastpressed);
    if (this.lastpressed.dataset?.memory == "memory_recall") {
      //("Memory clear!");
      this.#memory_register = 0;
    }

    this.restDisplay(this.#memory_register);
    this.display(this.#memory_register);
  }
  get grandTotal() {
    if (this.#grandtotal_register.length === 0) return 0;
    return this.#grandtotal_register.reduce((acc, cur) => acc + cur);
  }

  get lastOperation() {
    return this.#operations.slice(-1)[0];
  }

  get lastMemory() {
    return this.#memory_register.slice(-1)[0];
  }
}

class TwelveDigit extends Calculator {
  /*
    Identifies a twelve_digit restricted calculator
*/
  #maxdigit = 0;
  constructor() {
    super();
    this.#maxdigit = 11;
  }

  inputRestrictor(prev, to_add) {
    let maxdigit = this.#maxdigit;
    //if length is > max digit, return false
    //else, return true
    ////(isfloat, maxdigit);
    if (`${prev}${to_add}`.includes(".")) maxdigit++;
    if (String(+`${prev}${to_add}`).length > maxdigit) {
      return false;
    } else {
      return true;
    }
  }

  operationRestrictor(restrict) {
    let maxdigit = this.#maxdigit;
    const restrict_str = String(restrict);

    if (restrict_str.length > maxdigit || restrict_str.includes("e")) {
      if (
        restrict_str.slice(0, maxdigit + 1).includes(".") &&
        !restrict_str.includes("e")
      ) {
        return +restrict_str.slice(0, maxdigit + 1);
      } else {
        this.display(+restrict_str.slice(0, maxdigit));
        this.stall();
      }
    } else {
      return restrict;
      //no restricting
    }
  }

  input(button) {
    if (!this.canAccept()) return;
    //(button);
    const btn_val = button.dataset.value;
    //(this.display_value, btn_val);
    if (this.inputRestrictor(this.display_value, btn_val)) {
      super.input(button);
    } else {
      //("Length restricted!");
    }
  }

  operation(button) {
    if (!this.canAccept()) return;
    const res = super.operation(button, 0);
    if (Number.isFinite(res)) {
      const restricted = this.operationRestrictor(res);
      this.display_valuestr = restricted + "";
      this.display(restricted);
    }
  }
}

const calculator = new TwelveDigit();
let calc = calculator;

const btnClickHandler = function () {
  const rand = Math.floor(Math.random() * 4);
  new Audio(`src/audio/sound--${rand}.mp3`).play();
};
calc.chassis.addEventListener("click", function (e) {
  if (e.target.dataset.element != "button") return;
  //
  const op = e.target.dataset.button;
  btnClickHandler();

  //(op);
  switch (op) {
    case "input":
      calc.input(e.target);
      break;
    case "onclear":
      calc.onClear();
      break;
    case "off":
      calc.turnOff();
      break;
    case "operation":
      calc.operation(e.target);
      break;
    case "equals":
      calc.equals();
      break;
    case "memory":
      calc.label_memory.classList.remove("off");
      calc.label_memory.classList.add("on");
      calc.memory(e.target);
      break;
    case "grandTotal":
      calc.grandTot();
      break;
  }
  calc.lastpressed = e.target;
});
