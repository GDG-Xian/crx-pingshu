var DB_SIZE = 5 * 1024 * 1024; var db = openDatabase('pingshu', '1.0', 'Ping Shu', DB_SIZE); 
function db_error(tx, e) {
    console.log(e);
}

function init_db() {
    db.transaction(function(tx) {
        tx.executeSql(get_sql('create-table-genres'), null, null, db_error);
        tx.executeSql(get_sql('create-table-albums'), null, null, db_error);
        tx.executeSql(get_sql('create-table-tracks'), null, null, db_error);
    });
}

function save_genre(id, name) {
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO GENRES VALUES(?, ?)', [id, name], null, db_error);
    });
}

function save_album(id, name, url, genre_id) {
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO ALBUMS VALUES(?, ?, NULL, ?, ?)', 
            [id, name, url, genre_id], null, db_error);
    });
}

function fetch_data() {
    $.get('http://www.5ips.net', function(html) {
        var $doc = $(html.replace(/(<script.*?\/script>|<img.*?>|<iframe.*?\/iframe>)/ig, ''));
        $doc.find('.tong_dir > ul').each(function(genre_id) {
            var $genre = $(this);

            // 抓取并保存评书分类
            var genre_name = $genre.find('> div').text().substring(1);
            save_genre(genre_id, genre_name);

            // 抓取并保存评书专辑
            $genre.find('> li a').each(function(i) {
                var $album = $(this);
                var album_name = $album.text();
                var album_url = $.trim($album.attr('href'));
                var album_id = album_url.replace(/(^http.*\/|\.htm$)/ig, '');
                save_album(album_id, album_name, album_url, genre_id);
            });
        });
    });
}

function get_genres(callback) { 
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM GENRES', [], callback, db_error);
    });
}

function get_albums(genre_id, callback) {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM ALBUMS WHERE GENRE_ID=?', [genre_id], callback, db_error);
    });
}
init_db();
// fetch_data();
