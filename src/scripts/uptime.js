(function() {
    var up = document.getElementById('up'),
        t0 = Date.now();

    function pad(n) {
        return (n < 10 ? '0' : '') + n
    }
    setInterval(function() {
        var s = Math.floor((Date.now() - t0) / 1000);
        if (up) up.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60)
    }, 1000);


})();
