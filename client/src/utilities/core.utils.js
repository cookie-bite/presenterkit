export const genColor = () => {
    const hexToHsl = (hex) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        var r = parseInt(result[1], 16)
        var g = parseInt(result[2], 16)
        var b = parseInt(result[3], 16)
        r /= 255, g /= 255, b /= 255
        var max = Math.max(r, g, b), min = Math.min(r, g, b)
        var h, s, l = (max + min) / 2
        if (max == min) {
            h = s = 0 // achromatic
        } else {
            var d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6
        }

        h = Math.round(h * 360)
        s = Math.round(s * 100)
        l = Math.round(l * 100)

        return { h, s, l }
    }

    const hslToHex = (h, s, l) => {
        l /= 100
        const a = s * Math.min(l, 1 - l) / 100
        const f = n => {
            const k = (n + h / 30) % 12
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
            return Math.round(255 * color).toString(16).padStart(2, '0')   // convert to Hex and prefix "0" if needed
        }
        return `#${f(0)}${f(8)}${f(4)}`
    }

    const color = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padEnd(6, 'f')}`
    return hslToHex(hexToHsl(color).h, hexToHsl(color).s < 30 ? 100 - hexToHsl(color).s : hexToHsl(color).s, hexToHsl(color).l < 50 ? 100 - hexToHsl(color).l : hexToHsl(color).l)
}


export const clamp = (a, n, x) => {
    return a <= n ? n : a >= x ? x : a
}


export const wrap = (text, count = 4) => {
    let temp = 0
    return [...text].map(c => { if (c === ' ') { if (temp === count) { temp = 0; return '\n' } else temp++; return c } else return c }).join('')
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

export const isValidUrl = (url) => {
    return (new RegExp('^(https?:\\/\\/)?' + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + '((\\d{1,3}\\.){3}\\d{1,3}))' + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + '(\\?[;&a-z\\d%_.~+=-]*)?' + '(\\#[-a-z\\d_]*)?$', 'i')).test(url)
}