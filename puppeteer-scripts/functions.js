refreshAutonumber = function(ractive) {
    var list = {};
    var artcount = 0;
    var parcount = {};

    var articles = ractive.findAll('.article')
    articles.forEach(function (article) {
        var ref = article.getAttribute('data-reference') + "";
        if (ref.indexOf('.') < 0) {
            if (typeof list[ref] === 'undefined') list[ref] = ++artcount;
        } else {
            var parts = ref.split('.');
            if (typeof parcount[parts[0]] === 'undefined') parcount[parts[0]] = 0;
            if (typeof list[ref] === 'undefined') {
                list[ref] = list[parts[0]] + '.';

                if (this.tagName == 'LI' && !$(article).is(':visible')) {
                    list[ref] += parcount[parts[0]];
                } else {
                    list[ref] += (++parcount[parts[0]]);
                }

            }
        }
    });
    if (ractive.get('$') != list)
        ractive.set('$', list);
}

removeEmptyListItems = function(jqueryNode) {
    jqueryNode.find('li').each(function () {
        var $li = $(this);
        if ($li.text().length == 0) $li.remove();
    });
}

preservePagebreaks = function(jqueryNode) {
    jqueryNode.find('[style*=break-]').each(function () {
        var $pageBreak = $(this);
        var $span = $pageBreak.find('span');
        $span.html('&nbsp;');
    });
}