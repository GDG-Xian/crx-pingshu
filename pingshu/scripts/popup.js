var app = chrome.extension.getBackgroundPage();
var tpl = {
    genre: '<dt id="genre-%{ID}" class="genre">%{NAME}</dt><dd><ul class="list"></ul></dd>',
    album: '<li id="album-%{ID}" class="album"><a href="#">%{NAME}</a></li>'
};

$(function() {
    $('.genre').live('click', function() {
        $(this).next('dd').slideToggle('fast'); 
    });


    app.get_genres(function(tx, rs) {
        var $album_list = $('#album-list');
        for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            var $genre = $(fmt(tpl.genre, row));
            $genre.data(row);
            $album_list.append($genre);
            load_albums($genre);
        }
    });

    function load_albums($genre) {
        var genre_id = $genre.data('ID');
        app.get_albums(genre_id, function(tx, rs) {
            var $album_list = $genre.find('.list');
            for (var i = 0; i < rs.rows.length; i++) {
                var row = rs.rows.item(i);
                var $album = $(fmt(tpl.album, row));
                $album.data(row);
                $album_list.append($album);
            }
        });
    }
});
