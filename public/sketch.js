const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const addButton = document.getElementById('addCircle');

let myData = [];
let myDots = [];
const colors = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "RebeccaPurple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];

// Fetch initial data
async function loadData() {
    const response = await fetch('/api');
    myData = await response.json();
    updateMyDots();
}

function updateMyDots() {
    myDots = [];
    for (let item of myData) {
        myDots.push(new Dot(item.x, item.y, item.color, item._id));
    }
    draw();
}

function draw() {
    ctx.fillStyle = '#c8c8c8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    myDots.forEach(dot => dot.display());
}

class Dot {
    constructor(x, y, color, id) {
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.id = id;
        this.color = color;
    }

    async remove() {
        const response = await fetch(`/api/${this.id}`, {
            method: 'DELETE'
        });
        await loadData();
    }

    async updateColor() {
        const colorSelection = colors[Math.floor(Math.random() * colors.length)];
        const response = await fetch(`/api/${this.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ color: colorSelection })
        });
        await loadData();
    }

    display() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

async function handlePost() {
    const colorSelection = colors[Math.floor(Math.random() * colors.length)];
    const newCircle = {
        color: colorSelection,
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height)
    };

    const response = await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCircle)
    });
    await loadData();
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    myDots.forEach(dot => {
        const d = Math.hypot(mouseX - dot.x, mouseY - dot.y);
        if (d < 20) {
            if (e.shiftKey) {
                dot.updateColor();
            } else {
                dot.remove();
            }
        }
    });
});

addButton.addEventListener('click', handlePost);

// Initial load
loadData();