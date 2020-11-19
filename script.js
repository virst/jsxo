class GameField {
    constructor() {
        this.Field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.nextX = true;
    }

    Winner() {
        for (let i = 0; i < 3; i++)
            if (this.Field[i * 3] > 0 && this.Field[i * 3] == this.Field[i * 3 + 1] && this.Field[i * 3] == this.Field[i * 3 + 2]) return this.Field[i * 3];
        for (let i = 0; i < 3; i++)
            if (this.Field[i] > 0 && this.Field[i] == this.Field[i + 3] && this.Field[i] == this.Field[i + 6]) return this.Field[i];

        if (this.Field[0] > 0 && this.Field[0] == this.Field[4] && this.Field[0] == this.Field[8]) return this.Field[0];
        if (this.Field[2] > 0 && this.Field[2] == this.Field[4] && this.Field[2] == this.Field[6]) return this.Field[2];

        for (let n of this.Field)
            if (n == 0) return 0;
        return 255;
    }

    Clone() {
        var g = new GameField();
        g.Field = [...this.Field];
        g.nextX = this.nextX;
        return g;
    }

    MakeMove(n) {
        if (n < 0 || n > 8) return null;
        if (this.Field[n] != 0) return null;
        this.Field[n] = this.nextX ? 1 : 2;
        this.nextX = !this.nextX;
        return this.Clone();
    }
}

function AllMoves(gs) {
    let m = [];
    if (gs.Winner() == 0)
        for (let i = 0; i < 9; i++)
            if (gs.Field[i] == 0) m.push(i);
    return m;
}

class MovisHierarhy {
    constructor(gs) {
        this.Hierarhy = [];
        this.Move = 0;
        this.Price = 0;
        let am = AllMoves(gs);
        for (let m of am) {
            var no = new MovisHierarhy(gs.Clone().MakeMove(m));
            no.Move = m;
            this.Hierarhy.push(no);
        }
        let w = gs.Winner();
        if (w == 2) this.Price = 100000;
        else if (w == 1) this.Price = -10000;
        else if (this.Hierarhy.length == 0) this.Price = 0;
        else {

            var b = this.Hierarhy.sort(function (a, b) { return b.Price - a.Price; })[0];
            this.Price = this.Hierarhy.reduce(function (a, b) { return a + b.Price; },0) / 10;
            /*for (let i = 0; i < this.Hierarhy.length; i++)
                this.Price += this.Hierarhy[i].Price;
            this.Price /= 10;*/            
            this.BestMove = b.Move;
        }
    }
}

var gf = new GameField();

window.onload = function () {
    var gz = document.getElementById("GameZone");
    var tds = gz.getElementsByTagName("td");
    for (let i = 0; i < tds.length; i++) {
        tds[i].innerHTML = " ";
        tds[i].id = "Cell_" + i;
        tds[i].onclick = function () { CellClick(tds[i], i) }
    }
    console.log(tds.length);
}

function CellClick(e, n) {
    if (gf.MakeMove(n) != null) {
        if (!gf.nextX) {
            e.innerHTML = "X";
            e.className = "x";
            var bm = new MovisHierarhy(gf.Clone()).BestMove;
            console.log(bm);
            var cl = document.getElementById("Cell_" + bm);
            CellClick(cl, bm);
        } else {
            e.innerHTML = "O";
            e.className = "o";
        }
    }
    let w = gf.Winner();
    if (w != 0) {
        switch (w) {
            case 1: alert("X is Win"); break;
            case 2: alert("O is Win"); break;
            default: alert("DRAF");
        }
    }
}