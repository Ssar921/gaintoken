const address = '0x01c3b97a362e4d2242020446eca9d33448dc615d'
const contractAddress = '0x92a8771c925ec0812325546075be51e76d2f7123'

const rtoken = '0x1533B4b0392B864A842a4ec57c258c2c1ac73806'
const rholder = '0x1533B4b0392B864A842a4ec57c258c2c1ac73806'

const apiKey = 'XWM2KTJUPNI67QV5VEHD1CP68PRGGAXMS9'

// fetch('https://api.etherscan.io/api?module=account&action=tokentx&address=0x01c3b97a362e4d2242020446eca9d33448dc615d&contractaddress=0x92a8771c925ec0812325546075be51e76d2f7123')
// .then((response) => response.json())
// .then((res) => console.log(res))


// GET USER TOKENS
fetch(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${rtoken}&address=${rtoken}&apikey=${apiKey}`)
.then((response) => response.json())
.then((res) => {
    var amt = (res.result/(10**18)).toFixed(2)
    document.querySelector('#balance').innerHTML = `${amt} PAXG`
    convertCurrency(amt, 'pax-gold', 'usd')
})


// GET TOKEN VALUE

fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${rtoken}&tag=latest&apikey=${apiKey}`)
.then((response) => response.json())
.then((res) => {
    getHoldings(res.result/(10**18))
    document.querySelector('#balance').innerHTML = `${res.result/(10**18)}`
})


function getHoldings(ethValue){
    fetch(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR`)
    .then((response) => response.json())
    .then((res) => {
        document.querySelector('#balanceHolding').innerHTML = `$${(ethValue * res.USD).toFixed(2)}`
    })
}

async function convertCurrency(amount, fromCurrency, toCurrency) {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum,${fromCurrency}&vs_currencies=${toCurrency}`);
    const json = await response.json();
    
    var ethValue = (json["pax-gold"]["usd"] * amount).toFixed(2)
    document.querySelector('#balanceHolding').innerHTML = `$${ethValue} USD`
    trTable(ethValue)
}


// GET TRANSACTIONS FOR ADDRESS AND GET USER ETH DEPOSITED
fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=0x92a8771c925ec0812325546075be51e76d2f7123&apikey=${apiKey}`)
.then((response) => response.json())
.then((res) => {
    var fromVals = res.result.filter(sItem => sItem.from === '0x3b373de9a770e67e6b0b29ce443f50bf859f06e2');
    var ethDepo = 0
    fromVals.forEach(item => {
        ethDepo = ethDepo + item.value/(10**18)
    });
    document.querySelector('#ethDeposited').innerHTML = `${ethDepo} ETH`
    document.querySelector('#ethTier').innerHTML = `x ${getTier(ethDepo)}`
})



// GET TOKEN TRANSFERS OF USER
function trTable(price){
    fetch(`https://api.etherscan.io/api?module=account&action=tokentx&address=0x01c3b97a362e4d2242020446eca9d33448dc615d&contractaddress=0x92a8771c925ec0812325546075be51e76d2f7123&apikey=${apiKey}`)
    .then((response) => response.json())
    .then(res => {
        res.result.forEach(item => {
            var dateObj = new Date(item.timeStamp * 1000)
            const tbRows = document.createElement('tr')
            tbRows.innerHTML = `
                <td>${item.hash}</td>
                <td>${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}</td>
                <td>Action</td>
                <td>$${price}</td>
                <td>${item.value/(10**9)}</td>
                <td>$${((item.value/(10**9))*price).toFixed(2)}</td>
            `
            document.querySelector('.transaction-table').appendChild(tbRows)
        })
    })
}


function getTier(eth){
    if (eth < 0.2){
        return 0
    }
    else if (0.2 <= eth && eth <= 0.5){
        return 1
    }
    else if (0.5 < eth && eth <= 1){
        return 2
    }
    else if (1 < eth && eth <= 2){
        return 3
    }
    else if (2 < eth && eth <= 4){
        return 4
    }
    else if (4 < eth && eth <= 8){
        return 5
    }
    else if (8 < eth && eth <= 10){
        return 6
    }
    else if (eth > 10){
        return 7
    }
    else{
        return 'NA'
    }
}
