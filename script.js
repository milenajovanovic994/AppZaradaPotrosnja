// selektovanje postojeciih elemenata

const paragrafEl = document.querySelector('.budzet')
const paragrafBudzetEl = document.querySelector('.budzet-cifra')
const forma = document.querySelector('#forma')
const selekt = document.querySelector('#select')
const opis = document.querySelector('#opis')
const iznos = document.querySelector('#iznos')
const btn = document.querySelector('#btn')
const listaPrihodaEl = document.querySelector('.lista-prihodi')
const listaRashodaEl = document.querySelector('.lista-rashodi')
const ukPrihodEl = document.querySelector('.prihod-cifra')
const ukRashodEl = document.querySelector('.rashod-cifra')
const rashodProcenatEl = document.querySelector('.rashod-procenat')
const header = document.querySelector('#header')

paragrafBudzetEl.textContent = 0
ukPrihodEl.textContent = 0
ukRashodEl.textContent = 0
rashodProcenatEl.textContent = '0%'

// promenljive

let ukupnoP = 0
let ukupnoR = 0
let budzet = 0

// datum

let date = new Date()
let month = date.getMonth()
let year = date.getFullYear()

switch (month) {
    case 0:
        mesec = 'Januaru'
        break
    case 1:
        mesec = 'Februaru'
        break
    case 2:
        mesec = 'Martu'
        break
    case 3:
        mesec = 'Aprilu'
        break
    case 4:
        mesec = 'Maju'
        break
    case 5:
        mesec = 'Junu'
        break
    case 6:
        mesec = 'Julu'
        break
    case 7:
        mesec = 'Avgustu'
        break
    case 8:
        mesec = 'Septembru'
        break
    case 9:
        mesec = 'Oktobru'
        break
    case 10:
        mesec = 'Novembru'
        break
    case 11:
        mesec = 'Decembru'
        break
}

paragrafEl.textContent = `Dostupan budžet u ${mesec} ${year}:`

// submit event

let unosiPrihod = []
let unosiRashod = []
let unosiRashodProcenti = []


forma.addEventListener('submit', function (e) {
    e.preventDefault()

    let unos = {
        selekt: selekt.value,
        opis: opis.value,
        iznos: iznos.value,
    }

    // upisivanje u localStorage

    const opisLS = unos.opis
    const iznosLS = unos.iznos
    localStorage.setItem(opisLS, iznosLS)
    console.log(localStorage)

    // PRERACUNAVANJE

    let izbor = unos.selekt === 'opcija-prihod' ? 'prihod' : 'rashod'

    if (unos.opis !== ''
        && Number(unos.iznos) > 0
        && !isNaN(unos.iznos)) {

        // izracunavanje i upisivanje ukupnog prihoda i ukupnog rashoda

        if (izbor === 'prihod') {
            ukupnoP += Number(unos.iznos)
        } else {
            ukupnoR -= Number(unos.iznos)
        }

        document.querySelector(`.${izbor}-cifra`).textContent = izbor === 'prihod' ? `+${ukupnoP}` : `${ukupnoR}`

        // izracunavanje i upisivanje budzeta

        budzet = izbor === 'prihod' ? budzet + Number(unos.iznos) : budzet - Number(unos.iznos)
        paragrafBudzetEl.textContent = Number(budzet) >= 0 ? `+${budzet}` : `${budzet}`

        // procenti ukupnog rashoda

        let procenatRashoda = ukupnoP != 0 ? Math.round(Number(- ukupnoR) * 100 / ukupnoP) : 100

        rashodProcenatEl.textContent = `${procenatRashoda}%`

        // izracunavanje procenta svake stavke rashoda

        let procenatUnosa = ukupnoP != 0 ? Math.round(Number(unos.iznos) * 100 / ukupnoP) : 100

        const spanRashodProcenat = document.createElement('span')
        spanRashodProcenat.classList.add('li-rashod-procenat')

        // ubacivanje procenata u niz

        if (izbor === 'rashod') {
            unosiRashodProcenti.push(procenatUnosa)
        }

        // dodavanje na DOM

        // ako je odabran prihod u select dropdown-u

        if (izbor === 'prihod') {
            const unosPrihod = document.createElement('li')
            unosPrihod.classList.add('unos-prihod')
            const divPrihod = document.createElement('div')
            divPrihod.classList.add('div-prihod')
            const spanPrihod = document.createElement('span')
            spanPrihod.classList.add('li-prihod')
            spanPrihod.textContent = unos.opis
            const spanPrihodCifra = document.createElement('span')
            spanPrihodCifra.classList.add('li-prihod-cifra')
            spanPrihodCifra.textContent = `+${unos.iznos}`
            unosiPrihod.push(unos)

            // preracunavanje procenta svake stavke kad se unese novi prihod

            const procenat = function (ukupno) {
                let x
                for (let i = 0; i < unosiRashod.length; i++) {
                    x = Math.round(unosiRashod[i] * 100 / ukupno)
                    unosiRashodProcenti.splice(i, 1, x)
                }
                let listaProcenata = document.querySelectorAll('.li-rashod-procenat')
                for (let j = 0; j < listaProcenata.length; j++) {
                    for (let i = 0; i < unosiRashodProcenti.length; i++) {
                        if (j === i) {
                            listaProcenata[j].textContent = `${unosiRashodProcenti[i]}%`
                            if (listaProcenata[j].textContent === 'NaN%') {
                                listaProcenata[j].textContent = '0%'
                            }
                            if (listaProcenata[j].textContent === 'Infinity%') {
                                listaProcenata[j].textContent = '100%'
                            }
                        }
                    }
                }
            }

            procenat(ukupnoP)

            // brisanje stavke prihoda

            const btnDel = document.createElement('button')
            btnDel.classList.add('btn-del')
            btnDel.textContent = 'OBRIŠI'
            btnDel.addEventListener('click', () => {
                unosPrihod.remove()

                paragrafBudzetEl.textContent = Number(budzet -= Number(unos.iznos)) >= 0 ? `+${budzet}` : `${budzet}`

                ukPrihodEl.textContent = `+${ukupnoP -= Number(unos.iznos)}`

                rashodProcenatEl.textContent = `${Math.round(Number(- ukupnoR) * 100 / ukupnoP)}%`
                procenat(ukupnoP)
                if (rashodProcenatEl.textContent === 'NaN%') {
                    rashodProcenatEl.textContent = '0%'
                }
                if (rashodProcenatEl.textContent === 'Infinity%') {
                    rashodProcenatEl.textContent = '100%'
                }
            })

            listaPrihodaEl.appendChild(unosPrihod)
            unosPrihod.appendChild(divPrihod)
            divPrihod.append(spanPrihod, spanPrihodCifra, btnDel)

            opis.value = ''
            iznos.value = ''
        }

        // ako je odabran rashod u select dropdown-u

        else {
            const unosRashod = document.createElement('li')
            unosRashod.classList.add('unos-rashod')
            const divRashod = document.createElement('div')
            divRashod.classList.add('div-rashod')
            const spanRashod = document.createElement('span')
            spanRashod.classList.add('li-rashod')
            spanRashod.textContent = unos.opis
            const spanRashodCifra = document.createElement('span')
            spanRashodCifra.classList.add('li-rashod-cifra')
            spanRashodCifra.textContent = `-${unos.iznos}`
            unosiRashod.push(unos.iznos)

            // izracunavanje procenta svake stavke rashoda

            spanRashodProcenat.textContent = `${procenatUnosa}%`

            // brisanje stavke rashoda

            const btnDel = document.createElement('button')
            btnDel.classList.add('btn-del')
            btnDel.textContent = 'OBRIŠI'
            btnDel.addEventListener('click', () => {
                unosRashod.remove()

                paragrafBudzetEl.textContent = Number(budzet += Number(unos.iznos)) >= 0 ? `+${budzet}` : `${budzet}`

                ukRashodEl.textContent = `${ukupnoR += Number(unos.iznos)}`

                rashodProcenatEl.textContent = `${Math.round(Number(- ukupnoR) * 100 / ukupnoP)}%`
                if (rashodProcenatEl.textContent === 'NaN%') {
                    rashodProcenatEl.textContent = '0%'
                }
                if (rashodProcenatEl.textContent === 'Infinity%') {
                    rashodProcenatEl.textContent = '100%'
                }
            })

            listaRashodaEl.appendChild(unosRashod)
            unosRashod.appendChild(divRashod)
            divRashod.append(spanRashod, spanRashodCifra, spanRashodProcenat, btnDel)

            opis.value = ''
            iznos.value = ''
        }
    } else {
        if (unos.opis === '') {
            window.alert('Polje opisa prihoda i rashoda ne može biti prazno!')
        }
        else if (Number(unos.iznos) <= 0 || isNaN(unos.iznos)) {
            window.alert('U polju iznosa ne možete uneti negativan broj, nulu ili bilo koji karakter osim cifre! Takodje, zaokružite broj na dve decimale.')
        }
    }
})