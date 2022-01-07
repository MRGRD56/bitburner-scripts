const n = '58441';
const result = -76;
const characters = ['', '+', '-', '*'];

for (const c0 of ['', '-']) {
    for (const c1 of characters) { 
        for (const c2 of characters) { 
            for (const c3 of characters) { 
                for (const c4 of characters) {
                    const expression = `${c0}${n[0]}${c1}${n[1]}${c2}${n[2]}${c3}${n[3]}${c4}${n[4]}`;
                    if (eval(expression) == result) {
                        console.log(`${expression} = ${result}`);
                    }
                }
            }
        }
    }
}

//5-84+4-1 = -76
