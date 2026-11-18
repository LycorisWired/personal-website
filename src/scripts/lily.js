(function() {
    var cv = document.getElementById('wire'),
        ctx = cv.getContext('2d', {
            willReadFrequently: true
        });
    var W = 280,
        H, t = 0,
        ps = [];
    var B = [
        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5]
    ];
    var P = [
        [2, 4, 10],
        [10, 17, 40],
        [74, 124, 191],
        [220, 230, 249]
    ];

    function size() {
        H = Math.max(1, Math.floor(W * innerHeight / innerWidth));
        cv.width = W;
        cv.height = H;
        ps = [];
        for (var i = 0; i < 40; i++) ps.push({
            x: Math.random() * W,
            y: Math.random() * H,
            s: Math.random() * 1.2 + .4,
            vy: Math.random() * .03 + .01,
            vx: (Math.random() - .5) * .02
        });
    }

    function blob(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, Math.max(r, 1), 0, 6.2832);
        ctx.fill();
    }
    var seed = 7;

    function rnd() {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647
    }
    var ST = [],
        PT = [],
        n, sd;
    for (n = 0; n < 24; n++) {
        sd = n % 2 ? 1 : -1;
        var low = n >= 20;
        ST.push({
            s: sd,
            ox: (rnd() - .5) * 18,
            oy: (rnd() - .3) * 14,
            L: low ? 24 + rnd() * 20 : 50 + rnd() * 58,
            d: low ? 26 + rnd() * 14 : 8 + rnd() * 34,
            r: 12 + rnd() * 18,
            ph: rnd() * 6.28
        })
    }
    for (n = 0; n < 11; n++) {
        PT.push({
            a: n < 8 ? -2.9 + n * (2.6 / 7) : 1.0 + (n - 8) * .55,
            len: 30 + rnd() * 14,
            cu: (rnd() > .5 ? 1 : -1) * (1.2 + rnd() * 1.4),
            g: 140 + Math.floor(rnd() * 90),
            ph: rnd() * 6.28,
            ox: (rnd() - .5) * 10
        })
    }

    function ribbon(x, y, a, len, cu, wm, ph, k) {
        var N = 14,
            sp = len * k / N,
            h, px = x,
            py = y,
            L = [],
            R = [],
            u, w, nx, ny, i;
        for (i = 0; i <= N; i++) {
            u = i / N;
            h = a + cu * u * u;
            w = wm * k * Math.sin(Math.PI * Math.pow(u, .6)) * (1 + .3 * Math.sin(u * 16 + ph + t * 1.2)) + .2;
            nx = -Math.sin(h);
            ny = Math.cos(h);
            L.push([px + nx * w, py + ny * w]);
            R.push([px - nx * w, py - ny * w]);
            px += Math.cos(h) * sp;
            py += Math.sin(h) * sp;
        }
        ctx.beginPath();
        ctx.moveTo(L[0][0], L[0][1]);
        for (i = 1; i <= N; i++) ctx.lineTo(L[i][0], L[i][1]);
        for (i = N; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function lily(cx, cy, k) {
        var br = 1 + Math.sin(t * .5) * .05,
            sw = Math.sin(t * .6),
            i, p, q, g;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#d8d8d8';
        ctx.lineWidth = 3 * k;
        ctx.beginPath();
        ctx.moveTo(cx + sw * 2 * k, H + 5);
        ctx.quadraticCurveTo(cx - 6 * k, cy + (H - cy) * .5, cx, cy + 10 * k);
        ctx.stroke();
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = .9 * k;
        for (i = 0; i < ST.length; i++) {
            q = ST[i];
            var ox = cx + q.ox * k,
                oy = cy + (q.oy + 6) * k,
                Lx = q.L * k * br,
                dd = q.d * k * (1 + Math.sin(t * .8 + q.ph) * .08),
                rr = q.r * k;
            var tx = ox + q.s * Lx + Math.sin(t * .7 + q.ph) * 2 * k,
                ty = oy + dd - rr + Math.cos(t * .9 + q.ph) * 1.5 * k;
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.bezierCurveTo(ox + q.s * Lx * .35, oy + dd * 1.3, ox + q.s * Lx * .9, oy + dd * 1.2, tx, ty);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(tx, ty - 1.2 * k, .9 * k, 2 * k, q.s * -.25, 0, 6.2832);
            ctx.fill();
        }
        for (i = 0; i < PT.length; i++) {
            p = PT[i];
            g = p.g;
            ctx.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = .7 * k;
            ribbon(cx + p.ox * k, cy + Math.sin(p.ph) * 3 * k, p.a + Math.sin(t * .5 + p.ph) * .06, p.len * br, p.cu, 5.5, p.ph, k);
        }
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#fff';
    }

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        var k = Math.min(H, W * .6) / 160,
            cx = W / 2,
            cy = H / 2 - 8 * k;
        lily(cx, cy, k);
        ps.forEach(function(p) {
            blob(p.x, p.y, p.s);
            p.y += p.vy;
            p.x += p.vx;
            if (p.y > H + 5) {
                p.y = -5;
                p.x = Math.random() * W
            }
        });
        var img = ctx.getImageData(0, 0, W, H),
            d = img.data,
            src = new Uint8Array(W * H),
            i, x, y;
        for (i = 0; i < src.length; i++) src[i] = d[i * 4];
        for (y = 0; y < H; y++)
            for (x = 0; x < W; x++) {
                var b = src[y * W + x] / 255,
                    th = (B[y % 4][x % 4] + .5) / 16,
                    c;
                if (b === 0) c = P[0];
                else if (b > th + .5) c = P[3];
                else if (b > th + .2) c = P[2];
                else c = P[1];
                i = (y * W + x) * 4;
                d[i] = c[0];
                d[i + 1] = c[1];
                d[i + 2] = c[2];
                d[i + 3] = 255;
            }
        ctx.putImageData(img, 0, 0);
    }
    size();
    draw();
    var still = matchMedia('(prefers-reduced-motion:reduce)').matches;

    function loop() {
        if (!document.hidden) {
            t += .02;
            draw()
        }
        requestAnimationFrame(loop)
    }
    if (!still) loop();
    addEventListener('resize', function() {
        size();
        draw()
    });


})();
