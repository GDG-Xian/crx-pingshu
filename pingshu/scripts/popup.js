var app = chrome.extension.getBackgroundPage();
var tpl = {
    genre: '<dt id="genre-%{ID}" class="genre">%{NAME}</dt><dd><ul class="list"></ul></dd>',
    album: '<li id="album-%{ID}" data-id="%{ID}" data-url="%{URL}" class="album" data-title="%{NAME}" title="${NAME}"><a href="#">%{NAME}</a></li>',
    track: '<li id="track-%{ID}" data-trace="%{TRACE}" data-url="%{URL}" data-mp3="%{MP3}" class="track"><a href="#">%{TITLE}</a></li>'
};

$(function() {
    var $track_list = $('#track-list');
    var $album_list = $('#album-list');
    var $navbar = $('#navbar');
    var $nav_track_list = $('#nav-track-list');
    var $nav_album_list = $('#nav-album-list');

    function init_nav_tabs() {
        $('navs a').click(function(evt) {
            evt.preventDefault();

            var $this = $(this);
            var current = $navbar.data('current');

            $navbar.find('a[href=' + current + ']').removeClass('current');
            $(current).hide();
            var target_selector = $this.attr('href');
            var $target_container = $(target_selector);
            $target_container.show();
            $navbar.data('current', target_selector);
            $this.addClass('current');
        });
    }

    // 初始化导航标签
    init_nav_tabs();
    $nav_album_list.trigger('click');

    $('.genre').live('click', function() {
        $(this).next('dd').slideToggle('fast'); 
    });

    $('.album').live('click', function() {
        var $this = $(this);
        var album = $this.data();
        app.get_tracks(album, function(tracks) {
            $nav_track_list.html(album.title).show().trigger('click');
            $track_list.empty();
            $.each(tracks, function(i, track) {
                $(fmt(tpl.track, track)).appendTo($track_list);
            }); 
        });
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
