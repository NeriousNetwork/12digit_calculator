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
   */
  #totals = []; //List of all appended results from '=' or 'MU'
  #memory_register = []; //list of all saved values in memory
  display_value = 0; //value of current display
  #state = false; //0 if calculator is off, 1 if on.
  #stall = false; //0 if stall is off, 1 if on

  constructor() {
    //get and log all the tags with 'data-display attributes'
    const interfaces = {}; //to prevent undefined error
    const dataelemattrib = document.querySelectorAll("[data-element]");
    dataelemattrib.forEach(function (node) {
      //pushes all buttons, displays and chassis to a dict
      //   console.log(node);
      //   console.log(node.dataset.display);
      //   console.log(interfaces);
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

    //sets chassis
    this.chassis = interfaces["container"]?.find(
      (container) => (container.dataset.container = "chassis")
    );
  }

  wipeMem() {
    this.#totals = [];
    this.label_display.textContent = 0;
    this.#totals = [];
    this.#memory_register = [];
    this.display_value = 0;
    this.stall(0);
  }
  onClear() {
    //turn on and clear handler
    console.log("On clear!");
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
      console.log("Locked!");
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
    } else {
      //unstall
      this.#stall = false;
      stall_display.classList.add("off");
    }
  }

  input(button) {
    if (!this.canAccept()) return;
    const btn_val = +button.dataset.value;
    console.log(button, btn_val);
    /*
      Handles button inputs from data-button: input elements
      */
    this.display_value = +`${this.display_value}${btn_val}`;
    this.label_display.textContent = +this.display_value;
  }

  display(value) {
    if (this.canAccept()) {
      this.display_value = +value;
      this.label_display.textContent = value;
      console.log(this);
    }
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
    let isfloat = false;
    if (prev % 1 != 0) {
      isfloat = true;
      maxdigit += 1;
    }
    //if length is > max digit, return false
    //else, return true
    //console.log(isfloat, maxdigit);
    if (String(+`${prev}${to_add}`).length > maxdigit) {
      return false;
    } else {
      return true;
    }
  }

  operationRestrictor;

  input(button) {
    console.log(button);
    const btn_val = +button.dataset.value;
    console.log(this.display_value, btn_val);
    if (this.inputRestrictor(this.display_value, btn_val)) {
      super.input(button);
    } else {
      console.log("Length restricted!");
    }
  }
}

const calculator = new TwelveDigit();
let calc = calculator;

calc.chassis.addEventListener("click", function (e) {
  if (e.target.dataset.element != "button") return;
  //
  const op = e.target.dataset.button;
  console.log(op);
  switch (op) {
    case "input":
      calc.input(e.target);
      return;
    case "onclear":
      calc.onClear();
      return;
    case "off":
      calc.turnOff();
      return;
  }
});
