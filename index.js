const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
})

let rate = [] //initialise rate variable

rl.on('line', (line) => {
  if (rate.length < 1){ //isolate first line of input.txt
    
    if (line == "CURRENT"){ //incorporating API call to retrieve current rate
      const axios = require('axios') //import axios for api call

      const url = 'https://pro-api.coinmarketcap.com' //defining url for api call
      const apiKey = '4741c372-fc2c-4c8c-9c47-1c7f9bd83a95' //defining api key
      const symbolList = 'BTC,ETH,DOGE' //defining currencies that should be retrieved
    
      const options = { // storing apikey and symbols in options
        headers: {
          'X-CMC_PRO_API_KEY': apiKey
        },
        params: {
          symbol: symbolList
        }
      }

      axios.get(url, options) //attempt api call
      .then(response => { // data processing should API call succeed
        const { data } = response;
        const rates = {};

        data.data.forEach(({ symbol, quote }) => {
          const { price } = quote.USD;
          rates[symbol] = price;
        })

        rate = [rates['BTC'], rates['ETH'], rates['DOGE']] // storing retrieved currency rates in rate list
      })
      .catch(error =>{ //log error if api call fails
        console.log(error.message)
      })

    } else{ //triggered if rate is provided, no api call needed

      rate = line.split(" ") // defines the rate based on the first line
      rate = rate.map((oneRate) => parseFloat(oneRate)) //convert each indivdual rate into float

    }


  } else{
    const [ethRate, saleDP, purchaseCurrency, purchaseAmt] = line.split(' ') //defines variables based on input string

    let purchaseAmtInEth //initialise purchaseAmtInEth variable

    switch (purchaseCurrency) { //calculate purchaseAmtInEth based on purchase currency
      case 'ETH': //calculations for purchase currency = eth, no additional calculations needed
        purchaseAmtInEth = parseFloat(purchaseAmt);
        break
      case 'BTC': //calculations for purchase currency = btc, conversion of btc to eth
        purchaseAmtInEth = parseFloat(purchaseAmt) * rate[0] / rate[1];
        break
      case 'DOGE': //calculations for purchase currency = doge, conversion of doge to eth
        purchaseAmtInEth = parseFloat(purchaseAmt) * rate[2] / rate[1];
        break
      default: //handling unexpected currency
        throw new Error(`Unsupported purchase currency: ${purchaseCurrency}`)
    }

    const saleAmt = purchaseAmtInEth * ethRate //calculating sale amth based on amount in eth
    const roundedSaleAmt = Math.floor(saleAmt * Math.pow(10, saleDP)) / Math.pow(10, saleDP) //rounding
    console.log(roundedSaleAmt) //logging output
    
  }
  
})

