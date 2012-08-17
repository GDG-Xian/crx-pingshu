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

function fetch_data() {
    $.get('http://www.5ips.net', function(html) {
        var $doc = $(html.replace(/(<script.*?\/script>|<img.*?>|<iframe.*?\/iframe>)/ig, ''));
        $doc.find('.tong_dir > ul').each(function(i) {
            var $genres = $(this);
            var genres_name = $genres.find('> div').text().substring(1);
            save_genre(i, genres_name);
        });
    });
}

init_db();
fetch_data();
