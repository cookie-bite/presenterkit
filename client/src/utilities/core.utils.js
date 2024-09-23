export const getColor = (color) => {
    const colors = {
        '--label-1': '#FFFFFF',
        '--label-2': '#EBEBF599',
        '--label-3': '#EBEBF54D',
        '--label-4': '#EBEBF52E',
        '--placeholder': '#EBEBF54C',

        '--tint': '#0A84FF',
        '--bg-tint': '#141622',

        '--fill-1': '#7878805C',
        '--fill-2': '#78788052',
        '--fill-3': '#7676803E',
        '--fill-4': '#7474802E',

        '--glass-1': '#202020EC',
        '--glass-2': '#252525C8',
        '--glass-3': '#2525259A',
        '--glass-4': '#46464680',

        '--glass-line': '#FFFFFF4D',

        '--line-o': '#38383A',
        '--line-no': '#545458A6',

        '--bg-1': '#000000',
        '--bg-2': '#1C1C1E',
        '--bg-3': '#2C2C2E',
        '--bg-4': '#3A3A3C',

        '--gray-1': '#8E8E93',
        '--gray-2': '#636366',
        '--gray-3': '#48484A',
        '--gray-4': '#3A3A3C',
        '--gray-5': '#2C2C2E',
        '--gray-6': '#1C1C1E',

        '--link': '#0984FFFF',

        '--dark-text': '#000000FF',
        '--light-text': '#FFFFFF99',

        '--black': '#000000',
        '--white': '#FFFFFF',

        '--blue': '#0A84FF',
        '--green': '#30D158',
        '--indigo': '#5E5CE6',
        '--orange': '#FF9F0A',
        '--pink': '#FF375F',
        '--purple': '#BF5AF2',
        '--red': '#FF453A',
        '--teal': '#64D2FF',
        '--yellow': '#FFD60A',

        '--d1': '#64D2FF',
        '--d2': '#BF5AF2',
        '--d3': '#FFD60A',
    }

    return colors.hasOwnProperty(color) ? colors[color] : `${color}`
}


export const genColor = () => {
    const h = { min: 0, max: 360 }
    const s = { min: 50, max: 100 }
    const l = { min: 30, max: 70 }

    const hslToHex = (h, s, l) => {
        l /= 100
        const a = s * Math.min(l, 1 - l) / 100
        const f = n => {
            const k = (n + h / 30) % 12
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
            return Math.round(255 * color).toString(16).padStart(2, '0')
        }
        return `#${f(0)}${f(8)}${f(4)}`
    }

    const random = (x) => {
        return +(Math.random() * (x.max - x.min) + x.min).toFixed()
    }

    const r = { h: random(h), s: random(s), l: random(l) }

    return hslToHex(r.h, r.s, r.l)
}


export const genQuest = (type = 'long') => {
    const usernames = [
        'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen',
        'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminum', 'Silicon', 'Phosphorus', 'Sulfur',
        'Chlorine', 'Argon', 'Potassium', 'Calcium', 'Scandium', 'Titanium', 'Vanadium', 'Chromium',
        'Manganese', 'Iron', 'Cobalt', 'Nickel', 'Copper', 'Zinc', 'Gallium', 'Germanium', 'Arsenic',
        'Selenium', 'Bromine', 'Krypton', 'Rubidium', 'Strontium', 'Yttrium', 'Zirconium', 'Niobium',
        'Molybdenum', 'Technetium', 'Ruthenium', 'Rhodium', 'Palladium', 'Silver', 'Cadmium', 'Indium',
        'Tin', 'Antimony', 'Tellurium', 'Iodine', 'Xenon', 'Cesium', 'Barium', 'Lanthanum', 'Cerium',
        'Praseodymium', 'Neodymium', 'Promethium', 'Samarium', 'Europium', 'Gadolinium', 'Terbium',
        'Dysprosium', 'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium', 'Hafnium', 'Tantalum',
        'Tungsten', 'Rhenium', 'Osmium', 'Iridium', 'Platinum', 'Gold', 'Mercury', 'Thallium', 'Lead',
        'Bismuth', 'Polonium', 'Astatine', 'Radon', 'Francium', 'Radium', 'Actinium', 'Thorium',
        'Protactinium', 'Uranium', 'Neptunium', 'Plutonium', 'Americium', 'Curium', 'Berkelium',
        'Californium', 'Einsteinium', 'Fermium', 'Mendelevium', 'Nobelium', 'Lawerencium', 'Rutherfordium',
        'Dubnium', 'Seaborgium', 'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium', 'Roentgenium',
        'Copernicium', 'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium', 'Tennessine', 'Oganesson'
    ]

    const short = [
        'What is a file?',
        'What is an array?',
        'What is a chipset?',
        'What is inheritance?',
        'What is an Interface?',
        'What is deep learning?',
        'What is a constructor?',
        'What is a microprocessor?',
        'What is machine learning?',
        'What is a class variable?',
        'What is an abstract class?',
        'What is an operating system?',
        'What do you mean by destructor?',
        'What is a programming language?',
        'What is artificial intelligence?',
        'What is the thread in programming?',
        'What are the different OOPS principles?',
        'What is a Software Development Life Cycle?',
        'What is Integrated Development Environment?'
    ]

    const long = [
        'What is a character stream?',
        'What is a default and conversion constructor?',
        'What is a deadlock, and how can you prevent it?',
        'What is garbage collection, and how does it work?',
        'How do you approach problem-solving in your work?',
        'What is the difference between overriding and overloading?',
        'What is the difference between a compiler and an interpreter?',
        'What are the advantages and disadvantages of multiple inheritance?',
        'How do you handle working on multiple projects or tasks simultaneously?',
        'How do you stay current with the latest developments and trends in computer science?',
        'Can you walk us through your experience with a specific programming language or technology?',
        'Can you tell us about a time when you had to learn new technology quickly and how you went about it?',
        'Can you give an example of how you have applied your technical skills to provide a business solution?',
        'Can you give an example of a project where you had to work with a team and how you contributed to its success?',
        'Can you tell us about a particularly challenging project you have worked on and how you overcame any obstacles?',
        'Can you give an example of a time when you had to explain a complex technical concept to a non-technical audience?',
        'Can you give an example of a time when you had to troubleshoot a technical issue and how you went about solving it?'
    ]

    const questions = { short, long }


    return (
        {
            username: usernames[Math.floor(Math.random() * usernames.length)],
            quest: { label: questions[type][Math.floor(Math.random() * questions[type].length)], color: genColor() }
        }
    )
}


export const clamp = (a, n, x) => {
    return a <= n ? n : a >= x ? x : a
}


export const wrap = (text, count = 4) => {
    let temp = 0
    return [...text].map(c => { if (c === ' ') { if (temp === count) { temp = 0; return '\n' } else temp++; return c } else return c }).join('')
}


export const calcRows = (users) => {
    return Math.ceil(Math.sqrt(users + 9) - 3)
}


export const isValidUrl = (url) => {
    return (new RegExp('^(https?:\\/\\/)?' + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + '((\\d{1,3}\\.){3}\\d{1,3}))' + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + '(\\?[;&a-z\\d%_.~+=-]*)?' + '(\\#[-a-z\\d_]*)?$', 'i')).test(url)
}