import { LightningElement } from 'lwc';

export default class CurrencyConverter extends LightningElement {
  showOutput = false;
  fromCurrency='';
  toCurrency='';
  convertedValue='';
  enteredAmount='';
  currencyOptions=[];

  connectedCallback(){
    this.fetchSymbols();
  }
  changeHandler(event) {
    let {name,value} =event.target;
    if(name==='amount') this.enteredAmount=value;
    else if(name==='fromcurr') this.fromCurrency=value;
    else if(name==='tocurr') this.toCurrency=value;
   }
  clickHandler() { 
    this.conversion();
  }

  async fetchSymbols(){
    let endpoint='https://api.frankfurter.app/currencies';
    try{    
      let response= await fetch(endpoint);
      if(!response.ok){
        throw new Error('Network response is not OK.')
      }
      const data= await response.json();
      let options=[];
      for(let symbol in data){
        options=[...options,{label:symbol,value:symbol}];
      }
      this.currencyOptions=[...options];
      console.log('this.currencyOptions',this.currencyOptions);

    }catch(error){
        console.log(error)
    }
  }

  async conversion(){

    /*
  const host = 'api.frankfurter.app';
  fetch(`https://${host}/latest?amount=10&from=GBP&to=USD`)
  .then(resp => resp.json())
  .then((data) => {
    alert(`10 GBP = ${data.rates.USD} USD`);
  });
    */
    let endpoint=`https://api.frankfurter.app/latest?amount=${this.enteredAmount}&from=${this.fromCurrency}&to=${this.toCurrency}`;
    try{    
      let response= await fetch(endpoint);
      if(!response.ok){
        throw new Error('Network response is not OK.')
      }
      const data= await response.json();
      this.convertedValue=data.rates[this.toCurrency];
      this.showOutput=true;

    }catch(error){
        console.log(error)
    }
  }

  
}