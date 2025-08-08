function computerMove(){
  let compRun;
  let compMove = Math.random(); 

   if(compMove < (1/6)){
    compRun = 1;
   } else if (compMove < (2/6)){
    compRun = 2;
   } else if (compMove < (3/6)){
    compRun = 3;
   } else if (compMove < (2/6)){
    compRun = 4;
   } else if (compMove < (2/6)){
    compRun = 5;
   } else {
    compRun = 6;
   }

   console.log(compRun);
}
