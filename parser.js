const messages = require('./mess.json');

function parseNames(str) {
  console.log(str)
  const regExp = new RegExp(/[А-Я][а-я]* [А-Я][а-я]*/g);
  return str.match(regExp);
}

function calcNames(anniversaryArr) {
  anniversaryArr.forEach((oneMes) => {
    const strings = oneMes.split('\n');
    let currentGroup = null;
    strings.forEach(str => {
      if(str.includes('5️⃣')){
        currentGroup = '5';
      }
      else if(str.includes('4️⃣')){
        currentGroup = '4';
      }
      else if(str.includes('3️⃣')){
        currentGroup = '3';
      }
      else if(str.includes('2️⃣')){
        currentGroup = '2';
      }
      else if(str.includes('1️⃣')){
        currentGroup = '1';
      }
  
      const namesArray = parseNames(str);
      if(namesArray) {
        if(res[currentGroup]) {
          res[currentGroup] += namesArray.length;
        } else {
          res[currentGroup] = namesArray.length;
        }
    
      }

  
    })
  });
}

const res = {};

const mes = messages.filter((m) => m.message).map((m) => m.message);

const anniversaryArr = mes.filter((m) => m.includes('1️⃣'));

calcNames(anniversaryArr)

console.log(res);





// console.log(anniversaryArr);
